import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Search, MapPin, Calendar, Users, Star, Filter, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

// Ethiopian Cities Data
const ETHIOPIAN_CITIES = [
  'Addis Ababa', 'Bahir Dar', 'Gondar', 'Lalibela', 'Axum', 
  'Hawassa', 'Dire Dawa', 'Mekelle', 'Jimma', 'Harar', 
  'Debre Zeit', 'Adama', 'Dessie', 'Jijiga', 'Shashamane'
];

// Ethiopian Event Categories
const ETHIOPIAN_CATEGORIES = [
  { id: 'tech', name: 'ቴክኖሎጂ | Technology', icon: '���', color: 'bg-blue-100 text-blue-700' },
  { id: 'sport', name: 'ስፖርት | Sport', icon: '⚽', color: 'bg-green-100 text-green-700' },
  { id: 'art', name: 'ሥነ ጥበብ | Art', icon: '���', color: 'bg-purple-100 text-purple-700' },
  { id: 'educational', name: 'ትምህርት | Educational', icon: '���', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'music', name: 'ሙዚቃ | Music', icon: '���', color: 'bg-red-100 text-red-700' },
  { id: 'cultural', name: 'ባህል | Cultural', icon: '���', color: 'bg-orange-100 text-orange-700' },
  { id: 'business', name: 'ንግድ | Business', icon: '���', color: 'bg-gray-100 text-gray-700' },
  { id: 'religious', name: 'ሃይማኖት | Religious', icon: '⛪', color: 'bg-indigo-100 text-indigo-700' }
];

