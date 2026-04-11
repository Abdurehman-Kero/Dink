import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Star, Bookmark, Minus, Plus, Ticket, 
  Share2, ChevronLeft, ChevronRight, Check, AlertCircle, 
  Users, Award, Coffee, Heart, ExternalLink, 
  Download, QrCode, ShoppingBag, Shield, CreditCard,
  Wifi, Car, Accessibility, UtensilsCrossed, Mic2, Navigation
} from 'lucide-react';
import { eventAPI } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { ReviewSection } from '../../components/groupC/ReviewSection';
import { EventMap } from '../../components/groupC/EventMap';

export function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await eventAPI.getById(eventId);
      if (response.success) {
        setEvent(response.event);
        setTicketTypes(response.ticket_types || []);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (ticketId, delta) => {
    setQuantities(prev => {
      const current = prev[ticketId] || 1;
      const newValue = Math.max(1, Math.min(10, current + delta));
      return { ...prev, [ticketId]: newValue };
    });
  };

  const handleBuyTicket = (ticket) => {
    if (!isAuthenticated) {
      alert('Please login to purchase tickets');
      navigate('/login', { state: { from: `/event/${eventId}` } });
      return;
    }

    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const confirmPurchase = () => {
    const quantity = quantities[selectedTicket.id] || 1;
    setSaving(true);
    
    const checkoutItems = [{
      id: `res_${Date.now()}`,
      event_id: event.id,
      event: {
        id: event.id,
        title: event.title,
        image_url: event.banner_url,
        date: event.start_datetime,
        location: event.venue_name || event.city
      },
      ticket_type: selectedTicket,
      quantity: quantity,
      subtotal: quantity * selectedTicket.price,
      service_fee: quantity * selectedTicket.price * 0.1,
      total_price: quantity * selectedTicket.price * 1.1,
      reserved_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    }];
    
    localStorage.setItem('checkoutReservations', JSON.stringify(checkoutItems));
    setShowTicketModal(false);
    setSaving(false);
    navigate('/checkout');
  };

  const handleSaveEvent = () => {
    if (!isAuthenticated) {
      alert('Please login to save events');
      navigate('/login');
      return;
    }
    setIsSaved(!isSaved);
    alert(isSaved ? 'Event removed from saved list' : 'Event saved!');
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Event link copied to clipboard!');
    setShowShareMenu(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Time TBD';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin size-12 border-4 border-green-200 border-t-green-600 rounded-full mb-4" />
          <p className="text-gray-500">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="size-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Event not found</p>
          <Link to="/discover" className="text-green-600 hover:text-green-700 underline">Back to events</Link>
        </div>
      </div>
    );
  }

  const totalSelectedQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = ticketTypes.reduce((sum, ticket) => {
    return sum + (quantities[ticket.id] || 0) * ticket.price;
  }, 0);

  const galleryImages = [
    event.banner_url,
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735'
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ethiopian Tricolor Accent */}
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition">
            <ChevronLeft className="size-5" /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={galleryImages[activeImageIndex]} alt={event.title} className="w-full h-[300px] md:h-[400px] object-cover" />
                {event.is_featured && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-yellow-400 text-gray-900 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Award className="size-4" /> Featured
                  </div>
                )}
              </div>
              {galleryImages.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImageIndex ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Event Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                <Ticket className="size-4" /> {event.category_name || 'Event'}
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{event.title}</h1>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="font-semibold">{formatDate(event.start_datetime)}</div>
                    <div className="text-sm text-gray-300">{formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-red-400 mt-0.5" />
                  <div>
                    <div className="font-semibold">{event.venue_name || 'Venue TBD'}</div>
                    <div className="text-sm text-gray-300">{event.address_line1}, {event.city}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => {
                  const firstTicket = ticketTypes[0];
                  if (firstTicket) handleBuyTicket(firstTicket);
                }} className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition flex items-center gap-2 shadow-md">
                  <Ticket className="size-5" /> Buy Ticket
                </button>
                <button onClick={handleSaveEvent} className="px-5 py-3 rounded-xl font-semibold transition flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                  <Heart className={`size-5 ${isSaved ? 'fill-white' : ''}`} /> {isSaved ? 'Saved' : 'Save'}
                </button>
                <div className="relative">
                  <button onClick={() => setShowShareMenu(!showShareMenu)} className="px-5 py-3 rounded-xl font-semibold transition flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                    <Share2 className="size-5" /> Share
                  </button>
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-20">
                      <button onClick={handleShare} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Copy Link</button>
                      <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Share on Facebook</button>
                      <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Share on Twitter</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto bg-white rounded-t-2xl px-2">
          {[
            { id: 'details', label: 'Event Details', icon: Calendar },
            { id: 'tickets', label: 'Tickets', icon: Ticket },
            { id: 'location', label: 'Location', icon: MapPin },
            { id: 'reviews', label: 'Reviews', icon: Star }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <tab.icon className="size-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
            
            {event.rich_description_html && (
              <div className="mt-6 pt-6 border-t border-gray-100" dangerouslySetInnerHTML={{ __html: event.rich_description_html }} />
            )}
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Ticket Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ticketTypes.map((ticket) => (
                <div key={ticket.id} className={`border-2 rounded-xl p-5 transition-all ${quantities[ticket.id] > 0 ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{ticket.tier_name}</h3>
                      <p className="text-sm text-gray-500">{ticket.remaining_quantity} left</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{ticket.price}</div>
                      <div className="text-xs text-gray-500">ETB</div>
                    </div>
                  </div>
                  {ticket.benefits && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                      <Check className="size-3 text-green-600" />
                      {ticket.benefits}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleQuantityChange(ticket.id, -1)} className="size-8 flex items-center justify-center border rounded-lg hover:bg-gray-50">
                        <Minus className="size-4" />
                      </button>
                      <span className="font-semibold w-8 text-center">{quantities[ticket.id] || 1}</span>
                      <button onClick={() => handleQuantityChange(ticket.id, 1)} className="size-8 flex items-center justify-center border rounded-lg hover:bg-gray-50">
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <div className="text-sm font-semibold">Total: {((quantities[ticket.id] || 1) * ticket.price)} ETB</div>
                  </div>
                  <button onClick={() => handleBuyTicket(ticket)} disabled={ticket.remaining_quantity === 0} className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50">
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
            {ticketTypes.length === 0 && (
              <div className="text-center py-8 text-gray-500">No tickets available for this event</div>
            )}
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Location</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <MapPin className="size-4 text-red-500" />
                      Venue
                    </div>
                    <div className="text-gray-700">{event.venue_name || 'Venue TBD'}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Address</div>
                    <div className="text-gray-700">
                      {event.address_line1 || 'Address TBD'}<br />
                      {event.city}, Ethiopia
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Directions</div>
                    <a 
                      href={`https://maps.google.com/?q=${event.latitude || 9.0320},${event.longitude || 38.7469}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <Navigation className="size-4" />
                      Get Directions
                    </a>
                  </div>
                </div>
                <div className="h-80 rounded-xl overflow-hidden shadow-md">
                  <EventMap 
                    events={[event]} 
                    height="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <ReviewSection eventId={eventId} />
        )}
      </div>

      {/* Floating Cart Summary */}
      {totalSelectedQuantity > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-4 border min-w-[260px] animate-slideUp">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">Your Selection</span>
              <ShoppingBag className="size-5 text-green-600" />
            </div>
            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
              {ticketTypes.map(ticket => {
                const qty = quantities[ticket.id] || 0;
                if (qty === 0) return null;
                return (
                  <div key={ticket.id} className="flex justify-between text-sm">
                    <span>{ticket.tier_name} x{qty}</span>
                    <span>{qty * ticket.price} ETB</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-2 mb-3">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-green-600">{totalPrice} ETB</span>
              </div>
            </div>
            <button onClick={() => handleBuyTicket(ticketTypes[0])} className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scaleUp">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Ticket className="size-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Purchase</h3>
              <p className="text-gray-500 text-sm mt-1">Review your ticket selection</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Event</span>
                <span className="font-semibold text-gray-900">{event.title}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Ticket Type</span>
                <span className="font-semibold text-gray-900">{selectedTicket.tier_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Quantity</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleQuantityChange(selectedTicket.id, -1)} className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50">-</button>
                  <span className="font-semibold w-8 text-center">{quantities[selectedTicket.id] || 1}</span>
                  <button onClick={() => handleQuantityChange(selectedTicket.id, 1)} className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50">+</button>
                </div>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Service Fee (10%)</span>
                <span className="font-semibold text-gray-900">{((quantities[selectedTicket.id] || 1) * selectedTicket.price * 0.1).toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-bold">Total Price</span>
                <span className="font-bold text-xl text-green-600">{((quantities[selectedTicket.id] || 1) * selectedTicket.price * 1.1).toFixed(2)} ETB</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowTicketModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={confirmPurchase} disabled={saving} className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50">
                {saving ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">You will have 15 minutes to complete checkout</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-scaleUp { animation: scaleUp 0.2s ease-out; }
      `}</style>
    </div>
  );
}
