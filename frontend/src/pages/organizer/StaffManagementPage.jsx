import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, UserPlus, Shield, Calendar, Mail, Phone, 
  Trash2, Edit, CheckCircle, XCircle, Search,
  UserCog, QrCode, Eye
} from 'lucide-react';

// Mock staff data
const mockStaff = [
  {
    id: '1',
    full_name: 'Abebe Kebede',
    email: 'abebe@security.dems.com',
    phone_number: '+251-911-234-567',
    assigned_role: 'security',
    staff_badge_id: 'SEC-001',
    event_id: '1',
    event_name: 'Ethiopian Coffee Festival',
    status: 'active',
    created_at: '2024-01-15'
  },
  {
    id: '2',
    full_name: 'Helen Mekonnen',
    email: 'helen@staff.dems.com',
    phone_number: '+251-912-345-678',
    assigned_role: 'staff',
    staff_badge_id: 'STF-002',
    event_id: '1',
    event_name: 'Ethiopian Coffee Festival',
    status: 'active',
    created_at: '2024-01-16'
  },
  {
    id: '3',
    full_name: 'Dawit Tesfaye',
    email: 'dawit@security.dems.com',
    phone_number: '+251-913-456-789',
    assigned_role: 'security',
    staff_badge_id: 'SEC-003',
    event_id: '2',
    event_name: 'Hawassa Music Festival',
    status: 'inactive',
    created_at: '2024-02-01'
  }
];

const mockEvents = [
  { id: '1', title: 'Ethiopian Coffee Festival' },
  { id: '2', title: 'Hawassa Music Festival' },
  { id: '3', title: 'Gondar Traditional Dance' }
];

export function StaffManagementPage() {
  const [staff, setStaff] = useState(mockStaff);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    assigned_role: 'security',
    event_id: '',
    staff_badge_id: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    const newStaff = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
      event_name: mockEvents.find(e => e.id === formData.event_id)?.title
    };
    setStaff([...staff, newStaff]);
    setShowAddModal(false);
    setFormData({
      full_name: '',
      email: '',
      phone_number: '',
      assigned_role: 'security',
      event_id: '',
      staff_badge_id: ''
    });
    alert('Staff member added successfully!');
  };

  const handleDeleteStaff = (id) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter(member => member.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setStaff(staff.map(member => 
      member.id === id 
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.staff_badge_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === 'all' || member.event_id === selectedEvent;
    const matchesRole = selectedRole === 'all' || member.assigned_role === selectedRole;
    return matchesSearch && matchesEvent && matchesRole;
  });

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl flex items-center justify-center shadow-md">
                <UserCog className="size-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            </div>
            <p className="text-gray-600 ml-16">Manage security and event staff</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md flex items-center gap-2"
          >
            <UserPlus className="size-5" />
            Add Staff Member
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or badge ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Events</option>
              {mockEvents.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Roles</option>
              <option value="security">Security</option>
              <option value="staff">Staff</option>
            </select>
            <div className="text-right text-sm text-gray-500 pt-2">
              Total: {filteredStaff.length} staff members
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Staff Member</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Badge ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{member.full_name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                        {member.phone_number && (
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Phone className="size-3" /> {member.phone_number}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        member.assigned_role === 'security' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {member.assigned_role === 'security' ? <Shield className="size-3" /> : <Users className="size-3" />}
                        {member.assigned_role === 'security' ? 'Security' : 'Staff'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{member.event_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{member.staff_badge_id}</code>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(member.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {member.status === 'active' ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => window.open(`/security/scanner?staff=${member.id}`, '_blank')}
                          className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50"
                          title="Generate QR Code"
                        >
                          <QrCode className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Remove Staff"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <Users className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No staff members found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 text-green-600 font-medium hover:underline"
              >
                Add your first staff member
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <UserPlus className="size-5 text-green-600" />
                  Add Staff Member
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="size-6" />
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                    placeholder="Abebe Kebede"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                    placeholder="staff@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be their login email</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                    placeholder="+251 911 234 567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Role *</label>
                  <select
                    name="assigned_role"
                    value={formData.assigned_role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  >
                    <option value="security">Security (Can scan tickets)</option>
                    <option value="staff">Staff (General event staff)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Event *</label>
                  <select
                    name="event_id"
                    value={formData.event_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select an event</option>
                    {mockEvents.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID / Badge Number</label>
                  <input
                    type="text"
                    name="staff_badge_id"
                    value={formData.staff_badge_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                    placeholder="SEC-001"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800"
                  >
                    Add Staff Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
