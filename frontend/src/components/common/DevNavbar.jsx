// This component appears only in development mode for testing
import { Link } from 'react-router-dom';

export function DevNavbar() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-gray-900 text-white p-3 rounded-xl shadow-xl">
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        <Link to="/" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Home</Link>
        <Link to="/discover" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Discover</Link>
        <Link to="/login" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Login</Link>
        <Link to="/signup" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Signup</Link>
        <Link to="/organizer/signup" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Org Signup</Link>
        <Link to="/saved-tickets" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Saved</Link>
        <Link to="/checkout" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Checkout</Link>
        <Link to="/my-tickets" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">My Tickets</Link>
        <Link to="/profile" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Profile</Link>
        <Link to="/organizer/dashboard" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Org Dashboard</Link>
        <Link to="/organizer/create-event" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Create Event</Link>
        <Link to="/staff/management" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Staff Mgmt</Link>
        <Link to="/organizer/payouts" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Payouts</Link>
        <Link to="/admin/dashboard" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Admin</Link>
        <Link to="/admin/approvals" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Approvals</Link>
        <Link to="/security/scanner" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Scanner</Link>
      </div>
      <div className="text-center text-gray-500 text-xs mt-2">
        Development Navigation Bar - Remove in production
      </div>
    </div>
  );
}
