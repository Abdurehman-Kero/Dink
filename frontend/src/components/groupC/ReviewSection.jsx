import { useState, useEffect } from 'react';
import { Star, MessageCircle, ThumbsUp, Flag, Calendar, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function ReviewSection({ eventId }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reviews/event/${eventId}`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to leave a review');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ event_id: eventId, rating, review_text: reviewText })
      });
      const data = await response.json();
      if (data.success) {
        alert('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewText('');
        setRating(5);
        fetchReviews();
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Attendee Reviews</h2>
        {isAuthenticated && !showReviewForm && (
          <button onClick={() => setShowReviewForm(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
            Write a Review
          </button>
        )}
      </div>

      {/* Rating Summary */}
      <div className="flex items-center gap-4 pb-6 border-b mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">{stats.average.toFixed(1)}</div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`size-4 ${star <= Math.round(stats.average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">{stats.total} reviews</div>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter(r => Math.floor(r.rating) === star).length;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-6">{star}</span>
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Write Your Review</h3>
            <button onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star className={`size-6 transition-all ${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500"
              placeholder="Share your experience about this event..."
            />
          </div>
          <button
            onClick={handleSubmitReview}
            disabled={submitting || !reviewText.trim()}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review!</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-semibold">
                  {review.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="font-semibold text-gray-900">{review.full_name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`size-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <Calendar className="size-3" />
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{review.review_text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
