const { prisma } = require("../config/database");
const { generateId } = require("../utils/id");

const MAX_BANNER_URL_LENGTH = 2048;
const DATA_IMAGE_URL_REGEX = /^data:image\/[a-zA-Z0-9.+-]+;base64,/i;

const normalizeBannerUrl = (bannerUrl) => {
  if (!bannerUrl || typeof bannerUrl !== "string") {
    return null;
  }

  const trimmed = bannerUrl.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const isBase64ImageDataUrl = (value) =>
  typeof value === "string" && DATA_IMAGE_URL_REGEX.test(value);

const validateBannerUrl = (bannerUrl) => {
  if (!bannerUrl) {
    return null;
  }

  if (isBase64ImageDataUrl(bannerUrl)) {
    return "Banner image must be a regular hosted image URL (for example Cloudinary), not a base64 data URL.";
  }

  if (bannerUrl.length > MAX_BANNER_URL_LENGTH) {
    return `Banner image URL is too long. Maximum length is ${MAX_BANNER_URL_LENGTH} characters.`;
  }

  return null;
};

const withCategoryName = (event) => {
  const { category, ...rest } = event;
  return {
    ...rest,
    category_name: category?.name || null,
  };
};

// Get all events (public)
const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { status: "published" },
      include: {
        category: {
          select: { name: true },
        },
        ticket_types: {
          where: { is_active: true },
          select: {
            price: true,
            capacity: true,
            remaining_quantity: true,
          },
        },
      },
      orderBy: { start_datetime: "asc" },
    });

    res.json({ success: true, events: events.map(withCategoryName) });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get events by organizer (for organizer dashboard)
const getEventsByOrganizer = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await prisma.event.findMany({
      where: { organizer_id: organizerId },
      include: {
        category: {
          select: { name: true },
        },
        ticket_types: {
          where: { is_active: true },
          select: {
            id: true,
            tier_name: true,
            price: true,
            capacity: true,
            remaining_quantity: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json({ success: true, events: events.map(withCategoryName) });
  } catch (error) {
    console.error("Get events by organizer error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single event
const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        category: {
          select: { name: true },
        },
        ticket_types: {
          where: { is_active: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { ticket_types, ...eventData } = event;
    res.json({
      success: true,
      event: withCategoryName(eventData),
      ticket_types,
    });
  } catch (error) {
    console.error("Get event by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      category_id,
      event_type,
      description,
      start_datetime,
      end_datetime,
      city,
      venue_name,
      address_line1,
      banner_url,
      ticket_types,
    } = req.body;

    const organizerId = req.user.id;
    const normalizedCategoryId =
      typeof category_id === "string" ? category_id.trim() : "";

    if (req.user.role_id === 2) {
      const activePlatformBan = await prisma.ban.findFirst({
        where: {
          scope: "platform_organizer",
          status: "active",
          subject_user_id: organizerId,
        },
        select: {
          id: true,
          reason: true,
          created_at: true,
        },
      });

      if (activePlatformBan) {
        return res.status(403).json({
          success: false,
          code: "ORGANIZER_BANNED",
          message:
            "Your organizer account is currently banned and cannot create new events.",
          ban: activePlatformBan,
        });
      }
    }

    if (!normalizedCategoryId) {
      return res.status(400).json({ message: "Category is required" });
    }

    const categoryExists = await prisma.eventCategory.findUnique({
      where: { id: normalizedCategoryId },
      select: { id: true },
    });

    if (!categoryExists) {
      return res.status(400).json({
        message:
          "Invalid category selected. Please refresh the page and choose a valid category.",
        field: "category_id",
      });
    }

    const normalizedBannerUrl = normalizeBannerUrl(banner_url);
    const bannerValidationError = validateBannerUrl(normalizedBannerUrl);

    if (bannerValidationError) {
      return res.status(400).json({ message: bannerValidationError });
    }

    const createdEvent = await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          id: generateId(),
          organizer_id: organizerId,
          title,
          category_id: normalizedCategoryId,
          event_type,
          description,
          start_datetime: new Date(start_datetime),
          end_datetime: new Date(end_datetime),
          city,
          venue_name,
          address_line1,
          banner_url: normalizedBannerUrl,
          status: "published",
        },
      });

      if (ticket_types && ticket_types.length > 0) {
        const validTickets = ticket_types
          .filter((ticket) => ticket.price && ticket.capacity)
          .map((ticket) => ({
            id: generateId(),
            event_id: event.id,
            tier_name: ticket.tier_name,
            price: Number(ticket.price),
            currency: "ETB",
            capacity: Number(ticket.capacity),
            remaining_quantity: Number(
              ticket.remaining_quantity || ticket.capacity,
            ),
            benefits: ticket.benefits || null,
            is_active: true,
          }));

        if (validTickets.length > 0) {
          await tx.ticketType.createMany({ data: validTickets });
        }
      }

      return event;
    });

    res.status(201).json({ success: true, event_id: createdEvent.id });
  } catch (error) {
    console.error("Create event error:", error);

    if (error?.code === "P2000") {
      return res.status(400).json({
        message:
          "One or more fields exceed the allowed size. Please shorten your input and try again.",
        field: error?.meta?.target || null,
      });
    }

    if (error?.code === "P2003") {
      return res.status(400).json({
        message:
          "Invalid category selected. Please refresh categories and try again.",
        field: "category_id",
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      title,
      description,
      start_datetime,
      end_datetime,
      city,
      venue_name,
      address_line1,
      banner_url,
    } = req.body;
    const normalizedBannerUrl = normalizeBannerUrl(banner_url);
    const bannerValidationError = validateBannerUrl(normalizedBannerUrl);

    if (bannerValidationError) {
      return res.status(400).json({ message: bannerValidationError });
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        start_datetime: new Date(start_datetime),
        end_datetime: new Date(end_datetime),
        city,
        venue_name,
        address_line1,
        banner_url: normalizedBannerUrl,
      },
    });

    res.json({ success: true, message: "Event updated successfully" });
  } catch (error) {
    console.error("Update event error:", error);

    if (error?.code === "P2000") {
      return res.status(400).json({
        message:
          "One or more fields exceed the allowed size. Please shorten your input and try again.",
        field: error?.meta?.target || null,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.event.delete({ where: { id: eventId } });

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get featured events
const getFeaturedEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        is_featured: true,
        status: "published",
      },
      include: {
        category: {
          select: { name: true },
        },
      },
      take: 6,
    });

    res.json({ success: true, events: events.map(withCategoryName) });
  } catch (error) {
    console.error("Get featured events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getEvents,
  getEventsByOrganizer,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getFeaturedEvents,
};
