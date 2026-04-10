import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/discover';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      // Get user from localStorage
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : result.user;
      
      console.log('User role_id:', user?.role_id);
      console.log('User email:', user?.email);
      
      // role_id: 1 = admin, 2 = organizer, 3 = attendee, 4 = staff, 5 = security
      if (user?.role_id === 1) {
        // Admin - redirect to admin dashboard
        navigate('/admin/dashboard');
      } else if (user?.role_id === 2) {
        // Organizer - redirect to organizer dashboard
        navigate('/organizer/dashboard');
      } else if (user?.role_id === 4 || user?.role_id === 5) {
        // Staff or Security - redirect to staff dashboard
        navigate('/staff/dashboard');
      } else {
        // Attendee or others - redirect to discover page
        navigate(from);
      }
    } else {
      setError(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Ethiopian Tricolor Accent */}
        <div className="fixed top-0 left-0 right-0 h-1 flex z-50">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-red-600" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">ዲ</span>
                </div>
              </div>
            </div>
            <div className="h-1 w-24 mx-auto mb-6 flex rounded-full overflow-hidden">
              <div className="flex-1 bg-green-500" />
              <div className="flex-1 bg-yellow-400" />
              <div className="flex-1 bg-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your DEMS account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="size-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="size-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Are you an organizer?{' '}
              <Link to="/organizer/signup" className="text-gray-900 font-semibold hover:text-green-600 hover:underline">
                Create organizer account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
