import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Bookmark,
  Minus,
  Plus,
  Ticket,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Users,
  Award,
  Coffee,
  Music,
  Heart,
  ExternalLink,
  Download,
  QrCode,
  ShoppingBag,
  Shield,
  CreditCard,
  Wifi,
  Car,
  Accessibility,
  UtensilsCrossed,
  Mic2,
  Video,
} from "lucide-react";

// Ethiopian Event Data
const ETHIOPIAN_EVENTS_DETAIL = {
  '1': {
    id: '1',
    title: 'ታላቁ የኢትዮጵያ ቡና ፌስቲቫል | Great Ethiopian Coffee Festival',
    description: `በዓለም ታዋቂ የሆነውን የኢትዮጵያ ቡና በዓል አንድ ላይ እንከብራለን። ይህ ፌስቲቫል የኢትዮጵያን የቡና ባህል ለማሳየት የሚያገለግል ሲሆን በዓለም ደረጃ ታዋቂ የሆኑ የቡና አምራቾች፣ ተመራማሪዎች እና አድናቂዎች ይሳተፋሉ።

በዚህ ፌስቲቫል ላይ የሚከተሉትን ነገሮች ያገኛሉ፡
• የተለያዩ የቡና አይነቶችን መቅመስ
• ባህላዊ የቡና ሥነ ሥርዓት ማየት
• የቡና አዘገጃጀት ሥልጠናዎች
• የሙዚቃ እና የዳንስ ትርኢቶች
• የቡና ግዥ እድሎች`,
    long_description: `ታላቁ የኢትዮጵያ ቡና ፌስቲቫል በየዓመቱ በአዲስ አበባ የሚካሄድ ትልቁ የቡና በዓል ነው። በዚህ ዝግጅት ላይ ከሀገር ውስጥና ከውጭ የመጡ የቡና አምራቾች፣ ተመራማሪዎች እና አድናቂዎች ይሳተፋሉ። ፌስቲቫሉ የኢትዮጵያን የቡና ባህል፣ ታሪክ እና የወደፊት እድሎች ለማሳየት ያለመ ነው።

ዝግጅቱ ሶስት ቀናት የሚቆይ ሲሆን በዚህ ጊዜ ውስጥ የተለያዩ እንቅስቃሴዎች ይካሄዳሉ። በመጀመሪያው ቀን የመክፈቻ ሥነ ሥርዓት እና የባህላዊ ውዝዋዜ ይካሄዳል። በሁለተኛው ቀን የቡና ቅመስ ውድድር እና የሙዚቃ ትርኢት ይኖራል። በሶስተኛው ቀን ደግሞ የመዝጊያ ሥነ ሥርዓት እና የቡና ግዥ ይካሄዳል።`,
    image_url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31',
    gallery: [
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735'
    ],
    category_id: 'cultural',
    category_name: 'ባህል | Cultural',
    start_date: '2024-12-15T09:00:00',
    end_date: '2024-12-17T18:00:00',
    location: 'Addis Ababa, Millennium Hall',
    city: 'Addis Ababa',
    venue: {
      name: 'Millennium Hall',
      address: 'Bole Road, Near Bole International Airport',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
      latitude: 9.0051,
      longitude: 38.7636,
      amenities: ['Parking', 'WiFi', 'Wheelchair Access', 'Food Court', 'Prayer Room']
    },
    min_price: 250,
    max_price: 1500,
    rating: 4.8,
    review_count: 234,
    tickets_left: 450,
    total_capacity: 2000,
    is_featured: true,
    is_trending: true,
    organizer: {
      name: 'Ethiopian Coffee Exporters Association',
      email: 'info@ethiopiancoffee.org',
      phone: '+251-111-234-567',
      website: 'www.ethiopiancoffee.org',
      logo: 'https://via.placeholder.com/80'
    },
    ticket_types: [
      { id: 't1', tier_name: 'አጠቃላይ መግቢያ | General Admission', price: 250, currency: 'ETB', capacity: 1000, remaining_quantity: 450, benefits: ['Entry to all areas', 'Coffee tasting'] },
      { id: 't2', tier_name: 'VIP | VIP Access', price: 800, currency: 'ETB', capacity: 300, remaining_quantity: 120, benefits: ['Priority entry', 'VIP seating', 'Free coffee samples', 'Meet & greet'] },
      { id: 't3', tier_name: 'VVIP | VVIP Experience', price: 1500, currency: 'ETB', capacity: 100, remaining_quantity: 30, benefits: ['All VIP benefits', 'Backstage access', 'Dinner with speakers', 'Gift bag'] }
    ],
    schedule: [
      { day: 'Day 1 - Dec 15', time: '09:00 - 12:00', activity: 'Opening Ceremony & Cultural Performances' },
      { day: 'Day 1 - Dec 15', time: '14:00 - 17:00', activity: 'Coffee Exhibition & Tasting' },
      { day: 'Day 2 - Dec 16', time: '10:00 - 16:00', activity: 'Coffee Competition & Workshops' },
      { day: 'Day 2 - Dec 16', time: '19:00 - 22:00', activity: 'Music Concert' },
      { day: 'Day 3 - Dec 17', time: '10:00 - 15:00', activity: 'Coffee Auction & Trade Fair' },
      { day: 'Day 3 - Dec 17', time: '16:00 - 18:00', activity: 'Closing Ceremony' }
    ],
    speakers: [
      { name: 'Dr. Tsegaye Abebe', title: 'Coffee Research Expert', company: 'Ethiopian Coffee Institute', image: 'https://via.placeholder.com/100' },
      { name: 'Mrs. Almaz Tadesse', title: 'Master Roaster', company: 'Almaz Coffee', image: 'https://via.placeholder.com/100' }
    ],
    reviews: [
      { id: 'r1', user_name: 'Abebe Kebede', rating: 5, review_text: 'እጅግ በጣም ጥሩ ተሞክሮ ነበር! የቡና ቅመስ እና የባህላዊ ውዝዋዜ በጣም አስደሰተኝ።', date: '2024-01-15' },
      { id: 'r2', user_name: 'Helen Mekonnen', rating: 4, review_text: 'Great event! The coffee tasting was amazing. Would recommend to all coffee lovers.', date: '2024-01-10' },
      { id: 'r3', user_name: 'Michael Dawit', rating: 5, review_text: 'በጣም ጥሩ ዝግጅት ነበር። የቡና ታሪክ በደንብ ተረዳሁ።', date: '2024-01-08' }
    ]
  }
};

