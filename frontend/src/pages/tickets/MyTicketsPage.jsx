import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ticket, Calendar, MapPin, Download, QrCode, 
  CheckCircle, Clock, AlertCircle, ChevronRight,
  Coffee, Music, Users, Star, Share2
} from 'lucide-react';

// Mock purchased tickets data
const MOCK_TICKETS = [
  {
    id: 'ticket_1',
    order_id: 'ORD-2024-001',
    event: {
      id: '1',
      title: 'ታላቁ የኢትዮጵያ ቡና ፌስቲቫል | Great Ethiopian Coffee Festival',
      image_url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31',
      category: 'Cultural',
      location: 'Millennium Hall, Addis Ababa',
      date: '2024-12-15',
      time: '09:00 AM'
    },
    ticket_type: {
      name: 'VIP Access',
      price: 800,
      benefits: ['Priority Entry', 'VIP Seating', 'Free Coffee Samples']
    },
    quantity: 2,
    seat_numbers: ['A12', 'A13'],
    purchase_date: '2024-11-15',
    qr_code: 'DEMS-VIP-001-2024',
    status: 'active',
    ticket_code: 'DEMS-TKT-8F3A2B1C'
  },
  {
    id: 'ticket_2',
    order_id: 'ORD-2024-002',
    event: {
      id: '2',
      title: 'ታላቁ የሐዋሳ ሙዚቃ ፌስቲቫል | Hawassa Music Festival',
      image_url: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c',
      category: 'Music',
      location: 'Lake Side Resort, Hawassa',
      date: '2024-11-20',
      time: '02:00 PM'
    },
    ticket_type: {
      name: 'General Admission',
      price: 250,
      benefits: ['Entry to all areas', 'Free Water']
    },
    quantity: 4,
    seat_numbers: null,
    purchase_date: '2024-10-20',
    qr_code: 'DEMS-GA-002-2024',
    status: 'active',
    ticket_code: 'DEMS-TKT-9G4B3C2D'
  },
  {
    id: 'ticket_3',
    order_id: 'ORD-2024-003',
    event: {
      id: '3',
      title: 'የጎንደር ባህላዊ ዳንስ ትርኢት | Gondar Traditional Dance',
      image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077',
      category: 'Cultural',
      location: 'Fasilides Castle, Gondar',
      date: '2024-10-10',
      time: '06:00 PM'
    },
    ticket_type: {
      name: 'Standard',
      price: 150,
      benefits: ['Entry', 'Traditional Coffee']
    },
    quantity: 2,
    seat_numbers: null,
    purchase_date: '2024-09-25',
    qr_code: 'DEMS-STD-003-2024',
    status: 'used',
    ticket_code: 'DEMS-TKT-7H5D4E3F'
  }
];

export function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setTickets(MOCK_TICKETS);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setLoading(false);
    }
  };

  const downloadTicket = (ticket) => {
    // Create a printable version of the ticket
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${ticket.event.title} - Ticket</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .ticket { border: 2px solid #333; border-radius: 12px; padding: 20px; max-width: 500px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 20px; }
            .qr { text-align: center; margin: 20px 0; }
            .details { margin: 20px 0; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h2>DEMS - Digital Ticket</h2>
              <p>${ticket.event.title}</p>
            </div>
            <div class="qr">
              <div style="display: inline-block; padding: 10px; background: #f0f0f0;">
                <div style="width: 150px; height: 150px; background: #000; color: #fff; display: flex; align-items: center; justify-content: center;">
                  QR: ${ticket.ticket_code}
                </div>
              </div>
            </div>
            <div class="details">
              <p><strong>Date:</strong> ${new Date(ticket.event.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${ticket.event.time}</p>
              <p><strong>Location:</strong> ${ticket.event.location}</p>
              <p><strong>Ticket Type:</strong> ${ticket.ticket_type.name}</p>
              <p><strong>Quantity:</strong> ${ticket.quantity}</p>
              <p><strong>Ticket Code:</strong> ${ticket.ticket_code}</p>
            </div>
            <div class="footer">
              <p>Scan this QR code at the event entrance</p>
              <p>© DEMS Event Platform</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.print();
  };

  const filteredTickets = tickets.filter(ticket => {
    if (activeFilter === 'upcoming') {
      return new Date(ticket.event.date) >= new Date() && ticket.status === 'active';
    }
    if (activeFilter === 'past') {
      return new Date(ticket.event.date) < new Date() || ticket.status === 'used';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin size-16 border-4 border-green-200 border-t-green-600 rounded-full mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Ticket className="size-6 text-green-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500 mt-4">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      {/* Ethiopian Tricolor Accent */}
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl shadow-lg mb-4">
            <Ticket className="size-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            ትኬቶቼ | My Tickets
          </h1>
          <p className="text-gray-600">Your digital ticket wallet</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 justify-center">
          {[
            { id: 'all', label: 'All Tickets', count: tickets.length },
            { id: 'upcoming', label: 'Upcoming', count: tickets.filter(t => new Date(t.event.date) >= new Date()).length },
            { id: 'past', label: 'Past', count: tickets.filter(t => new Date(t.event.date) < new Date()).length }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {filter.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeFilter === filter.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tickets Grid */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Ticket className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-6">You haven't purchased any tickets yet</p>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all"
            >
              Browse Events
              <ChevronRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Event Header */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={ticket.event.image_url}
                    alt={ticket.event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {ticket.status === 'active' && new Date(ticket.event.date) >= new Date() ? (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <CheckCircle className="size-3" />
                        Valid
                      </span>
                    ) : ticket.status === 'used' ? (
                      <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <Clock className="size-3" />
                        Used
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        Expired
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
                      {ticket.event.category}
                    </span>
                  </div>
                </div>

                {/* Ticket Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {ticket.event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="size-4 text-green-600" />
                      <span>{new Date(ticket.event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="size-4 text-red-500" />
                      <span>{ticket.event.location}</span>
                    </div>
                  </div>

                  {/* Ticket Details */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Ticket Type</span>
                      <span className="font-semibold text-gray-900">{ticket.ticket_type.name}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Quantity</span>
                      <span className="font-semibold text-gray-900">×{ticket.quantity}</span>
                    </div>
                    {ticket.seat_numbers && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Seats</span>
                        <span className="font-semibold text-gray-900">{ticket.seat_numbers.join(', ')}</span>
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Ticket Code</span>
                        <code className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                          {ticket.ticket_code}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-4 mb-4 border border-green-100">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center">
                        <QrCode className="size-12 text-gray-800" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">Scan this QR code at the event entrance</p>
                        <p className="text-xs font-mono text-green-600">{ticket.ticket_code}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      to={`/event/${ticket.event.id}`}
                      className="flex-1 px-4 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors text-center"
                    >
                      View Event
                    </Link>
                    <button
                      onClick={() => downloadTicket(ticket)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="size-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Ticket className="size-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Need help with your tickets?</h3>
                <p className="text-sm text-gray-500">Contact our support team for assistance</p>
              </div>
            </div>
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
