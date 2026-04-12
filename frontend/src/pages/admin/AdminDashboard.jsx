import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, DollarSign, TrendingUp, CheckCircle, 
  XCircle, Clock, Shield, UserCheck, Ticket, Award,
  Eye, RefreshCw, ChevronRight, Building, Mail, Phone,
  Trash2, Plus, Search, Tag, LayoutDashboard,
  Music, Palette, Briefcase, GraduationCap, Coffee,
  Star, Heart, MapPin, LogOut
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
  const [pendingOrganizers, setPendingOrganizers] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchDashboardStats(),
      fetchPendingOrganizers(),
      fetchEvents(),
      fetchCategories()
    ]);
    setLoading(false);
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(prev => ({ ...prev, ...data.stats }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total_users: 1250,
        total_organizers: 45,
        total_attendees: 1200,
        total_events: 28,
        live_events: 12,
        pending_approvals: 2,
        total_revenue: 845000,
        total_tickets_sold: 3450
      });
    }
  };

  const fetchPendingOrganizers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/admin/pending-organizers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPendingOrganizers(data.pending || []);
        setStats(prev => ({ ...prev, pending_approvals: data.pending?.length || 0 }));
      }
    } catch (error) {
      console.error('Error fetching pending organizers:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/admin/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEvents(data.events || []);
        setStats(prev => ({ ...prev, total_events: data.events?.length || 0 }));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/admin/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([
        { id: '1', name: 'Technology', slug: 'technology', event_count: 8 },
        { id: '2', name: 'Music', slug: 'music', event_count: 12 },
        { id: '3', name: 'Art & Culture', slug: 'art-culture', event_count: 15 },
        { id: '4', name: 'Sports', slug: 'sports', event_count: 6 },
        { id: '5', name: 'Educational', slug: 'educational', event_count: 10 },
        { id: '6', name: 'Business', slug: 'business', event_count: 5 }
      ]);
    }
  };

  const handleApprove = async (userId) => {
    if (confirm('Approve this organizer?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/admin/approve/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          alert('Organizer approved!');
          fetchPendingOrganizers();
          fetchDashboardStats();
        }
      } catch (error) {
        alert('Error approving organizer');
      }
    }
  };

  const handleReject = async (userId) => {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/admin/reject/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ reason })
        });
        const data = await response.json();
        if (data.success) {
          alert(`Organizer rejected: ${reason}`);
          fetchPendingOrganizers();
          fetchDashboardStats();
        }
      } catch (error) {
        alert('Error rejecting organizer');
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/admin/events/${eventId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          alert('Event deleted successfully');
          fetchEvents();
        }
      } catch (error) {
        alert('Error deleting event');
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      alert('Please fill all fields');
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/admin/categories`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newCategory)
      });
      const data = await response.json();
      if (data.success) {
        alert('Category added successfully');
        setShowCategoryModal(false);
        setNewCategory({ name: '', slug: '' });
        fetchCategories();
      } else {
        alert(data.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category');
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (confirm(`Delete category "${categoryName}"? This will not delete events in this category.`)) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          alert('Category deleted successfully');
          fetchCategories();
        } else {
          alert(data.message || 'Failed to delete category');
        }
      } catch (error) {
        alert('Error deleting category');
      }
    }
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Music': <Music className="size-5" />,
      'Technology': <Coffee className="size-5" />,
      'Art & Culture': <Palette className="size-5" />,
      'Business': <Briefcase className="size-5" />,
      'Educational': <GraduationCap className="size-5" />
    };
    return icons[categoryName] || <Tag className="size-5" />;
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'published': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Published</span>;
      case 'draft': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Draft</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Cancelled</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{status}</span>;
    }
  };

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(categorySearch.toLowerCase()) ||
    category.slug?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin size-12 border-4 border-green-200 border-t-green-600 rounded-full" />
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
            <button onClick={fetchAllData} className="px-4 py-2 bg-white border rounded-xl flex items-center gap-2">
              <RefreshCw className="size-4" /> Refresh
            </button>
            <button onClick={logout} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl">
              <LogOut className="size-4 mr-1" /> Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-500">
            <Users className="size-8 text-green-500 mb-2" />
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">{stats.total_users}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-blue-500">
            <Calendar className="size-8 text-blue-500 mb-2" />
            <p className="text-sm text-gray-600">Events</p>
            <p className="text-2xl font-bold">{stats.total_events}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-yellow-500">
            <Ticket className="size-8 text-yellow-500 mb-2" />
            <p className="text-sm text-gray-600">Tickets Sold</p>
            <p className="text-2xl font-bold">{stats.total_tickets_sold}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-purple-500">
            <DollarSign className="size-8 text-purple-500 mb-2" />
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold">ETB {stats.total_revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
          <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}>
            <LayoutDashboard className="size-4 inline mr-2" /> Overview
          </button>
          <button onClick={() => setActiveTab('events')} className={`px-6 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'events' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}>
            <Calendar className="size-4 inline mr-2" /> Events
          </button>
          <button onClick={() => setActiveTab('categories')} className={`px-6 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'categories' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}>
            <Tag className="size-4 inline mr-2" /> Categories
          </button>
          <button onClick={() => setActiveTab('approvals')} className={`px-6 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === 'approvals' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'}`}>
            <UserCheck className="size-4 inline mr-2" /> Approvals
            {stats.pending_approvals > 0 && (
              <span className="ml-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs">{stats.pending_approvals}</span>
            )}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold">Recent Events</h2>
              </div>
              <div className="divide-y">
                {filteredEvents.slice(0, 5).map(event => (
                  <div key={event.id} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.city} • {new Date(event.start_datetime).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(event.status)}
                      <Link to={`/event/${event.id}`} className="text-green-600 hover:text-green-700">
                        <Eye className="size-4" />
                      </Link>
                    </div>
                  </div>
                ))}
                {filteredEvents.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">No events found</div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <button onClick={() => setActiveTab('events')} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                  <span className="flex items-center gap-2"><Calendar className="size-4 text-green-600" /> Manage Events</span>
                  <ChevronRight className="size-4 text-gray-400" />
                </button>
                <button onClick={() => setActiveTab('categories')} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                  <span className="flex items-center gap-2"><Tag className="size-4 text-blue-600" /> Manage Categories</span>
                  <ChevronRight className="size-4 text-gray-400" />
                </button>
                <button onClick={() => setActiveTab('approvals')} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                  <span className="flex items-center gap-2"><UserCheck className="size-4 text-yellow-600" /> Approve Organizers</span>
                  <ChevronRight className="size-4 text-gray-400" />
                </button>
                <Link to="/admin/users" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                  <span className="flex items-center gap-2"><Users className="size-4 text-purple-600" /> Manage Users</span>
                  <ChevronRight className="size-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-xl font-bold">All Events</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Organizer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{event.title}</div>
                        <div className="text-xs text-gray-500">{event.city}</div>
                       </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{event.organizer_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(event.start_datetime).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(event.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/event/${event.id}`} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                            <Eye className="size-4" />
                          </Link>
                          <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No events found</p>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-xl font-bold">Event Categories</h2>
              <div className="flex gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search categories..." 
                    value={categorySearch} 
                    onChange={(e) => setCategorySearch(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button onClick={() => setShowCategoryModal(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
                  <Plus className="size-4" /> Add Category
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filteredCategories.map((category) => (
                <div key={category.id} className="border rounded-xl p-4 hover:shadow-md transition-all hover:border-green-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                          {getCategoryIcon(category.name)}
                        </div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Ticket className="size-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{category.event_count || 0} events</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteCategory(category.id, category.name)} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <Tag className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No categories found</p>
                <button onClick={() => setShowCategoryModal(true)} className="mt-4 text-green-600 hover:text-green-700">
                  Add your first category
                </button>
              </div>
            )}
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Pending Organizer Approvals</h2>
            </div>
            <div className="p-6">
              {pendingOrganizers.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="size-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-500">No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrganizers.map(org => (
                    <div key={org.id} className="border rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{org.organization_name}</h3>
                        <p className="text-sm text-gray-500">{org.full_name} • {org.email}</p>
                        <p className="text-xs text-gray-400">Submitted: {new Date(org.submitted_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedApp(org); setShowModal(true); }} 
                          className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleApprove(org.id)} 
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(org.id)} 
                          className="px-3 py-1.5 border border-red-500 text-red-600 rounded-lg text-sm hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Application Details</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="size-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Organization</h3>
                <p><strong>Name:</strong> {selectedApp.organization_name}</p>
                <p><strong>Type:</strong> {selectedApp.organization_type}</p>
                <p><strong>Bio:</strong> {selectedApp.bio}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                <p><strong>Name:</strong> {selectedApp.full_name}</p>
                <p><strong>Email:</strong> {selectedApp.email}</p>
                <p><strong>Phone:</strong> {selectedApp.phone_number}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button onClick={() => { handleApprove(selectedApp.id); setShowModal(false); }} className="flex-1 py-2 bg-green-600 text-white rounded-lg">
                Approve
              </button>
              <button onClick={() => { handleReject(selectedApp.id); setShowModal(false); }} className="flex-1 py-2 border border-red-500 text-red-600 rounded-lg">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Category</h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="size-6" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input 
                  type="text" 
                  value={newCategory.name} 
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} 
                  required 
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Technology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input 
                  type="text" 
                  value={newCategory.slug} 
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })} 
                  required 
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., technology"
                />
                <p className="text-xs text-gray-500 mt-1">URL-friendly version of the category name</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
