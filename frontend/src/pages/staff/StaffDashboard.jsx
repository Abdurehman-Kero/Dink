import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Ticket, Users, CheckCircle, XCircle, QrCode, LogOut, Calendar, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function StaffDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [staffInfo, setStaffInfo] = useState(null);
  const [stats, setStats] = useState({ total_tickets: 0, checked_in: 0 });
  const [scanning, setScanning] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    fetchStaffDashboard();
  }, []);

  const fetchStaffDashboard = async () => {
    try {
      const response = await fetch(`${API_URL}/staff/dashboard`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await response.json();
      if (data.success) {
        setStaffInfo(data.staff);
        setStats(data.stats);
      } else {
        // If no event assigned, logout
        logout();
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const handleScan = async () => {
    if (!ticketCode.trim()) {
      alert('Please enter a ticket code');
      return;
    }

    setScanning(true);
    try {
      const response = await fetch(`${API_URL}/staff/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ ticket_code: ticketCode })
      });
      const data = await response.json();
      
      if (response.ok) {
        setScanResult({ success: true, message: data.message });
        setStats(prev => ({ ...prev, checked_in: prev.checked_in + 1 }));
        setRecentScans(prev => [{
          code: ticketCode,
          status: 'success',
          time: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 9)]);
        setTimeout(() => setScanResult(null), 3000);
      } else {
        setScanResult({ success: false, message: data.message });
        setRecentScans(prev => [{
          code: ticketCode,
          status: 'failed',
          time: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 9)]);
        setTimeout(() => setScanResult(null), 3000);
      }
      setTicketCode('');
    } catch (error) {
      setScanResult({ success: false, message: 'Scan failed' });
      setTimeout(() => setScanResult(null), 3000);
    } finally {
      setScanning(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!staffInfo) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="animate-spin size-12 border-4 border-green-200 border-t-green-600 rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2"><Shield className="size-6 text-green-400" /><span className="text-white font-bold">DEMS Security</span><span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">{staffInfo.assigned_role}</span></div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:text-white"><LogOut className="size-4" /> Logout</button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Event Info */}
        <div className="bg-gray-800 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold text-lg mb-2">{staffInfo.event_name}</h2>
          <div className="flex flex-wrap gap-3 text-gray-400 text-sm">
            <span className="flex items-center gap-1"><Calendar className="size-4" />{new Date(staffInfo.start_datetime).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Clock className="size-4" />{new Date(staffInfo.start_datetime).toLocaleTimeString()}</span>
            <span className="flex items-center gap-1"><MapPin className="size-4" />{staffInfo.venue_name}, {staffInfo.city}</span>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-700 rounded-xl p-3 text-center"><p className="text-gray-400 text-xs">Total Tickets</p><p className="text-white text-2xl font-bold">{stats.total_tickets}</p></div>
            <div className="bg-gray-700 rounded-xl p-3 text-center"><p className="text-gray-400 text-xs">Checked In</p><p className="text-green-400 text-2xl font-bold">{stats.checked_in}</p></div>
          </div>
          <div className="mt-3"><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${stats.total_tickets ? (stats.checked_in / stats.total_tickets) * 100 : 0}%` }} /></div></div>
        </div>

        {/* Scanner Section */}
        <div className="bg-gray-800 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><QrCode className="size-5 text-green-400" />QR Scanner</h3>
          <div className="flex gap-3">
            <input type="text" value={ticketCode} onChange={(e) => setTicketCode(e.target.value)} placeholder="Enter ticket code or scan QR" className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500" onKeyPress={(e) => e.key === 'Enter' && handleScan()} />
            <button onClick={handleScan} disabled={scanning} className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50">{scanning ? '...' : 'Validate'}</button>
          </div>
          
          {scanResult && (<div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${scanResult.success ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-red-500/20 border border-red-500 text-red-400'}`}>{scanResult.success ? <CheckCircle className="size-5" /> : <XCircle className="size-5" />}{scanResult.message}</div>)}
        </div>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3">Recent Scans</h3>
            <div className="space-y-2">
              {recentScans.map((scan, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                  <code className="text-xs text-gray-300 font-mono">{scan.code}</code>
                  <div className="flex items-center gap-2"><span className="text-xs text-gray-400">{scan.time}</span>{scan.status === 'success' ? <CheckCircle className="size-4 text-green-400" /> : <XCircle className="size-4 text-red-400" />}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
