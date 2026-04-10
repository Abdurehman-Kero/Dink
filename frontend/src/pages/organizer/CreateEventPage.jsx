import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, DollarSign, ImageIcon, ArrowLeft, Upload, X, Ticket } from 'lucide-react';
import { eventAPI } from '../../api/client';

export function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    event_type: 'festival',
    description: '',
    start_datetime: '',
    end_datetime: '',
    venue_name: '',
    address_line1: '',
    city: 'Addis Ababa',
    ticket_types: [
      { tier_name: 'Normal', price: '', capacity: '', benefits: 'Standard entry' },
      { tier_name: 'VIP', price: '', capacity: '', benefits: 'Priority entry, VIP seating' },
      { tier_name: 'VVIP', price: '', capacity: '', benefits: 'All VIP benefits, Backstage access' }
    ]
  });

  // Correct category IDs from your database
  const categories = [
    { id: 'bafdcaba34a111f1adcc002b673858b6', name: 'Technology' },
    { id: 'bafdcadd34a111f1adcc002b673858b6', name: 'Music' },
    { id: 'bafdcae634a111f1adcc002b673858b6', name: 'Art & Culture' },
    { id: 'bafdcaf234a111f1adcc002b673858b6', name: 'Sports' },
    { id: 'bafdcafe34a111f1adcc002b673858b6', name: 'Educational' },
    { id: 'bafdcb0934a111f1adcc002b673858b6', name: 'Business' }
  ];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.ticket_types];
    updatedTickets[index][field] = value;
    setFormData(prev => ({ ...prev, ticket_types: updatedTickets }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate category is selected
    if (!formData.category_id) {
      alert('Please select a category');
      setLoading(false);
      return;
    }

    const validTicketTypes = formData.ticket_types.filter(t => t.price && t.capacity);
    
    const eventData = {
      title: formData.title,
      category_id: formData.category_id,
      event_type: formData.event_type,
      description: formData.description,
      start_datetime: formData.start_datetime,
      end_datetime: formData.end_datetime,
      city: formData.city,
      venue_name: formData.venue_name,
      address_line1: formData.address_line1,
      ticket_types: validTicketTypes.map(t => ({
        tier_name: t.tier_name,
        price: parseFloat(t.price),
        capacity: parseInt(t.capacity),
        remaining_quantity: parseInt(t.capacity),
        benefits: t.benefits
      }))
    };

    try {
      const response = await eventAPI.create(eventData);
      if (response.success) {
        alert('Event created successfully!');
        navigate('/organizer/dashboard');
      }
    } catch (error) {
      alert(error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button onClick={() => navigate('/organizer/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4">
            <ArrowLeft className="size-5" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl flex items-center justify-center">
              <Calendar className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
              <p className="text-gray-600">Fill in the details to create your event</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Ticket className="size-5 text-green-600" /> Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="e.g., Ethiopian Coffee Festival" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select name="event_type" value={formData.event_type} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                    <option value="festival">Festival</option>
                    <option value="conference">Conference</option>
                    <option value="concert">Concert</option>
                    <option value="workshop">Workshop</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="size-5 text-green-600" /> Banner Image
            </h2>
            {!bannerPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                <Upload className="size-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload banner image</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleBannerChange} />
              </label>
            ) : (
              <div className="relative">
                <img src={bannerPreview} alt="Banner preview" className="w-full h-48 object-cover rounded-xl" />
                <button type="button" onClick={() => setBannerPreview(null)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><X className="size-4" /></button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="size-5 text-green-600" /> Date & Time
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time *</label><input type="datetime-local" name="start_datetime" value={formData.start_datetime} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time *</label><input type="datetime-local" name="end_datetime" value={formData.end_datetime} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl" /></div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="size-5 text-green-600" /> Venue
            </h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label><input type="text" name="venue_name" value={formData.venue_name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Millennium Hall" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Address *</label><input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Bole Road" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl" /></div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="size-5 text-green-600" /> Ticket Types
            </h2>
            <div className="space-y-4">
              {formData.ticket_types.map((ticket, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{ticket.tier_name} Tickets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB)</label><input type="number" value={ticket.price} onChange={(e) => handleTicketChange(index, 'price', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl" placeholder="250" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label><input type="number" value={ticket.capacity} onChange={(e) => handleTicketChange(index, 'capacity', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl" placeholder="500" /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate('/organizer/dashboard')} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold disabled:opacity-50">
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
