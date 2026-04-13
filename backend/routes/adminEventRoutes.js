const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { prisma } = require('../config/database');

// Get all events (for admin)
router.get('/events', protect, authorize('admin'), async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        },
        organizer: {
          select: {
            full_name: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const mappedEvents = events.map((event) => {
      const { category, organizer, ...rest } = event;
      return {
        ...rest,
        category_name: category?.name || null,
        organizer_name: organizer?.full_name || null
      };
    });

    res.json({ success: true, events: mappedEvents });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete any event (admin)
router.delete('/events/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.checkInLog.deleteMany({ where: { event_id: id } });
      await tx.digitalTicket.deleteMany({ where: { event_id: id } });
      await tx.orderItem.deleteMany({ where: { event_id: id } });
      await tx.staffMember.deleteMany({ where: { event_id: id } });
      await tx.review.deleteMany({ where: { event_id: id } });
      await tx.ticketType.deleteMany({ where: { event_id: id } });
      await tx.event.delete({ where: { id } });
    });

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
