import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, DollarSign, Users, Image as ImageIcon, ArrowLeft, Upload, X, Coffee, Music, Ticket } from 'lucide-react';

export function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    event_type: 'conference',
    description: '',
    start_datetime: '',
    end_datetime: '',
    venue_name: '',
    address: '',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    location_type: 'physical',
    normal_price: '',
    normal_capacity: '',
    vip_price: '',
    vip_capacity: '',
    vvip_price: '',
    vvip_capacity: '',
  });

  const categories = [
    { id: '1', name: '·â¥·ä≠·äñ·àé·åÇ | Technology', icon: 'Ì≤ª' },
    { id: '2', name: '·àô·ãö·âÉ | Music', icon: 'Ìæµ' },
    { id: '3', name: '·à•·äê ·å•·â†·â• | Art & Culture', icon: 'Ìæ®' },
    { id: '4', name: '·àµ·çñ·à≠·âµ | Sports', icon: '‚öΩ' },
    { id: '5', name: '·âµ·àù·àÖ·à≠·âµ | Education', icon: 'Ì≥ö' },
    { id: '6', name: '·äï·åç·ãµ | Business', icon: 'Ì≤º' },
    { id: '7', name: '·â£·àÖ·àç | Cultural', icon: 'Ìø∫' },
  ];

  const eventTypes = [
    'conference', 'festival', 'workshop', 'exhibition', 
    'sports', 'concert', 'seminar', 'cultural'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Event created successfully!');
      navigate('/organizer/dashboard');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerRemove = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      {/* Ethiopian Tricolor Accent */}
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/organizer/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4 transition-colors"
          >
            <ArrowLeft className="size-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl flex items-center justify-center shadow-md">
              <Calendar className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
              <p className="text-gray-600 mt-1">Fill in the details to create your event</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Ticket className="size-5 text-green-600" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="e.g., ·â≥·àã·âÅ ·ã®·ä¢·âµ·ãÆ·åµ·ã´ ·â°·äì ·çå·àµ·â≤·â´·àç | Great Ethiopian Coffee Festival"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    required
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    id="event_type"
                    name="event_type"
                    required
                    value={formData.event_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {eventTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your event in detail..."
                />
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="size-5 text-green-600" />
              Banner Image
            </h2>
            <div className="space-y-4">
              {!bannerPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="size-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (Recommended: 1920x1080px)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleBannerChange}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleBannerRemove}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="size-5 text-green-600" />
              Date & Time
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="start_datetime"
                  name="start_datetime"
                  required
                  value={formData.start_datetime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="end_datetime"
                  name="end_datetime"
                  required
                  value={formData.end_datetime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Venue */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="size-5 text-green-600" />
              Venue
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="venue_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  id="venue_name"
                  name="venue_name"
                  required
                  value={formData.venue_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Millennium Hall"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Street address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Types */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="size-5 text-green-600" />
              Ticket Types
            </h2>
            <div className="space-y-4">
              {/* Normal Tickets */}
              <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
                <h3 className="font-semibold text-gray-900 mb-3">Ìæ´ Normal Tickets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="normal_price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (ETB) *
                    </label>
                    <input
                      type="number"
                      id="normal_price"
                      name="normal_price"
                      required
                      value={formData.normal_price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label htmlFor="normal_capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      id="normal_capacity"
                      name="normal_capacity"
                      required
                      value={formData.normal_capacity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>

              {/* VIP Tickets */}
              <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-yellow-300 transition-colors">
                <h3 className="font-semibold text-gray-900 mb-3">‚≠ê VIP Tickets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vip_price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      id="vip_price"
                      name="vip_price"
                      value={formData.vip_price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="1200"
                    />
                  </div>
                  <div>
                    <label htmlFor="vip_capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="vip_capacity"
                      name="vip_capacity"
                      value={formData.vip_capacity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="200"
                    />
                  </div>
                </div>
              </div>

              {/* VVIP Tickets */}
              <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-red-300 transition-colors">
                <h3 className="font-semibold text-gray-900 mb-3">Ì±ë VVIP Tickets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vvip_price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      id="vvip_price"
                      name="vvip_price"
                      value={formData.vvip_price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="2500"
                    />
                  </div>
                  <div>
                    <label htmlFor="vvip_capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="vvip_capacity"
                      name="vvip_capacity"
                      value={formData.vvip_capacity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/organizer/dashboard')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Creating Event...' : '‚ú® Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
