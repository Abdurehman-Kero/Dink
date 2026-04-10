import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Lock, CheckCircle, Clock, AlertCircle, 
  Shield, Smartphone, Building, Calendar, User, 
  Mail, Phone, MapPin, Coffee, Ticket, ChevronRight
} from 'lucide-react';

// Mock reservations data
const MOCK_RESERVATIONS = [
  {
    id: 'res_1',
    event_id: '1',
    event: {
      id: '1',
      title: 'ታላቁ የኢትዮጵያ ቡና ፌስቲቫል | Great Ethiopian Coffee Festival',
      image_url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31'
    },
    ticket_type: {
      id: 't1',
      tier_name: 'General Admission',
      price: 250
    },
    quantity: 2,
    subtotal: 500,
    service_fee: 50,
    total_price: 550,
    reserved_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  },
  {
    id: 'res_2',
    event_id: '2',
    event: {
      id: '2',
      title: 'ታላቁ የሐዋሳ ሙዚቃ ፌስቲቫል | Hawassa Music Festival',
      image_url: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c'
    },
    ticket_type: {
      id: 't2',
      tier_name: 'VIP Access',
      price: 800
    },
    quantity: 1,
    subtotal: 800,
    service_fee: 80,
    total_price: 880,
    reserved_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 12 * 60 * 1000).toISOString()
  }
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 15, seconds: 0 });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadReservations();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (reservations.length === 0) return;

    const earliestExpiry = Math.min(...reservations.map(r => new Date(r.expires_at).getTime()));
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = earliestExpiry - now;
      
      if (distance < 0) {
        clearInterval(timer);
        alert('Your reservation has expired. Please try again.');
        navigate('/saved-tickets');
        return;
      }
      
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [reservations, navigate]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const savedReservations = JSON.parse(localStorage.getItem('checkoutReservations') || 'null');
        if (savedReservations && savedReservations.length > 0) {
          setReservations(savedReservations);
        } else {
          setReservations(MOCK_RESERVATIONS);
        }
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading reservations:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentComplete(true);
      
      // Clear reservations from localStorage
      localStorage.removeItem('checkoutReservations');
      
      setTimeout(() => {
        navigate('/my-tickets');
      }, 2000);
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const totals = reservations.reduce(
    (acc, res) => ({
      subtotal: acc.subtotal + res.subtotal,
      service_fee: acc.service_fee + res.service_fee,
      total: acc.total + res.total_price,
    }),
    { subtotal: 0, service_fee: 0, total: 0 }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin size-16 border-4 border-green-200 border-t-green-600 rounded-full mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Coffee className="size-6 text-green-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500 mt-4">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-scaleUp">
          <div className="inline-flex items-center justify-center size-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="size-14 text-green-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            ስኬት! | Payment Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your tickets have been sent to your email and are available in your account.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Order Number: #DEMS-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
            <p className="text-xs text-gray-400 mt-1">Check your email for ticket details</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="animate-spin size-4 border-2 border-green-600 border-t-transparent rounded-full" />
            Redirecting to your tickets...
          </div>
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket className="size-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No items to checkout</h2>
          <p className="text-gray-500 mb-6">Your cart is empty. Add some tickets to continue.</p>
          <button
            onClick={() => navigate('/discover')}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      {/* Ethiopian Tricolor Accent */}
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl shadow-lg mb-4">
            <CreditCard className="size-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase to secure your tickets</p>
        </div>

        {/* Countdown Timer Banner */}
        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="size-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Complete checkout within</p>
                <p className="text-xs text-yellow-600">Your tickets are reserved until time expires</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-2xl font-bold text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-gray-400">:</span>
              <span className="text-2xl font-bold text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-sm text-gray-500 ml-2">remaining</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-yellow-200 rounded-full h-1.5">
            <div 
              className="bg-yellow-600 h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${((timeLeft.minutes * 60 + timeLeft.seconds) / (15 * 60)) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="size-5 text-green-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+251 911 234 567"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="size-5 text-green-600" />
                Payment Method
              </h2>
              
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 p-4 border-2 rounded-xl text-center transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className={`size-6 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-green-600' : 'text-gray-600'}`}>Credit Card</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('telebirr')}
                  className={`flex-1 p-4 border-2 rounded-xl text-center transition-all ${
                    paymentMethod === 'telebirr' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className={`size-6 mx-auto mb-2 ${paymentMethod === 'telebirr' ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${paymentMethod === 'telebirr' ? 'text-green-600' : 'text-gray-600'}`}>Telebirr</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('cbe')}
                  className={`flex-1 p-4 border-2 rounded-xl text-center transition-all ${
                    paymentMethod === 'cbe' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building className={`size-6 mx-auto mb-2 ${paymentMethod === 'cbe' ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${paymentMethod === 'cbe' ? 'text-green-600' : 'text-gray-600'}`}>CBE Birr</p>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pl-12"
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        type="text"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(paymentMethod === 'telebirr' || paymentMethod === 'cbe') && (
                <div className="text-center py-8">
                  <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="size-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2">You will be redirected to {paymentMethod === 'telebirr' ? 'Telebirr' : 'CBE Birr'} to complete payment</p>
                  <p className="text-sm text-gray-500">After clicking "Complete Payment", follow the instructions on your phone</p>
                </div>
              )}

              <div className="mt-6 flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <Lock className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-green-700">Your payment information is encrypted and secure. We never store your card details.</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Ticket className="size-5 text-green-600" />
                Order Summary
              </h2>
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={reservation.event.image_url} 
                        alt={reservation.event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {reservation.event.title.split('|')[0]}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {reservation.ticket_type.tier_name} × {reservation.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{reservation.subtotal} ETB</div>
                          <div className="text-xs text-gray-400">{reservation.ticket_type.price} ETB each</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Order Total */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-gray-100">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl mb-3">
                  <Shield className="size-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Payment Summary</h2>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">{totals.subtotal.toFixed(2)} ETB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Service Fee (10%)</span>
                  <span className="font-semibold text-gray-900">{totals.service_fee.toFixed(2)} ETB</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600">{totals.total.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 ml-1">ETB</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="size-5" />
                    Complete Payment
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <CheckCircle className="size-3 text-green-500" />
                <span>Secure checkout</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>24/7 support</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <AlertCircle className="size-3" />
                  <span>By completing this purchase, you agree to our Terms of Service</span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Need Help?</h3>
              <p className="text-xs text-gray-600 mb-3">Contact our support team for assistance</p>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
