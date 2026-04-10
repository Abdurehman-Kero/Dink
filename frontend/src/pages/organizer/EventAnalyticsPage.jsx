import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  TrendingUp, Users, DollarSign, Ticket, Calendar, 
  Download, Filter, BarChart3, PieChart, ArrowLeft,
  Star, Clock, MapPin, Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

// Mock analytics data
const mockAnalytics = {
  event_id: '1',
  event_title: 'Ethiopian Coffee Festival',
  total_tickets_sold: 1850,
  total_capacity: 2000,
  total_revenue: 425000,
  check_in_rate: 74,
  average_rating: 4.8,
  tickets_by_type: [
    { name: 'Normal', value: 1200, color: '#10b981', revenue: 300000 },
    { name: 'VIP', value: 500, color: '#f59e0b', revenue: 100000 },
    { name: 'VVIP', value: 150, color: '#ef4444', revenue: 25000 }
  ],
  daily_sales: [
    { date: 'Dec 1', sales: 45, revenue: 11250 },
    { date: 'Dec 2', sales: 78, revenue: 19500 },
    { date: 'Dec 3', sales: 120, revenue: 30000 },
    { date: 'Dec 4', sales: 95, revenue: 23750 },
    { date: 'Dec 5', sales: 156, revenue: 39000 },
    { date: 'Dec 6', sales: 234, revenue: 58500 },
    { date: 'Dec 7', sales: 189, revenue: 47250 }
  ],
  hourly_checkins: [
    { hour: '9 AM', count: 45 },
    { hour: '10 AM', count: 89 },
    { hour: '11 AM', count: 156 },
    { hour: '12 PM', count: 234 },
    { hour: '1 PM', count: 189 },
    { hour: '2 PM', count: 123 },
    { hour: '3 PM', count: 67 }
  ],
  recent_reviews: [
    { id: '1', user: 'Abebe K.', rating: 5, comment: 'Amazing event! The coffee tasting was incredible.', date: '2024-12-16' },
    { id: '2', user: 'Helen M.', rating: 4, comment: 'Great organization, would attend again.', date: '2024-12-16' },
    { id: '3', user: 'Dawit T.', rating: 5, comment: 'Best cultural event of the year!', date: '2024-12-15' }
  ]
};

export function EventAnalyticsPage() {
  const { eventId } = useParams();
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [dateRange, setDateRange] = useState('7days');

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a'];

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
        <div className="flex items-center gap-4 mb-6">
          <Link to="/organizer/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="size-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{analytics.event_title}</h1>
            <p className="text-gray-600">Event Analytics & Performance</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tickets Sold</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.total_tickets_sold.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">of {analytics.total_capacity.toLocaleString()}</p>
              </div>
              <Ticket className="size-10 text-green-400" />
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(analytics.total_tickets_sold / analytics.total_capacity) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">ETB {analytics.total_revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="size-10 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Check-in Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.check_in_rate}%</p>
              </div>
              <Users className="size-10 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.average_rating}</p>
              </div>
              <Star className="size-10 text-purple-400 fill-purple-400" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Sales Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="size-5 text-green-600" />
                Daily Ticket Sales
              </h2>
              <select className="px-3 py-1 border rounded-lg text-sm">
                <option>Last 7 days</option>
                <option>Last 14 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.daily_sales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ticket Distribution Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="size-5 text-green-600" />
              Ticket Distribution by Type
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={analytics.tickets_by_type}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.tickets_by_type.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {analytics.tickets_by_type.map((type, idx) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-sm text-gray-600">{type.name}</span>
                  <span className="text-sm font-semibold">{type.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Check-ins */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="size-5 text-green-600" />
            Hourly Check-in Pattern
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.hourly_checkins}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Type Breakdown Table */}
        <div className="bg-white rounded-2xl shadow-sm mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Ticket Type Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ticket Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.tickets_by_type.map((type) => (
                  <tr key={type.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{type.name}</td>
                    <td className="px-6 py-4 text-gray-600">ETB {type.revenue / type.value}</td>
                    <td className="px-6 py-4 text-gray-900">{type.value.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">ETB {type.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">{type.value * 2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Star className="size-5 text-yellow-400 fill-yellow-400" />
              Recent Attendee Reviews
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {analytics.recent_reviews.map((review) => (
              <div key={review.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{review.user}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`size-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                  <button className="text-sm text-green-600 hover:text-green-700">Reply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
