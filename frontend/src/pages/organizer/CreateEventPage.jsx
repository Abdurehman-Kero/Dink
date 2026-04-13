import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, DollarSign, ImageIcon, ArrowLeft, Upload, X, Ticket, Link as LinkIcon, Loader, CheckCircle } from 'lucide-react';
import { eventAPI } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function CreateEventPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imageSource, setImageSource] = useState('url');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
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
    banner_url: '',
    ticket_types: [
      { tier_name: 'Normal', price: '', capacity: '', benefits: 'Standard entry' },
      { tier_name: 'VIP', price: '', capacity: '', benefits: 'Priority entry, VIP seating' },
      { tier_name: 'VVIP', price: '', capacity: '', benefits: 'All VIP benefits, Backstage access' }
    ]
  });

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

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setBannerPreview(url);
    setFormData(prev => ({ ...prev, banner_url: url }));
    setUploadSuccess(false);
    setUploadError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset states
    setUploadError('');
    setUploadSuccess(false);
    setUploadProgress(0);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }
    
    setUploading(true);
    
    // Create local preview immediately
    const localPreview = URL.createObjectURL(file);
    setBannerPreview(localPreview);
    
    try {
      const token = localStorage.getItem('authToken');
      const formDataObj = new FormData();
      formDataObj.append('image', file);
      
      // Simulate progress for better UX
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await fetch(`${API_URL}/upload/event-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataObj
      });
      
      clearInterval(interval);
      
      const data = await response.json();
      
      if (data.success) {
        setUploadProgress(100);
        setUploadSuccess(true);
        // Use the permanent URL from the server
        const permanentUrl = data.imageUrl;
        setFormData(prev => ({ ...prev, banner_url: permanentUrl }));
        setBannerPreview(permanentUrl);
        console.log('Image uploaded successfully:', permanentUrl);
      } else {
        setUploadError(data.message || 'Upload failed');
        // Keep the local preview but show error
        setBannerPreview(localPreview);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload image. Please try again.');
      // Keep the local preview
      setBannerPreview(localPreview);
    } finally {
      setTimeout(() => {
        setUploading(false);
      }, 500);
    }
  };

  const handleRemoveImage = () => {
    setBannerPreview(null);
    setFormData(prev => ({ ...prev, banner_url: '' }));
    setImageUrl('');
    setUploadSuccess(false);
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.banner_url) {
      alert('Please add a banner image (URL or upload)');
      return;
    }
    
    setLoading(true);

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
      banner_url: formData.banner_url,
      ticket_types: validTicketTypes.map(t => ({
        tier_name: t.tier_name,
        price: parseFloat(t.price),
        capacity: parseInt(t.capacity),
        remaining_quantity: parseInt(t.capacity),
        benefits: t.benefits
      }))
    };

    console.log('Submitting event with banner_url:', eventData.banner_url);

    try {
      const response = await eventAPI.create(eventData);
      if (response.success) {
        alert('Event created successfully!');
        navigate('/organizer/dashboard');
      } else {
        alert(response.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Create event error:', error);
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
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl" placeholder="e.g., Ethiopian Coffee Festival" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl">
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select name="event_type" value={formData.event_type} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl">
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
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="w-full px-4 py-3 border rounded-xl" />
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="size-5 text-green-600" /> Banner Image *
            </h2>
            
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setImageSource('url')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${imageSource === 'url' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <LinkIcon className="size-4 inline mr-1" /> Image URL
              </button>
              <button
                type="button"
                onClick={() => setImageSource('upload')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${imageSource === 'upload' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <Upload className="size-4 inline mr-1" /> Upload Image
              </button>
            </div>

            {imageSource === 'url' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a direct image URL (use Unsplash, Imgur, or your own server)</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image from Computer</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-4 py-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {uploading && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <Loader className="size-4 animate-spin text-green-600" />
                      <span className="text-sm text-gray-600">Uploading... {uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
                {uploadError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{uploadError}</p>
                  </div>
                )}
                {uploadSuccess && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-600" />
                    <p className="text-sm text-green-600">Image uploaded successfully!</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Upload JPG, PNG, or GIF (Max 5MB). Image will be stored on our server permanently.</p>
              </div>
            )}

            {bannerPreview && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Preview:</p>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="size-4" /> Remove Image
                  </button>
                </div>
                <img 
                  src={bannerPreview} 
                  alt="Banner preview" 
                  className="w-full h-56 object-cover rounded-xl border border-gray-200 shadow-sm"
                  onError={(e) => {
                    console.error('Image failed to load:', bannerPreview);
                    e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
                  }}
                />
                {formData.banner_url && (
                  <p className="text-xs text-green-600 mt-2 break-all">
                    ✓ Image URL: {formData.banner_url.substring(0, 80)}...
                  </p>
                )}
              </div>
            )}
            {!bannerPreview && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-700">⚠️ Banner image is required. Please add an image URL or upload one from your computer.</p>
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="size-5 text-green-600" /> Date & Time
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time *</label><input type="datetime-local" name="start_datetime" value={formData.start_datetime} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time *</label><input type="datetime-local" name="end_datetime" value={formData.end_datetime} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl" /></div>
            </div>
          </div>

          {/* Venue */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="size-5 text-green-600" /> Venue
            </h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label><input type="text" name="venue_name" value={formData.venue_name} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl" placeholder="Millennium Hall" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Address *</label><input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl" placeholder="Bole Road" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl" /></div>
            </div>
          </div>

          {/* Ticket Types */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="size-5 text-green-600" /> Ticket Types
            </h2>
            <div className="space-y-4">
              {formData.ticket_types.map((ticket, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{ticket.tier_name} Tickets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB)</label><input type="number" value={ticket.price} onChange={(e) => handleTicketChange(index, 'price', e.target.value)} className="w-full px-4 py-2 border rounded-xl" placeholder="250" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label><input type="number" value={ticket.capacity} onChange={(e) => handleTicketChange(index, 'capacity', e.target.value)} className="w-full px-4 py-2 border rounded-xl" placeholder="500" /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate('/organizer/dashboard')} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold">Cancel</button>
            <button type="submit" disabled={loading || !formData.banner_url} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold disabled:opacity-50">
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
