import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  QrCode, Camera, CheckCircle, XCircle, AlertCircle, 
  Users, Ticket, Clock, Shield, LogOut, ScanLine
} from 'lucide-react';

// Mock scanned tickets data
const mockScannedTickets = [
  { id: '1', code: 'DEMS-TKT-8F3A2B1C', status: 'valid', scanned_at: '2024-12-15 10:30:00' },
  { id: '2', code: 'DEMS-TKT-9G4B3C2D', status: 'already_scanned', scanned_at: '2024-12-15 10:25:00' },
  { id: '3', code: 'DEMS-TKT-7H5D4E3F', status: 'invalid', scanned_at: '2024-12-15 10:20:00' }
];

export function SecurityScannerPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [ticketCode, setTicketCode] = useState('');
  const [eventStats, setEventStats] = useState({
    event_name: 'Ethiopian Coffee Festival',
    total_sold: 1850,
    checked_in: 1247,
    capacity: 2000
  });
  const [recentScans, setRecentScans] = useState(mockScannedTickets);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Simulate QR scan
  const handleScan = () => {
    if (!ticketCode.trim()) {
      alert('Please enter or scan a ticket code');
      return;
    }

    setScanning(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock validation logic
      const isValid = ticketCode.length > 10;
      const isAlreadyScanned = ticketCode === 'DEMS-TKT-9G4B3C2D';
      
      if (isValid && !isAlreadyScanned) {
        setScanResult({ status: 'valid', message: 'Ticket Valid! Welcome to the event!' });
        setShowSuccess(true);
        
        // Update stats
        setEventStats(prev => ({
          ...prev,
          checked_in: prev.checked_in + 1
        }));
        
        // Add to recent scans
        setRecentScans(prev => [{
          id: Date.now().toString(),
          code: ticketCode,
          status: 'valid',
          scanned_at: new Date().toLocaleString()
        }, ...prev.slice(0, 9)]);
        
        setTimeout(() => setShowSuccess(false), 3000);
      } else if (isAlreadyScanned) {
        setScanResult({ status: 'already_scanned', message: 'Ticket already used! Please check again.' });
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      } else {
        setScanResult({ status: 'invalid', message: 'Invalid ticket code! Please verify.' });
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
      
      setScanning(false);
      setTicketCode('');
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'valid': return <CheckCircle className="size-4 text-green-500" />;
      case 'already_scanned': return <AlertCircle className="size-4 text-yellow-500" />;
      case 'invalid': return <XCircle className="size-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'valid': return 'Valid Entry';
      case 'already_scanned': return 'Already Used';
      case 'invalid': return 'Invalid Ticket';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-6 text-green-400" />
            <span className="text-white font-bold">DEMS Security</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Event Info */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">{eventStats.event_name}</h2>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-xs">Expected</p>
              <p className="text-white font-bold text-lg">{eventStats.total_sold}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Checked In</p>
              <p className="text-green-400 font-bold text-lg">{eventStats.checked_in}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Attendance Progress</span>
              <span>{Math.round((eventStats.checked_in / eventStats.total_sold) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(eventStats.checked_in / eventStats.total_sold) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scanner Section */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <div className="text-center mb-4">
            <div className="w-24 h-24 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Camera className="size-12 text-gray-400" />
            </div>
            <h3 className="text-white font-semibold">QR Scanner</h3>
            <p className="text-gray-400 text-sm">Position QR code in front of camera</p>
          </div>

          {/* Manual Entry */}
          <div className="mt-4">
            <label className="block text-sm text-gray-300 mb-2">Or enter ticket code manually:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                placeholder="DEMS-TKT-XXXXXX"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              />
              <button
                onClick={handleScan}
                disabled={scanning}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50"
              >
                {scanning ? (
                  <div className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <ScanLine className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {showSuccess && scanResult?.status === 'valid' && (
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 mb-6 animate-pulse">
            <div className="flex items-center gap-3">
              <CheckCircle className="size-8 text-green-400" />
              <div>
                <h4 className="text-green-400 font-bold">Access Granted!</h4>
                <p className="text-green-300 text-sm">{scanResult.message}</p>
              </div>
            </div>
          </div>
        )}

        {showError && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <XCircle className="size-8 text-red-400" />
              <div>
                <h4 className="text-red-400 font-bold">Access Denied!</h4>
                <p className="text-red-300 text-sm">{scanResult?.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Scans */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Clock className="size-4 text-gray-400" />
            Recent Scans
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentScans.map((scan) => (
              <div key={scan.id} className="bg-gray-700/50 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <code className="text-xs text-gray-300 font-mono">{scan.code}</code>
                  <p className="text-xs text-gray-500 mt-1">{scan.scanned_at}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(scan.status)}
                  <span className={`text-xs ${
                    scan.status === 'valid' ? 'text-green-400' : 
                    scan.status === 'already_scanned' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {getStatusText(scan.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 flex justify-between text-center text-xs text-gray-500">
          <div>
            <Users className="size-4 mx-auto mb-1" />
            <p>Total Tickets</p>
            <p className="text-white font-semibold">{eventStats.total_sold}</p>
          </div>
          <div>
            <Ticket className="size-4 mx-auto mb-1" />
            <p>Remaining</p>
            <p className="text-white font-semibold">{eventStats.total_sold - eventStats.checked_in}</p>
          </div>
          <div>
            <Clock className="size-4 mx-auto mb-1" />
            <p>Capacity</p>
            <p className="text-white font-semibold">{eventStats.capacity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
