import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, DollarSign, Calendar, BarChart3, UserCog, Coffee, Star, Ticket } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for demonstration
const mockDashboardData = {
  total_events: 12,
  total_tickets_sold: 8450,
  total_revenue: 2450000,
  revenue_by_event: [
    { event_title: 'Ethiopian Coffee Festival', revenue: 850000 },
    { event_title: 'Hawassa Music Festival', revenue: 620000 },
    { event_title: 'Gondar Traditional Dance', revenue: 380000 },
    { event_title: 'Addis Tech Summit', revenue: 600000 },
  ],
  live_events: [
    {
      id: '1',
      title: 'ታላቁ የኢትዮጵያ ቡና ፌስቲቫል',
      category_name: 'Cultural',
      status: 'published',
      thumbnail_url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31'
    }
  ],
  past_events: [
    {
      id: '2',
      title: 'ባህላዊ የጎንደር ዳንስ',
      category_name: 'Cultural',
      status: 'completed',
      rating: 4.8,
      review_count: 234
    }
  ]
};

const mockEventStats = {
  event_id: '1',
  tickets_sold_total: 1500,
  checked_in_total: 890,
  normal_sold: 1200,
  vip_sold: 250,
  vvip_sold: 50
};

export function OrganizerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [selectedEventStats, setSelectedEventStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setDashboard(mockDashboardData);
        if (mockDashboardData.live_events.length > 0) {
          setSelectedEventStats(mockEventStats);
        }
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
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
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return <div className="text-center py-12">No data available</div>;
  }

  const chartData = dashboard.revenue_by_event.map(item => ({
    name: item.event_title.length > 20 ? item.event_title.substring(0, 20) + '...' : item.event_title,
    revenue: item.revenue,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Ethiopian Tricolor Accent */}
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl flex items-center justify-center shadow-md">
                <Calendar className="size-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
            </div>
            <p className="text-gray-600 ml-16">Manage your events and track performance</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link
              to="/staff/management"
              className="px-5 py-2.5 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <UserCog className="size-5" />
              Staff Management
            </Link>
            <Link
              to="/organizer/create-event"
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md"
            >
              Create New Event
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-xl">
                <Calendar className="size-6 text-green-600" />
              </div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{dashboard.total_events}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <Ticket className="size-6 text-yellow-600" />
              </div>
              <div className="text-sm text-gray-600">Tickets Sold</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {dashboard.total_tickets_sold.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-xl">
                <DollarSign className="size-6 text-red-600" />
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {dashboard.total_revenue.toLocaleString()} ETB
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-xl">
                <TrendingUp className="size-6 text-purple-600" />
              </div>
              <div className="text-sm text-gray-600">Avg per Event</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(dashboard.total_revenue / dashboard.total_events).toLocaleString()} ETB
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="size-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Revenue by Event</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Events */}
        {dashboard.live_events.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Events</h2>
            <div className="grid grid-cols-1 gap-6">
              {dashboard.live_events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
                      {event.thumbnail_url ? (
                        <img
                          src={event.thumbnail_url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="size-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-500">{event.category_name}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium self-start">
                          Live
                        </span>
                      </div>

                      {selectedEventStats && selectedEventStats.event_id === event.id && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Check-in Progress</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {selectedEventStats.checked_in_total} / {selectedEventStats.tickets_sold_total}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-green-600 h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(selectedEventStats.checked_in_total / selectedEventStats.tickets_sold_total) * 100}%`,
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <div className="text-xs text-gray-600 mb-1">Normal</div>
                              <div className="text-lg font-bold text-gray-900">
                                {selectedEventStats.normal_sold}
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <div className="text-xs text-gray-600 mb-1">VIP</div>
                              <div className="text-lg font-bold text-gray-900">
                                {selectedEventStats.vip_sold}
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                              <div className="text-xs text-gray-600 mb-1">VVIP</div>
                              <div className="text-lg font-bold text-gray-900">
                                {selectedEventStats.vvip_sold}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Events Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Events</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Rating</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...dashboard.live_events, ...dashboard.past_events].map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{event.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{event.category_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : event.status === 'completed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {event.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-900">{event.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-500">({event.review_count})</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No reviews</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/event/${event.id}`}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