export function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (eventId) {
      loadEvent(eventId);
    }
  }, [eventId]);

  const loadEvent = async (id) => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setEvent(ETHIOPIAN_EVENTS_DETAIL[id] || ETHIOPIAN_EVENTS_DETAIL["1"]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error loading event:", error);
      setLoading(false);
    }
  };

  const handleQuantityChange = (ticketId, delta) => {
    setQuantities((prev) => {
      const current = prev[ticketId] || 1;
      const newValue = Math.max(1, Math.min(10, current + delta));
      return { ...prev, [ticketId]: newValue };
    });
  };

  const handleBuyTicket = (ticket) => {
    const isAuthenticated = localStorage.getItem("authToken");
    if (!isAuthenticated) {
      alert("Please login to purchase tickets");
      navigate("/login", { state: { from: `/event/${eventId}` } });
      return;
    }

    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const confirmPurchase = () => {
    const quantity = quantities[selectedTicket.id] || 1;
    setSaving(true);
    setTimeout(() => {
      // Save to localStorage for checkout
      const checkoutItems = [
        {
          id: `res_${Date.now()}`,
          event_id: event.id,
          event: {
            id: event.id,
            title: event.title,
            image_url: event.image_url,
          },
          ticket_type: selectedTicket,
          quantity: quantity,
          subtotal: quantity * selectedTicket.price,
          service_fee: quantity * selectedTicket.price * 0.1,
          total_price: quantity * selectedTicket.price * 1.1,
          reserved_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        },
      ];
      localStorage.setItem(
        "checkoutReservations",
        JSON.stringify(checkoutItems),
      );
      setShowTicketModal(false);
      setSaving(false);
      navigate("/checkout"); // ← Change this line
    }, 1000);
  };
  // In EventDetailPage.jsx, find the handleSaveEvent function and replace with this:

  const handleSaveEvent = () => {
    const isAuthenticated = localStorage.getItem("authToken");
    if (!isAuthenticated) {
      alert("Please login to save events");
      navigate("/login", { state: { from: `/event/${eventId}` } });
      return;
    }

    // Get existing saved events from localStorage
    const savedEvents = JSON.parse(localStorage.getItem("savedEvents") || "[]");

    if (isSaved) {
      // Remove from saved
      const newSavedEvents = savedEvents.filter((id) => id !== event.id);
      localStorage.setItem("savedEvents", JSON.stringify(newSavedEvents));
      setIsSaved(false);

      // Also remove from checkout reservations
      const checkoutItems = JSON.parse(
        localStorage.getItem("checkoutReservations") || "[]",
      );
      const filteredItems = checkoutItems.filter(
        (item) => item.event_id !== event.id,
      );
      localStorage.setItem(
        "checkoutReservations",
        JSON.stringify(filteredItems),
      );

      alert("Event removed from saved list");
    } else {
      // Add to saved events
      const newSavedEvents = [...savedEvents, event.id];
      localStorage.setItem("savedEvents", JSON.stringify(newSavedEvents));
      setIsSaved(true);

      // Create a reservation item for the cart
      const checkoutItems = JSON.parse(
        localStorage.getItem("checkoutReservations") || "[]",
      );

      // Check if event already exists in cart
      const existingItemIndex = checkoutItems.findIndex(
        (item) => item.event_id === event.id,
      );

      if (existingItemIndex === -1) {
        // Get the first ticket type as default
        const defaultTicket =
          event.ticket_types && event.ticket_types[0]
            ? event.ticket_types[0]
            : {
                id: "default",
                tier_name: "General Admission",
                price: event.min_price || 250,
                currency: "ETB",
              };

        const quantity = 1;
        const subtotal = defaultTicket.price * quantity;
        const serviceFee = subtotal * 0.1;

        const newItem = {
          id: `res_${Date.now()}_${event.id}`,
          event_id: event.id,
          event: {
            id: event.id,
            title: event.title,
            image_url: event.image_url,
            date: event.start_date,
            location: event.location || event.city,
          },
          ticket_type: {
            id: defaultTicket.id,
            tier_name: defaultTicket.tier_name,
            price: defaultTicket.price,
          },
          quantity: quantity,
          subtotal: subtotal,
          service_fee: serviceFee,
          total_price: subtotal + serviceFee,
          reserved_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        };
        checkoutItems.push(newItem);
        localStorage.setItem(
          "checkoutReservations",
          JSON.stringify(checkoutItems),
        );
      }

      // Show success message with option to view saved tickets
      const eventName = event.title.split("|")[0].trim();
      const goToSaved = window.confirm(
        `"${eventName}" has been saved to your tickets!\n\nWould you like to view your saved tickets now?`,
      );
      if (goToSaved) {
        navigate("/saved-tickets");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin size-16 border-4 border-green-200 border-t-green-600 rounded-full mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Coffee className="size-6 text-green-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500 mt-4">Loading event details...</p>
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
          <Link
            to="/discover"
            className="text-green-600 hover:text-green-700 underline"
          >
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  const totalSelectedQuantity = Object.values(quantities).reduce(
    (a, b) => a + b,
    0,
  );
  const totalPrice = event.ticket_types.reduce((sum, ticket) => {
    return sum + (quantities[ticket.id] || 0) * ticket.price;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ethiopian Tricolor Accent */}
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      {/* Hero Section with Image Gallery */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23fff' d='M10,10 L20,10 L15,20 Z'/%3E%3C/svg%3E")`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="size-5" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={event.gallery?.[activeImageIndex] || event.image_url}
                  alt={event.title}
                  className="w-full h-[400px] object-cover"
                />
                {event.is_featured && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-yellow-400 text-gray-900 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Award className="size-4" />
                    Featured
                  </div>
                )}
                {event.gallery && event.gallery.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {event.gallery.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === activeImageIndex ? "bg-white w-4" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              {event.gallery && event.gallery.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {event.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImageIndex ? "border-yellow-400" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Event Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                <Ticket className="size-4" />
                {event.category_name}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {event.title}
              </h1>

              {event.rating && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-5 ${i < Math.floor(event.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{event.rating}</span>
                  <span className="text-gray-300">
                    ({event.review_count} reviews)
                  </span>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="font-semibold">
                      {formatDate(event.start_date)}
                    </div>
                    <div className="text-sm text-gray-300">
                      {formatTime(event.start_date)} -{" "}
                      {formatTime(event.end_date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-red-400 mt-0.5" />
                  <div>
                    <div className="font-semibold">{event.venue.name}</div>
                    <div className="text-sm text-gray-300">
                      {event.venue.address}, {event.city}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="size-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-semibold">Organized by</div>
                    <div className="text-sm text-gray-300">
                      {event.organizer.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Coffee className="size-5 text-orange-400 mt-0.5" />
                  <div>
                    <div className="font-semibold">Availability</div>
                    <div className="text-sm text-gray-300">
                      {event.tickets_left} / {event.total_capacity} tickets
                      remaining
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{
                          width: `${(event.tickets_left / event.total_capacity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    const firstTicket = event.ticket_types[0];
                    if (firstTicket) handleBuyTicket(firstTicket);
                  }}
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Ticket className="size-5" />
                  Buy Ticket
                </button>
                <button
                  onClick={handleSaveEvent}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    isSaved
                      ? "bg-green-600 text-white"
                      : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <Heart className={`size-5 ${isSaved ? "fill-white" : ""}`} />
                  {isSaved ? "Saved" : "Save Event"}
                </button>
                <button className="px-6 py-3 rounded-xl font-semibold transition-all bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 flex items-center gap-2">
                  <Share2 className="size-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto">
          {[
            { id: "details", label: "Event Details", icon: Calendar },
            { id: "tickets", label: "Tickets", icon: Ticket },
            { id: "schedule", label: "Schedule", icon: Clock },
            { id: "location", label: "Location", icon: MapPin },
            { id: "reviews", label: "Reviews", icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Details Tab */}
          {activeTab === "details" && (
            <>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Coffee className="size-6 text-green-600" />
                  About This Event
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {event.long_description || event.description}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              {event.venue.amenities && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Venue Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {event.venue.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        {amenity === "Parking" && <Car className="size-4" />}
                        {amenity === "WiFi" && <Wifi className="size-4" />}
                        {amenity === "Wheelchair Access" && (
                          <Accessibility className="size-4" />
                        )}
                        {amenity === "Food Court" && (
                          <UtensilsCrossed className="size-4" />
                        )}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Featured Speakers
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker) => (
                      <div
                        key={speaker.name}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {speaker.name[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {speaker.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {speaker.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {speaker.company}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Ticket className="size-6 text-green-600" />
                Select Ticket Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.ticket_types.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      quantities[ticket.id] > 0
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {ticket.tier_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {ticket.remaining_quantity} left
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {ticket.price}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ticket.currency}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {ticket.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-center gap-2 text-xs text-gray-600"
                        >
                          <Check className="size-3 text-green-600" />
                          {benefit}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(ticket.id, -1)}
                          className="size-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="font-semibold text-gray-900 w-8 text-center">
                          {quantities[ticket.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(ticket.id, 1)}
                          className="size-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        Total: {(quantities[ticket.id] || 1) * ticket.price}{" "}
                        {ticket.currency}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyTicket(ticket)}
                      disabled={ticket.remaining_quantity === 0}
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
                    >
                      {ticket.remaining_quantity === 0 ? "Sold Out" : "Buy Now"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              {totalSelectedQuantity > 0 && (
                <div className="fixed bottom-6 right-6 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 min-w-[280px] animate-slideUp">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">
                        Your Selection
                      </span>
                      <ShoppingBag className="size-5 text-green-600" />
                    </div>
                    <div className="space-y-2 mb-3">
                      {event.ticket_types.map((ticket) => {
                        const qty = quantities[ticket.id] || 0;
                        if (qty === 0) return null;
                        return (
                          <div
                            key={ticket.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {ticket.tier_name} x{qty}
                            </span>
                            <span>{qty * ticket.price} ETB</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t pt-2 mb-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>{totalPrice} ETB</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBuyTicket(event.ticket_types[0])}
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Event Schedule
              </h2>
              <div className="space-y-4">
                {event.schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-32">
                      <div className="font-semibold text-green-600">
                        {item.time}
                      </div>
                      <div className="text-xs text-gray-500">{item.day}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {item.activity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === "location" && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Event Location
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <MapPin className="size-4 text-red-500" />
                      Venue
                    </div>
                    <div className="text-gray-700">{event.venue.name}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Address
                    </div>
                    <div className="text-gray-700">
                      {event.venue.address}
                      <br />
                      {event.city}, {event.venue.region}
                      <br />
                      {event.venue.country}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Directions
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${event.venue.latitude},${event.venue.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      Get Directions <ExternalLink className="size-4" />
                    </a>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                  <MapPin className="size-12 text-gray-400" />
                  <span className="text-gray-500 ml-2">Map View</span>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && event.reviews && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Attendee Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-gray-900">
                    {event.rating}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${i < Math.floor(event.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.review_count} reviews
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {event.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-6 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.user_name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {review.user_name}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`size-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">
                          {review.review_text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Purchase Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scaleUp">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Ticket className="size-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Confirm Purchase
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                You are about to reserve tickets
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Event</span>
                <span className="font-semibold text-gray-900">
                  {event.title.split("|")[0]}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Ticket Type</span>
                <span className="font-semibold text-gray-900">
                  {selectedTicket.tier_name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(selectedTicket.id, -1)}
                    className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="font-semibold text-gray-900 w-8 text-center">
                    {quantities[selectedTicket.id] || 1}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(selectedTicket.id, 1)}
                    className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total Price</span>
                <span className="font-bold text-xl text-green-600">
                  {(quantities[selectedTicket.id] || 1) * selectedTicket.price}{" "}
                  ETB
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTicketModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
              >
                {saving ? "Processing..." : "Confirm"}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              You will have 15 minutes to complete checkout
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-scaleUp {
          animation: scaleUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