// Mock Ethiopian Events Data
const ETHIOPIAN_EVENTS = [
  {
    id: '1',
    title: 'ታላቁ የኢትዮጵያ ቡና ፌስቲቫል | Great Ethiopian Coffee Festival',
    description: 'በዓለም ታዋቂ የሆነውን የኢትዮጵያ ቡና በዓል አንድ ላይ እንከብራለን። የቡና ቅመስ፣ ባህላዊ ውዝዋዜ፣ እና ልዩ ልዩ እንግዶች ይገኛሉ።',
    image_url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31',
    category_id: 'cultural',
    category_name: 'Cultural',
    start_date: '2024-12-15',
    end_date: '2024-12-17',
    location: 'Addis Ababa, Millennium Hall',
    city: 'Addis Ababa',
    min_price: 250,
    max_price: 1500,
    rating: 4.8,
    review_count: 234,
    tickets_left: 450,
    is_featured: true,
    is_trending: true,
    organizer: 'Ethiopian Coffee Exporters Association',
    capacity: 2000,
    format: 'in_person'
  },
  {
    id: '2',
    title: 'ታላቁ የሐዋሳ ሙዚቃ ፌስቲቫል | Hawassa Music Festival',
    description: 'በሐዋሳ ሀይቅ ዳርቻ የሚካሄደው ትልቁ የሙዚቃ ፌስቲቫል። ከሀገር ውስጥ እና ከውጭ የመጡ አርቲስቶች ይገኛሉ።',
    image_url: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c',
    category_id: 'music',
    category_name: 'Music',
    start_date: '2024-11-20',
    end_date: '2024-11-22',
    location: 'Hawassa, Lake Side Resort',
    city: 'Hawassa',
    min_price: 350,
    max_price: 2000,
    rating: 4.9,
    review_count: 567,
    tickets_left: 89,
    is_featured: true,
    is_trending: true,
    organizer: 'Hawassa Cultural Bureau',
    capacity: 5000,
    format: 'in_person'
  },
  {
    id: '3',
    title: 'የጎንደር ባህላዊ ዳንስ ትርኢት | Gondar Traditional Dance Show',
    description: 'የጎንደርን ባህላዊ ዳንስ እና ሙዚቃ በአንድ ላይ የሚያሳይ ትርኢት። ባህላዊ ልብሶች፣ ዘፈኖች እና ዳንሶች ይገኛሉ።',
    image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077',
    category_id: 'cultural',
    category_name: 'Cultural',
    start_date: '2024-10-10',
    end_date: '2024-10-12',
    location: 'Gondar, Fasilides Castle',
    city: 'Gondar',
    min_price: 150,
    max_price: 800,
    rating: 4.7,
    review_count: 123,
    tickets_left: 200,
    is_trending: true,
    organizer: 'Gondar Tourism Office',
    capacity: 1000,
    format: 'in_person'
  },
  {
    id: '4',
    title: 'ታላቁ የአዲስ አበባ ማራቶን | Great Addis Ababa Marathon',
    description: 'ለትምህርት የሚካሄደው ታላቁ ማራቶን። ለሁሉም ዕድሜ ክልል የሚሆኑ ርቀቶች ይገኛሉ።',
    image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
    category_id: 'sport',
    category_name: 'Sport',
    start_date: '2024-09-05',
    end_date: '2024-09-05',
    location: 'Addis Ababa, Meskel Square',
    city: 'Addis Ababa',
    min_price: 100,
    max_price: 500,
    rating: 4.5,
    review_count: 89,
    tickets_left: 500,
    organizer: 'Ethiopian Athletics Federation',
    capacity: 10000,
    format: 'in_person'
  },
  {
    id: '5',
    title: 'የላሊበላ ባህላዊ በዓል | Lalibela Cultural Festival',
    description: 'በታሪካዊቷ ላሊበላ የሚካሄደው ታላቁ ባህላዊ በዓል። የኦርቶዶክስ ተዋህዶ ቤተክርስቲያን በዓላት እና ባህላዊ ዝግጅቶች።',
    image_url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa',
    category_id: 'religious',
    category_name: 'Religious',
    start_date: '2025-01-07',
    end_date: '2025-01-10',
    location: 'Lalibela, Rock Hewn Churches',
    city: 'Lalibela',
    min_price: 0,
    max_price: 300,
    rating: 4.9,
    review_count: 456,
    tickets_left: 1000,
    is_featured: true,
    organizer: 'Lalibela Tourism Board',
    capacity: 5000,
    format: 'in_person'
  },
  {
    id: '6',
    title: 'የኢትዮጵያ ቴክ ሳሚት 2024 | Ethiopia Tech Summit 2024',
    description: 'የኢትዮጵያ ትልቁ የቴክኖሎጂ ጉባኤ። ስታርትአፕስ፣ ኢንቨስትመንት እና የወደፊቱ ቴክኖሎጂ ይብራራሉ።',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    category_id: 'tech',
    category_name: 'Technology',
    start_date: '2024-12-01',
    end_date: '2024-12-03',
    location: 'Addis Ababa, Science Museum',
    city: 'Addis Ababa',
    min_price: 500,
    max_price: 3000,
    rating: 4.8,
    review_count: 312,
    tickets_left: 45,
    is_featured: true,
    is_trending: true,
    organizer: 'Ethiopian Tech Community',
    capacity: 800,
    format: 'hybrid'
  },
  {
    id: '7',
    title: 'ባህላዊ የአክሱም ጥንታዊ ቅርሶች ኤግዚቢሽን | Axum Ancient Heritage Exhibition',
    description: 'የአክሱምን ጥንታዊ ቅርሶች እና ታሪክ የሚያሳይ ኤግዚቢሽን። ኦብሊስክስ፣ የንጉስ ካሌብ ቅርሶች እና ሌሎችም።',
    image_url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa',
    category_id: 'educational',
    category_name: 'Educational',
    start_date: '2024-11-01',
    end_date: '2024-11-30',
    location: 'Axum, Axum Museum',
    city: 'Axum',
    min_price: 50,
    max_price: 200,
    rating: 4.6,
    review_count: 78,
    tickets_left: 300,
    organizer: 'Axum Heritage Foundation',
    capacity: 2000,
    format: 'in_person'
  },
  {
    id: '8',
    title: 'የባህር ዳር ጥበባት ኤግዚቢሽን | Bahir Dar Arts Exhibition',
    description: 'የኢትዮጵያ ሥነ ጥበባት ኤግዚቢሽን። ሥዕሎች፣ ቅርጻ ቅርጾች እና ባህላዊ ጥበባት ይታያሉ።',
    image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
    category_id: 'art',
    category_name: 'Art',
    start_date: '2024-10-15',
    end_date: '2024-10-20',
    location: 'Bahir Dar, Tana Hall',
    city: 'Bahir Dar',
    min_price: 80,
    max_price: 400,
    rating: 4.7,
    review_count: 45,
    tickets_left: 150,
    organizer: 'Bahir Dar Arts Center',
    capacity: 500,
    format: 'in_person'
  }
];

