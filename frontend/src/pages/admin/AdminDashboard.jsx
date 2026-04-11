import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, DollarSign, TrendingUp, CheckCircle, 
  XCircle, Clock, Shield, UserCheck, Ticket, Award,
  Eye, RefreshCw, ChevronRight, Building, Mail, Phone
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
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch pending organizers from API
      const token = localStorage.getItem('authToken');
      const pendingResponse = await fetch(`${API_URL}/admin/pending-organizers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const pendingData = await pendingResponse.json();
      
      if (pendingData.success) {
        setPendingOrganizers(pendingData.pending || []);
        setStats(prev => ({ ...prev, pending_approvals: pendingData.pending?.length || 0 }));
      }
      
      // Get total users count
      const usersResponse = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersData = await usersResponse.json();
      
      if (usersData.success) {
        setStats(prev => ({
          ...prev,
          total_users: usersData.total || 0,
          total_organizers: usersData.organizers || 0,
          total_attendees: usersData.attendees || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (confirm('Approve this organizer?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/admin/approve/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setPendingOrganizers(prev => prev.filter(org => org.id !== userId));
          setStats(prev => ({ ...prev, pending_approvals: prev.pending_approvals - 1, total_organizers: prev.total_organizers + 1 }));
          alert(`Organizer approved! Email sent to ${data.email}`);
          fetchDashboardData();
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ reason })
        });
        const data = await response.json();
        if (data.success) {
          setPendingOrganizers(prev => prev.filter(org => org.id !== userId));
          setStats(prev => ({ ...prev, pending_approvals: prev.pending_approvals - 1 }));
          alert(`Organizer rejected. Reason: ${reason}`);
          fetchDashboardData();
        }
      } catch (error) {
        alert('Error rejecting organizer');
      }
    }
  };

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
        <div className="flex-1 bg-green-600" /><div className="flex-1 bg-yellow-400" /><div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'}!</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchDashboardData} className="px-4 py-2 bg-white border rounded-xl flex items-center gap-2"><RefreshCw className="size-4" /> Refresh</button>
            <button onClick={logout} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl">Logout</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-500"><Users className="size-8 text-green-500 mb-2" /><p className="text-sm text-gray-600">Total Users</p><p className="text-2xl font-bold">{stats.total_users}</p></div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-blue-500"><Calendar className="size-8 text-blue-500 mb-2" /><p className="text-sm text-gray-600">Events</p><p className="text-2xl font-bold">{stats.total_events}</p></div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-yellow-500"><Ticket className="size-8 text-yellow-500 mb-2" /><p className="text-sm text-gray-600">Tickets Sold</p><p className="text-2xl font-bold">{stats.total_tickets_sold}</p></div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-purple-500"><DollarSign className="size-8 text-purple-500 mb-2" /><p className="text-sm text-gray-600">Revenue</p><p className="text-2xl font-bold">ETB {stats.total_revenue.toLocaleString()}</p></div>
        </div>

        {/* Pending Approvals Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="size-5 text-orange-500" /> Pending Organizer Approvals
              {stats.pending_approvals > 0 && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">{stats.pending_approvals}</span>}
            </h2>
            <Link to="/admin/approvals" className="text-sm text-green-600 hover:text-green-700">View All ‚Üí</Link>
          </div>
          <div className="p-6">
            {pendingOrganizers.length === 0 ? (
              <div className="text-center py-8"><CheckCircle className="size-12 text-green-400 mx-auto mb-3" /><p className="text-gray-500">No pending approvals</p></div>
            ) : (
              <div className="space-y-4">
                {pendingOrganizers.slice(0, 3).map(org => (
                  <div key={org.id} className="border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{org.organization_name}</h3>
                      <p className="text-sm text-gray-500">{org.full_name} ‚Ä¢ {org.email}</p>
                      <p className="text-xs text-gray-400">Submitted: {new Date(org.submitted_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedApp(org); setShowModal(true); }} className="px-3 py-1.5 border rounded-lg text-sm">View</button>
                      <button onClick={() => handleApprove(org.id)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm flex items-center gap-1"><CheckCircle className="size-4" /> Approve</button>
                      <button onClick={() => handleReject(org.id)} className="px-3 py-1.5 border border-red-500 text-red-600 rounded-lg text-sm flex items-center gap-1"><XCircle className="size-4" /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b"><h2 className="text-xl font-bold">Quick Actions</h2></div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link to="/admin/approvals" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100"><span>‚úì Approve Organizers</span><ChevronRight className="size-4" /></Link>
            <Link to="/admin/users" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100"><span>Ì±• Manage Users</span><ChevronRight className="size-4" /></Link>
            <Link to="/admin/events" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100"><span>Ì≥Ö Manage Events</span><ChevronRight className="size-4" /></Link>
            <Link to="/admin/categories" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100"><span>Ìø∑Ô∏è Categories</span><ChevronRight className="size-4" /></Link>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Application Details</h2><button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">‚úï</button></div>
              <div className="space-y-4">
                <div><h3 className="font-semibold text-gray-900 mb-2">Organization</h3><p><strong>Name:</strong> {selectedApp.organization_name}</p><p><strong>Type:</strong> {selectedApp.organization_type}</p><p><strong>Bio:</strong> {selectedApp.bio}</p></div>
                <div><h3 className="font-semibold text-gray-900 mb-2">Contact</h3><p><strong>Name:</strong> {selectedApp.full_name}</p><p><strong>Email:</strong> {selectedApp.email}</p><p><strong>Phone:</strong> {selectedApp.phone_number}</p></div>
                {selectedApp.website_url && <div><p><strong>Website:</strong> <a href={`https://${selectedApp.website_url}`} target="_blank" className="text-green-600">{selectedApp.website_url}</a></p></div>}
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t"><button onClick={() => { handleApprove(selectedApp.id); setShowModal(false); }} className="flex-1 py-2 bg-green-600 text-white rounded-lg">Approve</button><button onClick={() => { handleReject(selectedApp.id); setShowModal(false); }} className="flex-1 py-2 border border-red-500 text-red-600 rounded-lg">Reject</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
