import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  Calendar,
  Ticket,
  Award,
  Globe,
  Shield,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto border-t border-gray-800 transition-colors">
      {/* Woven Pattern Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg">ዲ</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-2xl font-bold text-white">DEMS</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ethiopia's premier event ticketing platform. Discover
              unforgettable experiences, book tickets seamlessly, and create
              lasting memories.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1 text-xs text-green-400">
                <Shield className="size-3" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-yellow-400">
                <Award className="size-3" />
                <span>Verified Events</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Calendar className="size-4 text-green-400" />
              Platform
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/discover"
                  className="hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Discover Events
                </Link>
              </li>
              <li>
                <Link
                  to="/organizer/signup"
                  className="hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Create Event
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Ticket className="size-4 text-yellow-400" />
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-yellow-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="hover:text-yellow-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-yellow-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="hover:text-yellow-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Live Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Globe className="size-4 text-red-400" />
              Legal & Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/terms"
                  className="hover:text-red-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-red-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="hover:text-red-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Refund Policy
                </Link>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Mail className="size-3" />
                  <span>support@dems.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                  <Phone className="size-3" />
                  <span>+25982310974</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                  <MapPin className="size-3" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-6 border-t border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="text-white font-semibold mb-1">Stay Updated</h4>
              <p className="text-sm text-gray-400">
                Get the latest events and exclusive offers
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 text-center md:text-left">
            © {currentYear} DEMS Event Platform. All rights reserved. | Made
            with <Heart className="inline-block size-3 text-red-400 mx-1" /> in
            Ethiopia
          </p>

          {/* Social Links with Ethiopian Colors - Using SVG directly */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-300 group"
              aria-label="Facebook"
            >
              <svg
                className="size-4 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-yellow-500 hover:text-white transition-all duration-300 group"
              aria-label="X"
            >
              <svg
                className="size-4 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300 group"
              aria-label="Instagram"
            >
              <svg
                className="size-4 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 group"
              aria-label="LinkedIn"
            >
              <svg
                className="size-4 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Ethiopian Traditional Pattern Decorative Element */}
        <div className="mt-6 pt-4 text-center">
          <div className="inline-flex items-center gap-2 opacity-30">
            <div className="w-1 h-1 bg-green-500 rounded-full" />
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <div className="w-4 h-px bg-gray-600" />
            <div className="w-1 h-1 bg-green-500 rounded-full" />
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <div className="w-1 h-1 bg-red-500 rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}
