import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  LogOut,
  MapPin,
  QrCode,
  Shield,
  Ticket,
  Users,
  XCircle
} from 'lucide-react';

import { staffAPI } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export function StaffDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [staffInfo, setStaffInfo] = useState(null);
  const [stats, setStats] = useState({ total_tickets: 0, checked_in: 0 });
  const [scanning, setScanning] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [supportsNativeScanner, setSupportsNativeScanner] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const detectorRef = useRef(null);
  const processingRef = useRef(false);

  useEffect(() => {
    fetchStaffDashboard();
    setSupportsNativeScanner(Boolean(window.BarcodeDetector && navigator.mediaDevices?.getUserMedia));

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStaffDashboard = async () => {
    try {
      const data = await staffAPI.getStaffDashboard();
      if (data.success) {
        setStaffInfo(data.staff);
        setStats(data.stats);
      } else {
        logout();
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      logout();
      navigate('/login');
    }
  };

  const normalizeScanResult = (status, message) => ({
    success: status === 'valid',
    status,
    message
  });

  const appendRecentScan = (code, status) => {
    setRecentScans((prev) => [
      {
        code,
        status,
        time: new Date().toLocaleTimeString()
      },
      ...prev.slice(0, 9)
    ]);
  };

  const handleScan = async (providedCode) => {
    const rawCode = (providedCode || ticketCode || '').trim();

    if (!rawCode) {
      alert('Please scan or enter a QR token/ticket code');
      return;
    }

    if (scanning) {
      return;
    }

    setScanning(true);

    try {
      const isJwtToken = rawCode.split('.').length === 3;
      const data = await staffAPI.scanTicket(isJwtToken ? rawCode : null, isJwtToken ? null : rawCode);

      setScanResult(normalizeScanResult(data.status, data.message));
      appendRecentScan(rawCode, data.status);

      if (data.status === 'valid') {
        setStats((prev) => ({ ...prev, checked_in: prev.checked_in + 1 }));
      }
    } catch (error) {
      const status = error?.data?.status || 'invalid';
      const message = error?.data?.message || error.message || 'Scan failed';

      setScanResult(normalizeScanResult(status, message));
      appendRecentScan(rawCode, status);
    } finally {
      setTicketCode('');
      setScanning(false);
      setTimeout(() => setScanResult(null), 3500);
    }
  };

  const scanFrame = async () => {
    if (!cameraActive || !detectorRef.current || !videoRef.current) {
      return;
    }

    try {
      if (!processingRef.current && videoRef.current.readyState >= 2) {
        const barcodes = await detectorRef.current.detect(videoRef.current);

        if (barcodes.length > 0 && barcodes[0].rawValue) {
          processingRef.current = true;
          setTicketCode(barcodes[0].rawValue);
          await handleScan(barcodes[0].rawValue);

          setTimeout(() => {
            processingRef.current = false;
          }, 1200);
        }
      }
    } catch (error) {
      // Ignore frame decode errors and continue scanning.
    }

    rafRef.current = requestAnimationFrame(scanFrame);
  };

  const startCamera = async () => {
    if (!supportsNativeScanner) {
      setCameraError('Native QR scanning is not supported on this browser/device.');
      return;
    }

    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
      setCameraActive(true);
      rafRef.current = requestAnimationFrame(scanFrame);
    } catch (error) {
      console.error('Failed to start camera:', error);
      setCameraError('Unable to access camera. Please allow permission or use manual scan input.');
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    detectorRef.current = null;
    processingRef.current = false;
    setCameraActive(false);
  };

  const handleLogout = () => {
    stopCamera();
    logout();
    navigate('/login');
  };

  if (!staffInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin size-12 border-4 border-green-200 border-t-green-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Shield className="size-6 text-green-400" />
          <span className="text-white font-bold">DEMS Security</span>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">{staffInfo.assigned_role}</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:text-white">
          <LogOut className="size-4" /> Logout
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-gray-800 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold text-lg mb-2">{staffInfo.event_name}</h2>
          <div className="flex flex-wrap gap-3 text-gray-400 text-sm">
            <span className="flex items-center gap-1"><Calendar className="size-4" />{new Date(staffInfo.start_datetime).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Clock className="size-4" />{new Date(staffInfo.start_datetime).toLocaleTimeString()}</span>
            <span className="flex items-center gap-1"><MapPin className="size-4" />{staffInfo.venue_name}, {staffInfo.city}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-700 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs">Total Tickets</p>
              <p className="text-white text-2xl font-bold">{stats.total_tickets}</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs">Checked In</p>
              <p className="text-green-400 text-2xl font-bold">{stats.checked_in}</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.total_tickets ? (stats.checked_in / stats.total_tickets) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <QrCode className="size-5 text-green-400" />
            QR Scanner
          </h3>

          <div className="bg-gray-900/70 rounded-xl border border-gray-700 overflow-hidden mb-4">
            <video ref={videoRef} className="w-full h-56 object-cover bg-black" muted playsInline />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
              >
                <Camera className="size-4" /> Start Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
              >
                <XCircle className="size-4" /> Stop Camera
              </button>
            )}

            {!supportsNativeScanner && (
              <span className="text-xs text-yellow-300 bg-yellow-900/40 px-2 py-1 rounded">
                Native scanner not supported in this browser
              </span>
            )}
          </div>

          {cameraError && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/40 border border-red-700 text-red-200 text-sm flex items-center gap-2">
              <AlertCircle className="size-4" />
              {cameraError}
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              placeholder="Paste QR token or ticket code"
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
            <button
              onClick={() => handleScan()}
              disabled={scanning}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {scanning ? '...' : 'Validate'}
            </button>
          </div>

          {scanResult && (
            <div
              className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                scanResult.status === 'valid'
                  ? 'bg-green-500/20 border border-green-500 text-green-400'
                  : scanResult.status === 'already_scanned'
                    ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-300'
                    : 'bg-red-500/20 border border-red-500 text-red-400'
              }`}
            >
              {scanResult.status === 'valid' ? <CheckCircle className="size-5" /> : <XCircle className="size-5" />}
              {scanResult.message}
            </div>
          )}
        </div>

        {recentScans.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3">Recent Scans</h3>
            <div className="space-y-2">
              {recentScans.map((scan, idx) => (
                <div key={`${scan.time}-${idx}`} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                  <code className="text-xs text-gray-300 font-mono truncate max-w-[70%]">{scan.code}</code>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{scan.time}</span>
                    {scan.status === 'valid' ? (
                      <CheckCircle className="size-4 text-green-400" />
                    ) : scan.status === 'already_scanned' ? (
                      <AlertCircle className="size-4 text-yellow-400" />
                    ) : (
                      <XCircle className="size-4 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between text-center text-xs text-gray-500">
          <div>
            <Users className="size-4 mx-auto mb-1" />
            <p>Total Tickets</p>
            <p className="text-white font-semibold">{stats.total_tickets}</p>
          </div>
          <div>
            <Ticket className="size-4 mx-auto mb-1" />
            <p>Remaining</p>
            <p className="text-white font-semibold">{Math.max(0, stats.total_tickets - stats.checked_in)}</p>
          </div>
          <div>
            <Clock className="size-4 mx-auto mb-1" />
            <p>Checked In</p>
            <p className="text-white font-semibold">{stats.checked_in}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
