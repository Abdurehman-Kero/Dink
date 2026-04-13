const { prisma } = require('../config/database');
const { generateId } = require('../utils/id');

// Add a review for an event (testing mode - skip purchase check)
const addReview = async (req, res) => {
  try {
    const { event_id, rating, review_text } = req.body;
    const user_id = req.user.id;
    
    // TEMPORARY: Skip purchase check for testing
    // In production, uncomment the purchase check below
    
    // Check if already reviewed
    const existing = await prisma.review.findUnique({
      where: {
        user_id_event_id: {
          user_id,
          event_id
        }
      },
      select: { id: true }
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this event' });
    }

    await prisma.review.create({
      data: {
        id: generateId(),
        user_id,
        event_id,
        rating: Number(rating),
        review_text,
        status: 'visible'
      }
    });

    const avg = await prisma.review.aggregate({
      where: {
        event_id,
        status: 'visible'
      },
      _avg: {
        rating: true
      }
    });

    await prisma.event.update({
      where: { id: event_id },
      data: {
        avg_rating: Number(avg._avg.rating || 0)
      }
    });

    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reviews for an event
const getEventReviews = async (req, res) => {
  try {
    const { eventId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        event_id: eventId,
        status: 'visible'
      },
      include: {
        user: {
          select: { full_name: true }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const avgRating = await prisma.review.aggregate({
      where: {
        event_id: eventId,
        status: 'visible'
      },
      _avg: { rating: true },
      _count: { _all: true }
    });

    res.json({ 
      success: true, 
      reviews: reviews.map((review) => ({
        ...review,
        full_name: review.user?.full_name || ''
      })),
      stats: {
        average: Number(avgRating._avg.rating || 0),
        total: avgRating._count._all || 0
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Organizer response to review
const addReviewReply = async (req, res) => {
  try {
    const { review_id, reply_text } = req.body;
    const organizer_id = req.user.id;

    const review = await prisma.review.findUnique({
      where: { id: review_id },
      include: {
        event: {
          select: { organizer_id: true }
        }
      }
    });

    if (!review || review.event.organizer_id !== organizer_id) {
      return res.status(403).json({ message: 'Only the event organizer can reply to reviews' });
    }

    await prisma.reviewReply.create({
      data: {
        id: generateId(),
        review_id,
        organizer_id,
        reply_text
      }
    });

    res.json({ success: true, message: 'Reply added successfully' });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addReview, getEventReviews, addReviewReply };
