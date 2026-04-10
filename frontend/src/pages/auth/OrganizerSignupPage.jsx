import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, User, Mail, Phone, Building, 
  AlertCircle, CheckCircle, Upload, X, Shield, Globe
} from 'lucide-react';

export function OrganizerSignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    organization_name: '',
    organization_type: '',
    website_url: '',
    bio: '',
    phone_number: '',
    tax_id_number: '',
    business_registration_number: ''
  });

  const organizationTypes = [
    { value: 'non_profit', label: 'Non-Profit Organization', icon: 'í´' },
    { value: 'corporate', label: 'Corporate / Business', icon: 'í¿¢' },
    { value: 'individual', label: 'Individual / Freelancer', icon: 'í±¤' },
    { value: 'government', label: 'Government Entity', icon: 'í¿›ï¸' }
  ];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
  };

  const validateStep1 = () => {
    if (!formData.full_name) {
      alert('Please enter your full name');
      return false;
    }
    if (!formData.email) {
      alert('Please enter your email address');
      return false;
    }
    if (!formData.password) {
      alert('Please enter a password');
      return false;
    }
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.organization_name) {
      alert('Please enter your organization name');
      return false;
    }
    if (!formData.organization_type) {
      alert('Please select organization type');
      return false;
    }
    if (!formData.bio) {
      alert('Please enter a brief description');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.phone_number) {
      alert('Please enter your phone number');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Application submitted successfully! Our team will review your application within 2-3 business days. You will be notified via email once approved.');
      navigate('/login');
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      {/* Ethiopian Tricolor Accent */}
      <div className="fixed top-16 left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl shadow-lg mb-4">
            <Building className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Organizer Sign Up</h1>
          <p className="text-gray-600">Create an organizer account to start hosting events</p>
        </div>

        {/* Progress Steps - Now only 3 steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Account', icon: User },
              { step: 2, label: 'Organization', icon: Building },
              { step: 3, label: 'Verification', icon: Shield }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step >= item.step 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > item.step ? (
                    <CheckCircle className="size-5" />
                  ) : (
                    <item.icon className="size-5" />
                  )}
                </div>
                <span className={`text-xs mt-2 ${step >= item.step ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                {item.step < 3 && (
                  <div className={`h-0.5 w-full mt-5 ${step > item.step ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          {/* Step 1: Account Credentials */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="size-5 text-green-600" />
                Account Credentials
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500" placeholder="Abebe Kebede" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl" placeholder="organizer@example.com" />
                </div>
                <p className="text-xs text-gray-500 mt-1">This will be your login email</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl pr-12" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <input type={showPassword ? 'text' : 'password'} name="confirm_password" value={formData.confirm_password} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
              </div>
            </div>
          )}

          {/* Step 2: Organization Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="size-5 text-green-600" />
                Organization Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input type="text" name="organization_name" value={formData.organization_name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl" placeholder="Ethiopian Coffee Festival" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type *</label>
                <select name="organization_type" value={formData.organization_type} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                  <option value="">Select organization type</option>
                  {organizationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Logo</label>
                {!logoPreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center">
                      <Upload className="size-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload logo</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                  </label>
                ) : (
                  <div className="relative inline-block">
                    <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-cover rounded-lg border" />
                    <button type="button" onClick={handleRemoveLogo} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                      <X className="size-3" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input type="url" name="website_url" value={formData.website_url} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl" placeholder="https://your-organization.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Bio / Description *</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="Tell us about your organization and the events you plan to host..." />
              </div>
            </div>
          )}

          {/* Step 3: Verification & Contact Information */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="size-5 text-green-600" />
                Verification & Contact
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl" placeholder="+251 911 234 567" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID / Business Registration Number</label>
                <input type="text" name="tax_id_number" value={formData.tax_id_number} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="123456789" />
                <p className="text-xs text-gray-500 mt-1">Optional but recommended for tax compliance</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Registration Number</label>
                <input type="text" name="business_registration_number" value={formData.business_registration_number} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="REG-12345-6789" />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">What happens next?</p>
                    <p className="text-blue-700 mt-1">
                      After submitting this application, our team will review your information within 2-3 business days.
                      Once approved, you'll receive an email with instructions to:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1">
                      <li>Access your organizer dashboard</li>
                      <li>Set up your payout information (bank details)</li>
                      <li>Start creating events</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Note</p>
                    <p className="text-yellow-700">Payout information will be collected after your account is approved.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-8 mt-6 border-t border-gray-200">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition">
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md">
                Continue
              </button>
            ) : (
              <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md disabled:opacity-50">
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an organizer account?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
