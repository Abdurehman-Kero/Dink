import { Link } from "react-router-dom";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-100">
            <Sparkles className="size-4" />
            About DEMS
          </p>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Building Better Event Experiences in Ethiopia
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            DEMS is an event ticketing platform focused on helping organizers
            create, manage, and grow high-quality events while giving attendees
            a simple, secure way to discover and book unforgettable experiences.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="size-11 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
              <HeartHandshake className="size-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Our Mission
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Connect communities through events by making ticketing reliable,
              transparent, and organizer-friendly.
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="size-11 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Our Promise
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Secure payments, verified events, and a user experience that works
              smoothly on desktop and mobile.
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="size-11 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              What We Build
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Tools for organizers, attendees, admins, and staff to run events
              end-to-end from planning to check-in.
            </p>
          </article>
        </div>

        <div className="mt-12 rounded-2xl bg-gray-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Ready to explore events?</h3>
            <p className="text-gray-300 text-sm mt-1">
              Discover upcoming events and book your ticket in minutes.
            </p>
          </div>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100 transition"
          >
            Go to Discover
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
