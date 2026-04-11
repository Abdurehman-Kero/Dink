import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Calendar, MapPin, Star, Heart, Users, TrendingUp, 
  Grid3x3, List, ChevronLeft, ChevronRight, Filter, X,
  SlidersHorizontal, Coffee, Music, Mic, Palette, Briefcase, GraduationCap
} from 'lucide-react';
import { eventAPI } from '../../api/client';
import { EventMap } from '../../components/groupC/EventMap';

export function DiscoveryPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMapEvent, setSelectedMapEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCity, setSelectedCity] = useState(null);
  const eventsPerPage = 9;

  const categories = [
    { id: 'all', name: 'All Events', icon: Coffee },
    { id: 'Music', name: 'Music', icon: Music },
    { id: 'Cultural', name: 'Cultural', icon: Palette },
    { id: 'Business', name: 'Business', icon: Briefcase },
    { id: 'Educational', name: 'Educational', icon: GraduationCap }
  ];

  const ethiopianCities = [
    'Addis Ababa', 'Bahir Dar', 'Gondar', 'Lalibela', 'Axum', 
    'Hawassa', 'Dire Dawa', 'Mekelle', 'Jimma', 'Harar'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventAPI.getAll();
      if (response.success) {
        const publishedEvents = (response.events || []).filter(e => e.status === 'published');
        setEvents(publishedEvents);
        setFilteredEvents(publishedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...events];

    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category_name === selectedCategory);
    }

    if (selectedCity) {
      filtered = filtered.filter(event => event.city === selectedCity);
    }

    if (priceRange.min) {
      filtered = filtered.filter(event => (event.min_price || 0) >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(event => (event.min_price || 0) <= Number(priceRange.max));
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedCity, priceRange, events]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedCity(null);
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin size-12 border-4 border-green-200 border-t-green-600 rounded-full mb-4" />
          <p className="text-gray-500">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Discover Amazing Events</h1>
          <p className="text-lg text-gray-300 mb-6">Find and book tickets for the best events across Ethiopia</p>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by title, category, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
            />
          </div>
        </div>
      </div>

      {filteredEvents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <EventMap 
            events={filteredEvents} 
            selectedEvent={selectedMapEvent}
            onEventSelect={setSelectedMapEvent}
            height="450px"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === 'all' ? null : cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                (selectedCategory === cat.id || (cat.id === 'all' && !selectedCategory))
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <cat.icon className="size-4" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'event' : 'events'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <SlidersHorizontal className="size-4" />
              Filters
              {(selectedCity || priceRange.min || priceRange.max) && (
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
            <div className="flex items-center gap-2 bg-white rounded-xl border p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid3x3 className="size-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Filter Events</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                <X className="size-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select
                  value={selectedCity || ''}
                  onChange={(e) => setSelectedCity(e.target.value || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Cities</option>
                  {ethiopianCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (ETB)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {currentEvents.length > 0 ? (
          <>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {currentEvents.map((event) => (
                <EventCard key={event.id} event={event} formatDate={formatDate} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="size-5" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg transition ${
                      currentPage === i + 1 
                        ? 'bg-green-600 text-white' 
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <Search className="size-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No events found matching your criteria.</p>
            <button onClick={clearFilters} className="mt-4 text-green-600 hover:text-green-700 font-medium">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Event Card Component with clickable banner image
function EventCard({ event, formatDate }) {
  const [isSaved, setIsSaved] = useState(false);
  const isTrending = event.is_trending === true || event.is_trending === 1;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Clickable banner image - now links to event detail */}
      <Link to={`/event/${event.id}`} className="block relative h-48 overflow-hidden cursor-pointer">
        <img 
          src={event.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-lg">
          {event.category_name || 'Event'}
        </span>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition z-10"
        >
          <Heart className={`size-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-lg">
          ETB {event.ticket_types?.[0]?.price || event.min_price || 250}+
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/event/${event.id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors text-sm">
            {event.title}
          </h3>
        </Link>
        
        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3 text-green-600" />
            <span>{formatDate(event.start_datetime)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3 text-red-500" />
            <span className="line-clamp-1">{event.city || 'Addis Ababa'}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
          {isTrending && (
            <div className="flex items-center gap-1 text-xs text-orange-500">
              <TrendingUp className="size-3" />
              <span>Trending</span>
            </div>
          )}
          <Link 
            to={`/event/${event.id}`}
            className={`px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all ${!isTrending ? 'ml-auto' : ''}`}
          >
            Get Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
