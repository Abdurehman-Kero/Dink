import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, XCircle, Eye, Clock, Building, 
  Mail, Phone, Globe, AlertCircle, UserCheck,
  Search, Filter, Download
} from 'lucide-react';

// Mock pending organizer applications
const mockPendingApplications = [
  {
    id: '1',
    organization_name: 'Ethiopian Coffee Association',
    organization_type: 'non_profit',
    full_name: 'Abebe Kebede',
    email: 'abebe@ethiopiancoffee.org',
    work_email: 'abebe@ethiopiancoffee.org',
    phone_number: '+251-911-234-567',
    website_url: 'www.ethiopiancoffee.org',
    bio: 'Promoting Ethiopian coffee culture through festivals and events since 2010.',
    tax_id_number: '123456789',
    business_registration_number: 'REG-001-2020',
    social_linkedin: 'https://linkedin.com/company/ethiopian-coffee',
    social_instagram: 'https://instagram.com/ethiopiancoffee',
    submitted_at: '2024-03-10T10:30:00',
    status: 'pending'
  },
  {
    id: '2',
    organization_name: 'Hawassa Arts Festival',
    organization_type: 'corporate',
    full_name: 'Helen Mekonnen',
    email: 'helen@hawassaarts.com',
    work_email: 'helen@hawassaarts.com',
    phone_number: '+251-912-345-678',
    website_url: 'www.hawassaarts.com',
    bio: 'Organizing annual arts and music festival in Hawassa.',
    tax_id_number: '987654321',
    business_registration_number: 'REG-002-2021',
    social_linkedin: 'https://linkedin.com/company/hawassa-arts',
    submitted_at: '2024-03-11T14:20:00',
    status: 'pending'
  },
  {
    id: '3',
    organization_name: 'Gondar Cultural Heritage',
    organization_type: 'government',
    full_name: 'Dawit Tesfaye',
    email: 'dawit@gondarheritage.gov.et',
    work_email: 'dawit@gondarheritage.gov.et',
    phone_number: '+251-913-456-789',
    website_url: 'www.gondarheritage.gov.et',
    bio: 'Preserving and promoting Gondar cultural heritage through events.',
    tax_id_number: '456789123',
    business_registration_number: 'REG-003-2019',
    submitted_at: '2024-03-12T09:15:00',
    status: 'pending'
  }
];

export function AdminApprovalPage() {
  const [applications, setApplications] = useState(mockPendingApplications);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleApprove = (id) => {
    if (confirm('Are you sure you want to approve this organizer?')) {
      setApplications(applications.filter(app => app.id !== id));
      alert('Organizer approved successfully! They will receive an email notification.');
    }
  };

  const handleReject = (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      setApplications(applications.filter(app => app.id !== id));
      alert(`Organizer rejected. Reason: ${reason}`);
    }
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || app.organization_type === filterType;
    return matchesSearch && matchesFilter;
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
                <UserCheck className="size-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Organizer Approvals</h1>
            </div>
            <p className="text-gray-600 ml-16">Review and approve organizer applications</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download className="size-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
            <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Approved This Month</p>
            <p className="text-3xl font-bold text-gray-900">12</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total Organizers</p>
            <p className="text-3xl font-bold text-gray-900">234</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by organization, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              <option value="non_profit">Non-Profit</option>
              <option value="corporate">Corporate</option>
              <option value="individual">Individual</option>
              <option value="government">Government</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{app.organization_name}</h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Building className="size-4" />
                        {app.organization_type.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                      <Clock className="size-3" />
                      Pending
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <UserCheck className="size-4" />
                      {app.full_name}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="size-4" />
                      {app.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="size-4" />
                      {app.phone_number}
                    </div>
                    {app.website_url && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="size-4" />
                        <a href={`https://${app.website_url}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                          {app.website_url}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">{app.bio}</p>
                  <p className="text-xs text-gray-400 mt-2">Submitted {getDaysAgo(app.submitted_at)}</p>
                </div>
                
                <div className="flex flex-row md:flex-col gap-2">
                  <button
                    onClick={() => handleViewDetails(app)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="size-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="size-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    className="px-4 py-2 border border-red-500 text-red-600 rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="size-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredApplications.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center">
              <CheckCircle className="size-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Applications</h3>
              <p className="text-gray-500">All organizer applications have been reviewed.</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="size-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Organization Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building className="size-5 text-green-600" />
                  Organization Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedApp.organization_name}</p>
                  <p><span className="font-medium">Type:</span> {selectedApp.organization_type}</p>
                  <p><span className="font-medium">Bio:</span> {selectedApp.bio}</p>
                  {selectedApp.website_url && <p><span className="font-medium">Website:</span> {selectedApp.website_url}</p>}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="size-5 text-green-600" />
                  Contact Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p><span className="font-medium">Contact Person:</span> {selectedApp.full_name}</p>
                  <p><span className="font-medium">Email:</span> {selectedApp.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedApp.phone_number}</p>
                </div>
              </div>

              {/* Business Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="size-5 text-green-600" />
                  Business Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {selectedApp.tax_id_number && <p><span className="font-medium">Tax ID:</span> {selectedApp.tax_id_number}</p>}
                  {selectedApp.business_registration_number && <p><span className="font-medium">Registration Number:</span> {selectedApp.business_registration_number}</p>}
                </div>
              </div>

              {/* Social Media */}
              {(selectedApp.social_linkedin || selectedApp.social_instagram) && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Social Media</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    {selectedApp.social_linkedin && <p><span className="font-medium">LinkedIn:</span> {selectedApp.social_linkedin}</p>}
                    {selectedApp.social_instagram && <p><span className="font-medium">Instagram:</span> {selectedApp.social_instagram}</p>}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleApprove(selectedApp.id);
                    setShowModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"
                >
                  Approve Application
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedApp.id);
                    setShowModal(false);
                  }}
                  className="flex-1 px-4 py-2 border border-red-500 text-red-600 rounded-xl font-medium hover:bg-red-50"
                >
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