export function DiscoveryPage() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [categories, setCategories] = useState(ETHIOPIAN_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API call with Ethiopian events
      setTimeout(() => {
        setFeaturedEvents(ETHIOPIAN_EVENTS.filter(e => e.is_featured));
        setTrendingEvents(ETHIOPIAN_EVENTS.filter(e => e.is_trending));
        setAllEvents(ETHIOPIAN_EVENTS);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading events:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedCity(null);
    setSearchInput('');
    setSearchParams({});
  };

  const filteredEvents = allEvents.filter(event => {
    const query = (searchInput || urlSearch).toLowerCase();
    
    const matchesSearch = !query || 
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.category_name.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query);
    
    const matchesCategory = !selectedCategory || event.category_id === selectedCategory;
    const matchesCity = !selectedCity || event.city === selectedCity;
    
    return matchesSearch && matchesCategory && matchesCity;
  });

  const isSearching = !!(searchInput || urlSearch || selectedCategory || selectedCity);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      
      {/* Ethiopian Tricolor Accent */}
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      {/* Hero Section with Featured Event */}
      {featuredEvents.length > 0 && !isSearching && (
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
          {/* Ethiopian Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23fff' d='M10,10 L20,10 L15,20 Z'/%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }} />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                  <Sparkles className="size-4 text-yellow-300" />
                  <span className="text-sm font-medium">የሳምንቱ ታላቅ ዝግጅት | Featured Event</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                  {featuredEvents[0].title}
                </h1>
                <p className="text-lg text-gray-300 mb-6 line-clamp-3">
                  {featuredEvents[0].description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="size-4 text-yellow-400" />
                    <span>{featuredEvents[0].location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-green-400" />
                    <span>{new Date(featuredEvents[0].start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link to={`/event/${featuredEvents[0].id}`}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg">
                    ትኬት ግዙ | Buy Ticket
                  </Link>
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm">
                    {featuredEvents[0].category_name}
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                  <img 
                    src={featuredEvents[0].image_url} 
                    alt={featuredEvents[0].title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Ethiopian Frame Decoration */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-yellow-400/30 rounded-xl -z-10" />
                <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-green-500/30 rounded-xl -z-10" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search + Category Bar */}
      <section className="sticky top-[73px] z-40 border-b transition-colors bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ፈልግ | Search events by name, category, or city..."
              className="w-full pl-11 pr-24 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all
                bg-white dark:bg-gray-800
                border-gray-300 dark:border-gray-700
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-500 hover:text-green-600 transition-colors"
              >
                <Filter className="size-4" />
              </button>
              {searchInput && (
                <button 
                  type="button" 
                  onClick={() => { setSearchInput(''); setSearchParams({}); }}
                  className="p-1 text-gray-400 hover:text-gray-600 text-lg"
                >
                  <X className="size-4" />
                </button>
              )}
              <button type="submit" className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                ፈልግ | Search
              </button>
            </div>
          </form>

          {/* Categories - Ethiopian Style */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}>
              ሁሉም ዝግጅቶች | All Events
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* City Filter - Ethiopian Cities */}
          {(selectedCategory || isSearching) && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-gray-500 shrink-0">Filter by city:</span>
              <button
                onClick={() => setSelectedCity(null)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  !selectedCity ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {ETHIOPIAN_CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                    selectedCity === city ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Trending Section */}
        {!selectedCategory && !isSearching && trendingEvents.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-xl">
                <TrendingUp className="size-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                በብዛት የሚታዩ | Trending Now in Ethiopia
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingEvents.slice(0, 6).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Events Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isSearching ? (
                <>የውጤት ዝግጅቶች | Results for "{searchInput || urlSearch || (selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : selectedCity) || 'All Events'}"</>
              ) : selectedCategory ? (
                <>{categories.find(c => c.id === selectedCategory)?.name} ዝግጅቶች | Events</>
              ) : (
                <>ሁሉም ዝግጅቶች | All Events in Ethiopia</>
              )}
            </h2>
            {isSearching && (
              <button 
                onClick={clearFilters}
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                <X className="size-4" /> Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl shadow-sm overflow-hidden border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                  <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
              <Search className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                ምንም ዝግጅት አልተገኘም | No events found
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search or filters
              </p>
              {isSearching && (
                <button 
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Event Card Component (Ethiopian themed)
function EventCard({ event }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryStyle = (categoryId) => {
    const category = ETHIOPIAN_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-800">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image_url} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-lg ${getCategoryStyle(event.category_id)}`}>
          {event.category_name}
        </span>
        
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-lg">
          ETB {event.min_price}+
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/event/${event.id}`}>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-green-600 transition-colors text-sm">
            {event.title}
          </h3>
        </Link>
        
        <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3 text-green-600" />
            <span>{formatDate(event.start_date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3 text-red-500" />
            <span className="line-clamp-1">{event.city}</span>
          </div>
          {event.rating && (
            <div className="flex items-center gap-1.5">
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{event.rating}</span>
              <span className="text-gray-400">({event.review_count})</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="size-3" />
            <span>{event.tickets_left} tickets left</span>
          </div>
          <Link 
            to={`/event/${event.id}`}
            className="px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
          >
            Get Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
