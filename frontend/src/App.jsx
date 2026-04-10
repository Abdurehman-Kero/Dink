import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingCartButton } from './components/common/FloatingCartButton';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { OrganizerSignupPage } from './pages/auth/OrganizerSignupPage';
import { DiscoveryPage } from './pages/discovery/DiscoveryPage';
import { EventDetailPage } from './pages/event/EventDetailPage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { SavedTicketsPage } from './pages/cart/SavedTicketsPage';
import { MyTicketsPage } from './pages/tickets/MyTicketsPage';
import { OrganizerDashboard } from './pages/organizer/OrganizerDashboard';
import { CreateEventPage } from './pages/organizer/CreateEventPage';
import { StaffManagementPage } from './pages/organizer/StaffManagementPage';
import { PayoutSettingsPage } from './pages/organizer/PayoutSettingsPage';
import { EventAnalyticsPage } from './pages/organizer/EventAnalyticsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminApprovalPage } from './pages/admin/AdminApprovalPage';
import { SecurityScannerPage } from './pages/security/SecurityScannerPage';
import { ProfilePage } from './pages/profile/ProfilePage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/organizer/signup" element={<OrganizerSignupPage />} />
          <Route path="/discover" element={<DiscoveryPage />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
          
          {/* User Routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/saved-tickets" element={<SavedTicketsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          
          {/* Organizer Routes */}
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/create-event" element={<CreateEventPage />} />
          <Route path="/staff/management" element={<StaffManagementPage />} />
          <Route path="/organizer/payouts" element={<PayoutSettingsPage />} />
          <Route path="/organizer/analytics/:eventId" element={<EventAnalyticsPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/approvals" element={<AdminApprovalPage />} />
          
          {/* Security Routes */}
          <Route path="/security/scanner" element={<SecurityScannerPage />} />
        </Routes>
      </main>
      <Footer />
      <FloatingCartButton />
    </div>
  );
}

export default App;
