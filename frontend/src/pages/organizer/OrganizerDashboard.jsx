import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, DollarSign, TrendingUp, PlusCircle, Ticket, 
  Star, Eye, RefreshCw, UserCog, Wallet, BarChart3, 
  Settings, LogOut, Home, Bell, Shield, Award, Clock, MapPin
} from 'lucide-react';
import { eventAPI } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export function OrganizerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_events: 0,
    total_tickets_sold: 0,
    total_revenue: 0,
    pending_approvals: 0,
    completed_events: 0
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventAPI.getAll();
      if (response.success) {
        const allEvents = response.events || [];
        const publishedEvents = allEvents.filter(e => e.status === 'published');
        const completedEvents = allEvents.filter(e => new Date(e.end_datetime) < new Date());
        
        setEvents(allEvents);
        setStats({
          total_events: allEvents.length,
          total_tickets_sold: allEvents.reduce((sum, e) => sum + (e.tickets_sold || 0), 0),
          total_revenue: allEvents.reduce((sum, e) => sum + (e.total_revenue || 0), 0),
          pending_approvals: allEvents.filter(e => e.status === 'pending').length,
          completed_events: completedEvents.length
        });
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
        {/* Header with Welcome and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.full_name?.split(' ')[0] || 'Organizer'}!</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <button 
              onClick={fetchEvents}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
            >
              <RefreshCw className="size-4" /> Refresh
            </button>
            <Link 
              to="/organizer/create-event" 
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition flex items-center gap-2 shadow-md"
            >
              <PlusCircle className="size-5" /> Create Event
            </Link>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/staff/management" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-blue-500">
            <UserCog className="size-8 text-blue-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Staff Management</h3>
            <p className="text-xs text-gray-500">Manage your team</p>
          </Link>
          <Link to="/organizer/payouts" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-yellow-500">
            <Wallet className="size-8 text-yellow-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Payout Settings</h3>
            <p className="text-xs text-gray-500">Bank & withdrawals</p>
          </Link>
          <Link to="/organizer/analytics" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-purple-500">
            <BarChart3 className="size-8 text-purple-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Analytics</h3>
            <p className="text-xs text-gray-500">Event performance</p>
          </Link>
          <Link to="/profile" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-gray-500">
            <Settings className="size-8 text-gray-500 mb-2" />
            <h3 className="font-semibold text-gray-900">Settings</h3>
            <p className="text-xs text-gray-500">Account preferences</p>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600">Total Events</p><p className="text-3xl font-bold text-gray-900">{stats.total_events}</p></div>
              <Calendar className="size-10 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600">Tickets Sold</p><p className="text-3xl font-bold text-gray-900">{stats.total_tickets_sold.toLocaleString()}</p></div>
              <Ticket className="size-10 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600">Total Revenue</p><p className="text-3xl font-bold text-gray-900">ETB {stats.total_revenue.toLocaleString()}</p></div>
              <DollarSign className="size-10 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600">Pending</p><p className="text-3xl font-bold text-gray-900">{stats.pending_approvals}</p></div>
              <Clock className="size-10 text-orange-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600">Completed</p><p className="text-3xl font-bold text-gray-900">{stats.completed_events}</p></div>
              <Award className="size-10 text-purple-400" />
            </div>
          </div>
        </div>

        {/* My Events Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">My Events</h2>
            <Link to="/discover" className="text-sm text-green-600 hover:text-green-700">View Public Page →</Link>
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No events created yet</p>
              <Link to="/organizer/create-event" className="mt-4 inline-block text-green-600 hover:underline">Create your first event</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {events.map((event) => (
                <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="size-3" />{new Date(event.start_datetime).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MapPin className="size-3" />{event.city}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${event.status === 'published' ? 'bg-green-100 text-green-700' : event.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{event.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/event/${event.id}`} className="px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg text-sm flex items-center gap-1"><Eye className="size-4" /> View</Link>
                      <Link to={`/organizer/analytics/${event.id}`} className="px-3 py-1.5 text-purple-600 hover:bg-purple-50 rounded-lg text-sm flex items-center gap-1"><BarChart3 className="size-4" /> Stats</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button at Bottom */}
        <div className="mt-8 flex justify-end">
          <button onClick={handleLogout} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition flex items-center gap-2">
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
