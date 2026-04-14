import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { FloatingCartButton } from "./components/common/FloatingCartButton";
import { useAuth } from "./contexts/AuthContext";

const lazyNamed = (factory, exportName) =>
  lazy(() => factory().then((module) => ({ default: module[exportName] })));

const LandingPage = lazyNamed(
  () => import("./pages/landing/LandingPage"),
  "LandingPage",
);
const StaffDashboard = lazyNamed(
  () => import("./pages/staff/StaffDashboard"),
  "StaffDashboard",
);
const LoginPage = lazyNamed(
  () => import("./pages/auth/LoginPage"),
  "LoginPage",
);
const SignupPage = lazyNamed(
  () => import("./pages/auth/SignupPage"),
  "SignupPage",
);
const OrganizerApprovals = lazyNamed(
  () => import("./pages/admin/OrganizerApprovals"),
  "OrganizerApprovals",
);
const PaymentSuccess = lazyNamed(
  () => import("./pages/PaymentSuccess"),
  "PaymentSuccess",
);
const OrganizerSignupPage = lazyNamed(
  () => import("./pages/auth/OrganizerSignupPage"),
  "OrganizerSignupPage",
);
const DiscoveryPage = lazyNamed(
  () => import("./pages/discovery/DiscoveryPage"),
  "DiscoveryPage",
);
const EventDetailPage = lazyNamed(
  () => import("./pages/event/EventDetailPage"),
  "EventDetailPage",
);
const CheckoutPage = lazyNamed(
  () => import("./pages/checkout/CheckoutPage"),
  "CheckoutPage",
);
const SavedTicketsPage = lazyNamed(
  () => import("./pages/cart/SavedTicketsPage"),
  "SavedTicketsPage",
);
const MyTicketsPage = lazyNamed(
  () => import("./pages/tickets/MyTicketsPage"),
  "MyTicketsPage",
);
const OrganizerDashboard = lazyNamed(
  () => import("./pages/organizer/OrganizerDashboard"),
  "OrganizerDashboard",
);
const CreateEventPage = lazyNamed(
  () => import("./pages/organizer/CreateEventPage"),
  "CreateEventPage",
);
const StaffManagementPage = lazyNamed(
  () => import("./pages/organizer/StaffManagementPage"),
  "StaffManagementPage",
);
const PayoutSettingsPage = lazyNamed(
  () => import("./pages/organizer/PayoutSettingsPage"),
  "PayoutSettingsPage",
);
const EventAnalyticsPage = lazyNamed(
  () => import("./pages/organizer/EventAnalyticsPage"),
  "EventAnalyticsPage",
);
const EventsAnalyticsOverview = lazyNamed(
  () => import("./pages/organizer/EventsAnalyticsOverview"),
  "EventsAnalyticsOverview",
);
const AdminDashboard = lazyNamed(
  () => import("./pages/admin/AdminDashboard"),
  "AdminDashboard",
);
const AdminApprovalPage = lazyNamed(
  () => import("./pages/admin/AdminApprovalPage"),
  "AdminApprovalPage",
);
const AdminEventsPage = lazyNamed(
  () => import("./pages/admin/AdminEventsPage"),
  "AdminEventsPage",
);
const SecurityScannerPage = lazyNamed(
  () => import("./pages/security/SecurityScannerPage"),
  "SecurityScannerPage",
);
const ProfilePage = lazyNamed(
  () => import("./pages/profile/ProfilePage"),
  "ProfilePage",
);
const AdminManagement = lazyNamed(
  () => import("./pages/admin/AdminManagement"),
  "AdminManagement",
);
const AboutPage = lazyNamed(
  () => import("./pages/about/AboutPage"),
  "AboutPage",
);
const FeaturesPage = lazyNamed(
  () => import("./pages/info/FeaturesPage"),
  "FeaturesPage",
);
const ContactPage = lazyNamed(
  () => import("./pages/info/ContactPage"),
  "ContactPage",
);
const HelpPage = lazyNamed(() => import("./pages/info/HelpPage"), "HelpPage");
const FaqPage = lazyNamed(() => import("./pages/info/FaqPage"), "FaqPage");
const SupportPage = lazyNamed(
  () => import("./pages/info/SupportPage"),
  "SupportPage",
);
const TermsPage = lazyNamed(
  () => import("./pages/info/TermsPage"),
  "TermsPage",
);
const PrivacyPage = lazyNamed(
  () => import("./pages/info/PrivacyPage"),
  "PrivacyPage",
);
const RefundPage = lazyNamed(
  () => import("./pages/info/RefundPage"),
  "RefundPage",
);

function RouteLoadingFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4">
      <div className="size-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoleRoute({ children, allowedRoleIds }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoleIds?.length && !allowedRoleIds.includes(user?.role_id)) {
    return <Navigate to="/discover" replace />;
  }

  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/organizer/signup" element={<OrganizerSignupPage />} />
            <Route path="/discover" element={<DiscoveryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/event/:eventId" element={<EventDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/saved-tickets" element={<SavedTicketsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
            <Route
              path="/organizer/dashboard"
              element={<OrganizerDashboard />}
            />
            <Route
              path="/organizer/create-event"
              element={<CreateEventPage />}
            />
            <Route path="/staff/management" element={<StaffManagementPage />} />
            <Route path="/organizer/payouts" element={<PayoutSettingsPage />} />
            <Route
              path="/organizer/events-analytics"
              element={<EventsAnalyticsOverview />}
            />
            <Route
              path="/organizer/events-analitics"
              element={<EventsAnalyticsOverview />}
            />
            <Route
              path="/organizer/analytics/:eventId"
              element={<EventAnalyticsPage />}
            />
            <Route
              path="/organizer/events-analytics/:eventId"
              element={<EventAnalyticsPage />}
            />
            <Route
              path="/organizer/events-analitics/:eventId"
              element={<EventAnalyticsPage />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/approvals" element={<AdminApprovalPage />} />
            <Route path="/admin/events" element={<AdminEventsPage />} />
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoleRoute allowedRoleIds={[1, 4, 5]}>
                  <StaffDashboard />
                </ProtectedRoleRoute>
              }
            />
            <Route path="/admin/users" element={<AdminManagement />} />
            <Route path="/admin/approvals" element={<OrganizerApprovals />} />
            <Route path="/payment/verify" element={<PaymentSuccess />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route
              path="/security/scanner"
              element={
                <ProtectedRoleRoute allowedRoleIds={[1, 4, 5]}>
                  <SecurityScannerPage />
                </ProtectedRoleRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <FloatingCartButton />
    </div>
  );
}

export default App;
