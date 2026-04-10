import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Star, Heart, Users, TrendingUp, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { eventAPI } from '../../api/client';

export function DiscoveryPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventAPI.getAll();
      if (response.success) {
        // Only show published events
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
    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.category_name && event.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.city && event.city.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
    setCurrentPage(1);
  }, [searchQuery, events]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Events in Ethiopia</h1>
          <p className="text-xl text-gray-300 mb-8">Find and book tickets for the best cultural, music, and tech events across the country</p>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by title, category, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">Found <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}>
              <Grid3x3 className="size-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}>
              <List className="size-5" />
            </button>
          </div>
        </div>

        {currentEvents.length > 0 ? (
          <>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {currentEvents.map((event) => (
                <EventCard key={event.id} event={event} formatDate={formatDate} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-50">Previous</button>
                <span className="px-4 py-2 bg-green-600 text-white rounded-lg">{currentPage}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border disabled:opacity-50">Next</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <Search className="size-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No events found. Check back later for amazing events!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, formatDate }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img src={event.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 text-gray-900 text-xs font-semibold rounded-lg">{event.category_name || 'Event'}</span>
        <button onClick={() => setIsSaved(!isSaved)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-red-50 transition">
          <Heart className={`size-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-lg">ETB {event.ticket_types?.[0]?.price || 250}+</div>
      </div>
      <div className="p-4">
        <Link to={`/event/${event.id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors text-sm">{event.title}</h3>
        </Link>
        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-1.5"><Calendar className="size-3 text-green-600" /><span>{formatDate(event.start_datetime)}</span></div>
          <div className="flex items-center gap-1.5"><MapPin className="size-3 text-red-500" /><span>{event.city || 'Addis Ababa'}</span></div>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
          <Link to={`/event/${event.id}`} className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-medium rounded-lg hover:from-green-700 hover:to-green-800">Get Tickets</Link>
        </div>
      </div>
    </div>
  );
}
