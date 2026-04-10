import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Clock, DollarSign, CheckCircle, XCircle, Eye, Shield, Coffee, TrendingUp } from 'lucide-react';

// Mock data
const mockStats = {
  total_users: 15420,
  total_organizers: 234,
  total_attendees: 14890,
  total_security: 296,
  live_events: 45,
  pending_approvals: 12,
  total_revenue: 8450000,
  total_tickets_sold: 28750
};

const mockPendingOrganizers = [
  {
    id: '1',
    organization_name: 'Ethiopian Coffee Association',
    organization_type: 'non_profit',
    full_name: 'Abebe Kebede',
    work_email: 'abebe@ethiopiancoffee.org',
    phone_number: '+251-911-234-567',
    website_url: 'www.ethiopiancoffee.org',
    verification_status: 'pending',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    organization_name: 'Hawassa Arts Festival',
    organization_type: 'corporate',
    full_name: 'Helen Mekonnen',
    work_email: 'helen@hawassaarts.com',
    phone_number: '+251-912-345-678',
    website_url: 'www.hawassaarts.com',
    verification_status: 'pending',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockRecentEvents = [
  { id: '1', title: 'ታላቁ የኢትዮጵያ ቡና ፌስቲቫል', organizer_name: 'Ethiopian Coffee Association', status: 'published', created_at: new Date().toISOString() },
  { id: '2', title: 'ሐዋሳ ሙዚቃ ፌስቲቫል', organizer_name: 'Hawassa Arts Festival', status: 'pending', created_at: new Date().toISOString() }
];

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingOrganizers, setPendingOrganizers] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setStats(mockStats);
        setPendingOrganizers(mockPendingOrganizers);
        setRecentEvents(mockRecentEvents);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (organizerId) => {
    setPendingOrganizers(prev => prev.filter(org => org.id !== organizerId));
    setStats(prev => ({ ...prev, pending_approvals: prev.pending_approvals - 1 }));
    alert('Organizer approved successfully!');
  };

  const handleReject = async (organizerId) => {
    setPendingOrganizers(prev => prev.filter(org => org.id !== organizerId));
    setStats(prev => ({ ...prev, pending_approvals: prev.pending_approvals - 1 }));
    alert('Organizer rejected.');
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ethiopian Tricolor Accent */}
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Shield className="size-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <p className="text-gray-600 ml-16">Manage your DEMS platform</p>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
              DEMS Admin
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_users.toLocaleString()}</p>
              </div>
              <Users className="size-12 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Live Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.live_events}</p>
              </div>
              <Calendar className="size-12 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.pending_approvals}</p>
              </div>
              <Clock className="size-12 text-red-400" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_revenue.toLocaleString()} ETB</p>
              </div>
              <DollarSign className="size-12 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Pending Organizer Approvals */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="size-5 text-yellow-500" />
              Pending Organizer Approvals
            </h2>
          </div>
          <div className="p-6">
            {pendingOrganizers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">✅ No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingOrganizers.map((org) => (
                  <div key={org.id} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{org.organization_name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div><span className="font-medium">Contact:</span> {org.full_name}</div>
                          <div><span className="font-medium">Type:</span> {org.organization_type}</div>
                          <div><span className="font-medium">Email:</span> {org.work_email}</div>
                          <div><span className="font-medium">Phone:</span> {org.phone_number}</div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Submitted:</span> {getDaysAgo(org.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(org.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="size-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(org.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          <XCircle className="size-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
            <Link to="/admin/events" className="text-sm text-green-600 font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentEvents.map((event) => (
              <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.organizer_name} • 
                      <span className={`ml-2 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </span>
                    </p>
                  </div>
                  <Link to={`/event/${event.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-green-600 rounded-lg transition-colors">
                    <Eye className="size-4" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/users" className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all font-semibold text-gray-900">
                <Users className="size-5" />
                View All Users
              </Link>
              <Link to="/admin/events" className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all font-semibold text-gray-900">
                <Calendar className="size-5" />
                View All Events
              </Link>
              <Link to="/admin/categories" className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all font-semibold text-gray-900">
                <TrendingUp className="size-5" />
                Manage Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
