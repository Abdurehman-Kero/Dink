import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, Lock, CheckCircle, Clock, 
  Shield, Wallet, Loader, Building, Smartphone,
  ArrowRight, DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function PayoutSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('telebirr');

  const [stats, setStats] = useState({
    total_fee_due: 5000,
    total_paid: 2500,
    pending_payment: 2500,
    next_payment_date: '2024-04-15',
    platform_fee_percentage: 10
  });

  const [paymentHistory, setPaymentHistory] = useState([
    { id: '1', date: '2024-02-15', amount: 1500, status: 'completed', method: 'Telebirr' },
    { id: '2', date: '2024-01-15', amount: 1000, status: 'completed', method: 'Bank Transfer' }
  ]);

  useEffect(() => {
    fetchPaymentStats();
  }, []);

  const fetchPaymentStats = async () => {
    setLoading(true);
    try {
      setStats({
        total_fee_due: 5000,
        total_paid: 2500,
        pending_payment: 2500,
        next_payment_date: '2024-04-15',
        platform_fee_percentage: 10
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentAmount || paymentAmount < 500) {
      setError('Minimum payment amount is ETB 500');
      return;
    }
    
    if (paymentAmount > stats.pending_payment) {
      setError(`Amount exceeds pending balance of ETB ${stats.pending_payment}`);
      return;
    }
    
    setProcessing(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/payments/platform-fee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          payment_method: paymentMethod
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        // Extract the error message properly
        const errorMessage = typeof data.message === 'string' 
          ? data.message 
          : (data.message?.email?.[0] || 'Payment failed. Please try again.');
        setError(errorMessage);
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Network error. Please check if backend is running.');
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
      default:
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Failed</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="size-12 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl shadow-lg mb-4">
            <DollarSign className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Fee Payment</h1>
          <p className="text-gray-600">Pay your platform fees to continue hosting events</p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
            <Shield className="size-4 text-green-600" />
            <span>Platform Fee: {stats.platform_fee_percentage}% of ticket sales</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Total Fee Due</p>
            <p className="text-2xl font-bold text-gray-900">ETB {stats.total_fee_due.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">ETB {stats.total_paid.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600">Pending Payment</p>
            <p className="text-2xl font-bold text-yellow-600">ETB {stats.pending_payment.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500">
            <p className="text-sm text-gray-600">Next Payment Due</p>
            <p className="text-2xl font-bold text-gray-900">{new Date(stats.next_payment_date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">ETB {payment.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.method}</td>
                    <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => setShowPaymentModal(true)} 
            disabled={stats.pending_payment === 0}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md disabled:opacity-50"
          >
            Pay Platform Fee
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="size-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Pay Platform Fee</h2>
              <p className="text-gray-500 text-sm">Pending amount: ETB {stats.pending_payment.toLocaleString()}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ETB)</label>
                <input 
                  type="number" 
                  value={paymentAmount} 
                  onChange={(e) => setPaymentAmount(e.target.value)} 
                  placeholder={`Min: 500, Max: ${stats.pending_payment}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setPaymentMethod('telebirr')} 
                    className={`flex-1 p-3 border-2 rounded-xl text-center transition ${paymentMethod === 'telebirr' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                  >
                    <Smartphone className="size-5 mx-auto mb-1" />
                    <span className="text-xs">Telebirr</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('cbe')} 
                    className={`flex-1 p-3 border-2 rounded-xl text-center transition ${paymentMethod === 'cbe' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                  >
                    <Building className="size-5 mx-auto mb-1" />
                    <span className="text-xs">CBE Birr</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('card')} 
                    className={`flex-1 p-3 border-2 rounded-xl text-center ${paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                  >
                    <CreditCard className="size-5 mx-auto mb-1" />
                    <span className="text-xs">Card</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
                <Shield className="size-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-700">Secure payment via Chapa. You will be redirected to complete payment.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700">
                  Cancel
                </button>
                <button 
                  onClick={handlePayment} 
                  disabled={processing} 
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? <Loader className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
                  {processing ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
