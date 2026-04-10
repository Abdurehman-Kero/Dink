import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, DollarSign, TrendingUp, CheckCircle, 
  XCircle, Clock, Shield, UserCheck, Ticket, Award,
  Eye, RefreshCw, Settings, Bell, BarChart3, ChevronRight,
  PlusCircle, Trash2, Edit
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_users: 0,
    total_organizers: 0,
    total_attendees: 0,
    total_events: 0,
    live_events: 0,
    pending_approvals: 0,
    total_revenue: 0,
    total_tickets_sold: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [pendingOrganizers, setPendingOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin, if not redirect
  useEffect(() => {
    if (!loading && user && user.role_id !== 1) {
      navigate('/discover');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        total_users: 1250,
        total_organizers: 45,
        total_attendees: 1200,
        total_events: 28,
        live_events: 12,
        pending_approvals: 5,
        total_revenue: 845000,
        total_tickets_sold: 3450
      });
      
      setPendingOrganizers([
        { id: '1', organization_name: 'Ethiopian Coffee Association', full_name: 'Abebe Kebede', email: 'abebe@coffee.com', created_at: '2024-03-10' },
        { id: '2', organization_name: 'Hawassa Arts Festival', full_name: 'Helen Mekonnen', email: 'helen@hawassaarts.com', created_at: '2024-03-12' }
      ]);
      
      setRecentEvents([
        { id: '1', title: 'Ethiopian Coffee Festival', organizer: 'Coffee Association', status: 'published', tickets_sold: 1250 },
        { id: '2', title: 'Hawassa Music Festival', organizer: 'Hawassa Arts', status: 'published', tickets_sold: 890 }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id) => {
    setPendingOrganizers(prev => prev.filter(org => org.id !== id));
    alert('Organizer approved successfully!');
  };

  const handleReject = (id) => {
    setPendingOrganizers(prev => prev.filter(org => org.id !== id));
    alert('Organizer rejected.');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin size-12 border-4 border-green-200 border-t-green-600 rounded-full mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'}!</p>
            {user?.email === 'nexussphere0974@gmail.com' && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                <Shield className="size-3" /> Super Admin
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={fetchDashboardData} className="px-4 py-2 bg-white border rounded-xl flex items-center gap-2">
              <RefreshCw className="size-4" /> Refresh
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <div className="bg-white rounded-xl p-3 text-center border-l-4 border-green-500">
            <Users className="size-5 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Users</p>
            <p className="text-xl font-bold">{stats.total_users}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border-l-4 border-blue-500">
            <Calendar className="size-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Events</p>
            <p className="text-xl font-bold">{stats.total_events}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border-l-4 border-yellow-500">
            <Ticket className="size-5 text-yellow-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Tickets</p>
            <p className="text-xl font-bold">{stats.total_tickets_sold}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border-l-4 border-purple-500">
            <DollarSign className="size-5 text-purple-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-xl font-bold">ETB {stats.total_revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border-l-4 border-red-500">
            <TrendingUp className="size-5 text-red-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Live</p>
            <p className="text-xl font-bold">{stats.live_events}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border-l-4 border-orange-500">
            <Clock className="size-5 text-orange-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-xl font-bold">{stats.pending_approvals}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border-l-4 border-teal-500">
            <UserCheck className="size-5 text-teal-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Organizers</p>
            <p className="text-xl font-bold">{stats.total_organizers}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border-l-4 border-indigo-500">
            <Award className="size-5 text-indigo-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Attendees</p>
            <p className="text-xl font-bold">{stats.total_attendees}</p>
          </div>
        </div>

        {/* Pending Approvals Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="size-5 text-orange-500" /> Pending Organizer Approvals
            </h2>
          </div>
          <div className="p-6">
            {pendingOrganizers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingOrganizers.map(org => (
                  <div key={org.id} className="border rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{org.organization_name}</h3>
                      <p className="text-sm text-gray-500">{org.full_name} ‚Ä¢ {org.email}</p>
                      <p className="text-xs text-gray-400">Submitted: {new Date(org.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(org.id)} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1">
                        <CheckCircle className="size-4" /> Approve
                      </button>
                      <button onClick={() => handleReject(org.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm flex items-center gap-1">
                        <XCircle className="size-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Events & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Recent Events</h2>
            </div>
            <div className="divide-y">
              {recentEvents.map(event => (
                <div key={event.id} className="px-6 py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.organizer}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{event.tickets_sold} tickets</span>
                    <Link to={`/event/${event.id}`} className="text-green-600">
                      <Eye className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link to="/admin/users" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                <span>Ì±• Manage Admins</span> <ChevronRight className="size-4" />
              </Link>
              <Link to="/admin/events" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                <span>Ì≥Ö Manage Events</span> <ChevronRight className="size-4" />
              </Link>
              <Link to="/admin/categories" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                <span>Ìø∑Ô∏è Manage Categories</span> <ChevronRight className="size-4" />
              </Link>
              <Link to="/admin/settings" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                <span>‚öôÔ∏è Platform Settings</span> <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
