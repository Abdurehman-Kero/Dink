import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, DollarSign, TrendingUp, PlusCircle, Ticket, 
  Star, Eye, RefreshCw, UserCog, Wallet, BarChart3, 
  Settings, LogOut, Clock, MapPin, Award
} from 'lucide-react';
import { eventAPI } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      // Use the dedicated endpoint for organizer's events
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/events/organizer/my-events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const myEvents = data.events || [];
        const completedEvents = myEvents.filter(e => new Date(e.end_datetime) < new Date());
        
        setEvents(myEvents);
        setStats({
          total_events: myEvents.length,
          total_tickets_sold: myEvents.reduce((sum, e) => sum + (e.tickets_sold || 0), 0),
          total_revenue: myEvents.reduce((sum, e) => sum + (e.total_revenue || 0), 0),
          pending_approvals: myEvents.filter(e => e.status === 'pending').length,
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
        <div className="animate-spin size-12 border-4 border-green-200 border-t-green-600 rounded-full mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" /><div className="flex-1 bg-yellow-400" /><div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name?.split(' ')[0] || 'Organizer'}!</p>
            <p className="text-xs text-gray-400 mt-1">User ID: {user?.id?.slice(0, 8)}...</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <button onClick={fetchEvents} className="px-4 py-2 bg-white border rounded-xl flex items-center gap-2"><RefreshCw className="size-4" /> Refresh</button>
            <Link to="/organizer/create-event" className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-md"><PlusCircle className="size-5" /> Create Event</Link>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/staff/management" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border-l-4 border-blue-500"><UserCog className="size-8 text-blue-500 mb-2" /><h3 className="font-semibold">Staff Management</h3><p className="text-xs text-gray-500">Manage your team</p></Link>
          <Link to="/organizer/payouts" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border-l-4 border-yellow-500"><Wallet className="size-8 text-yellow-500 mb-2" /><h3 className="font-semibold">Payout Settings</h3><p className="text-xs text-gray-500">Bank & withdrawals</p></Link>
          <Link to="/organizer/analytics" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border-l-4 border-purple-500"><BarChart3 className="size-8 text-purple-500 mb-2" /><h3 className="font-semibold">Analytics</h3><p className="text-xs text-gray-500">Event performance</p></Link>
          <Link to="/profile" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border-l-4 border-gray-500"><Settings className="size-8 text-gray-500 mb-2" /><h3 className="font-semibold">Settings</h3><p className="text-xs text-gray-500">Account preferences</p></Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-500"><Calendar className="size-8 text-green-500 mb-2" /><p className="text-sm text-gray-600">Total Events</p><p className="text-2xl font-bold">{stats.total_events}</p></div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-blue-500"><Ticket className="size-8 text-blue-500 mb-2" /><p className="text-sm text-gray-600">Tickets Sold</p><p className="text-2xl font-bold">{stats.total_tickets_sold}</p></div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-yellow-500"><DollarSign className="size-8 text-yellow-500 mb-2" /><p className="text-sm text-gray-600">Revenue</p><p className="text-2xl font-bold">ETB {stats.total_revenue.toLocaleString()}</p></div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-orange-500"><Clock className="size-8 text-orange-500 mb-2" /><p className="text-sm text-gray-600">Pending</p><p className="text-2xl font-bold">{stats.pending_approvals}</p></div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-purple-500"><Award className="size-8 text-purple-500 mb-2" /><p className="text-sm text-gray-600">Completed</p><p className="text-2xl font-bold">{stats.completed_events}</p></div>
        </div>

        {/* My Events Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b"><h2 className="text-xl font-bold text-gray-900">My Events</h2></div>
          {events.length === 0 ? (
            <div className="text-center py-12"><Calendar className="size-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No events created yet</p><Link to="/organizer/create-event" className="mt-4 inline-block text-green-600 hover:underline">Create your first event</Link></div>
          ) : (
            <div className="divide-y divide-gray-200">
              {events.map((event) => (
                <div key={event.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="size-3" />{new Date(event.start_datetime).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MapPin className="size-3" />{event.city}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${event.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{event.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/event/${event.id}`} className="px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg text-sm flex items-center gap-1"><Eye className="size-4" /> View</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end"><button onClick={handleLogout} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 flex items-center gap-2"><LogOut className="size-4" /> Logout</button></div>
      </div>
    </div>
  );
}
