import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, Banknote, Shield, AlertCircle, CheckCircle, 
  Save, Eye, EyeOff, Building, Smartphone, Wallet
} from 'lucide-react';

export function PayoutSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [formData, setFormData] = useState({
    bank_account_name: '',
    bank_name: '',
    bank_account_number: '',
    confirm_account_number: '',
    iban: '',
    swift_code: '',
    bank_branch: '',
    account_type: 'business'
  });

  const [payoutHistory] = useState([
    { id: '1', date: '2024-02-15', amount: 12500, status: 'completed', event: 'Ethiopian Coffee Festival' },
    { id: '2', date: '2024-01-15', amount: 8700, status: 'completed', event: 'Hawassa Music Festival' },
    { id: '3', date: '2024-03-01', amount: 3400, status: 'pending', event: 'Gondar Traditional Dance' }
  ]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.bank_account_number !== formData.confirm_account_number) {
      alert('Bank account numbers do not match!');
      return;
    }
    
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Payout information saved successfully! Your account will be verified within 2-3 business days.');
    } catch (error) {
      alert('Failed to save payout information');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="size-3" /> Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
      default:
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Failed</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Ethiopian Tricolor Accent */}
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl flex items-center justify-center shadow-md">
                <Banknote className="size-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Payout Settings</h1>
            </div>
            <p className="text-gray-600 ml-16">Manage your payment and withdrawal information</p>
          </div>
          <Link 
            to="/organizer/dashboard" 
            className="mt-4 md:mt-0 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bank Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building className="size-5 text-green-600" />
                  Bank Account Information
                </h2>
                <button 
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  {showBankDetails ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  {showBankDetails ? 'Hide' : 'Show'} Details
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    name="bank_account_name"
                    value={formData.bank_account_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="As it appears on bank account"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Commercial Bank of Ethiopia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Branch
                  </label>
                  <input
                    type="text"
                    name="bank_branch"
                    value={formData.bank_branch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Bole Branch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    name="account_type"
                    value={formData.account_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="business">Business Account</option>
                    <option value="personal">Personal Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Account Number *
                  </label>
                  <input
                    type={showBankDetails ? 'text' : 'password'}
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1000 1234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Account Number *
                  </label>
                  <input
                    type={showBankDetails ? 'text' : 'password'}
                    name="confirm_account_number"
                    value={formData.confirm_account_number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Re-enter account number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IBAN (if applicable)
                    </label>
                    <input
                      type="text"
                      name="iban"
                      value={formData.iban}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="IBAN"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SWIFT/BIC Code
                    </label>
                    <input
                      type="text"
                      name="swift_code"
                      value={formData.swift_code}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="SWIFT/BIC"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Security Note</p>
                      <p className="text-blue-700">Your bank information is encrypted and secure. We use bank-grade security to protect your financial data.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="size-5" />
                      Save Payout Information
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar - Payout Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payout Summary Card */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="size-6" />
                <h3 className="font-semibold">Total Earnings</h3>
              </div>
              <div className="text-3xl font-bold mb-2">ETB 24,600</div>
              <p className="text-green-100 text-sm">Next payout: March 15, 2024</p>
              <div className="mt-4 pt-4 border-t border-green-500">
                <div className="flex justify-between text-sm">
                  <span>Available for payout</span>
                  <span className="font-semibold">ETB 3,400</span>
                </div>
              </div>
            </div>

            {/* Withdrawal Method Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Smartphone className="size-5 text-green-600" />
                Withdrawal Methods
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Building className="size-4 text-gray-500" />
                    <span className="text-sm">Bank Transfer</span>
                  </div>
                  <span className="text-xs text-green-600">Primary</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl opacity-50">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-gray-500" />
                    <span className="text-sm">Telebirr</span>
                  </div>
                  <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl opacity-50">
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-gray-500" />
                    <span className="text-sm">CBE Birr</span>
                  </div>
                  <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Payout Schedule */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Payout Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payout Frequency</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payout Day</span>
                  <span className="font-medium">15th of each month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Payout</span>
                  <span className="font-medium">ETB 500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time</span>
                  <span className="font-medium">3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Payout History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payoutHistory.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{new Date(payout.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{payout.event}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">ETB {payout.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(payout.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-gray-100 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-600">
            Need help with payouts? <Link to="/contact" className="text-green-600 font-medium hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
