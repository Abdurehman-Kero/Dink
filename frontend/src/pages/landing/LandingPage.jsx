import { Link } from "react-router-dom";
import { 
  Calendar, Users, Shield, Sparkles, TrendingUp, 
  Award, Globe, Smartphone, CreditCard, Headphones,
  ArrowRight, Star, CheckCircle, Zap, BarChart3,
  Ticket, MapPin, Clock, ChevronRight, Play,
  Mail, Phone, Map, Coffee, Music, Mic, Palette
} from "lucide-react";
import { useState, useEffect } from "react";

export function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const featuredEvents = [
    {
      title: "Ethiopian Coffee Festival 2024",
      category: "Cultural",
      date: "Dec 15-17, 2024",
      location: "Addis Ababa",
      image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31",
      price: "250 ETB"
    },
    {
      title: "Addis International Jazz Fest",
      category: "Music",
      date: "Nov 20-22, 2024",
      location: "Addis Ababa",
      image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c",
      price: "350 ETB"
    },
    {
      title: "Gondar Traditional Dance",
      category: "Cultural",
      date: "Oct 10-12, 2024",
      location: "Gondar",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077",
      price: "150 ETB"
    }
  ];

  const testimonials = [
    {
      name: "Nahom Wondale",
      role: "Event Organizer",
      content:
        "DEMS has transformed how I manage my events. The platform is intuitive and the support team is amazing!",
      rating: 5,
      image: "https://i.imgur.com/ryO91vr.png",
    },
    {
      name: "Helen Mekonnen",
      role: "Attendee",
      content: "Finding and booking tickets has never been easier.",
      rating: 5,
      image:
        "https://plus.unsplash.com/premium_photo-1745624797642-4f522d5bcbfe?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Abdisa Waritu",
      role: "Event Organizer",
      content:
        "The analytics dashboard gives me real insights into my event performance.",
      rating: 5,
      image: "https://i.imgur.com/ndMwXNm.png",
    },
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers", icon: Users },
    { value: "1,000+", label: "Events Hosted", icon: Calendar },
    { value: "98%", label: "Satisfaction Rate", icon: Star },
    { value: "24/7", label: "Support", icon: Headphones }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Ethiopian tricolor accent */}
        <div className="absolute top-0 left-0 right-0 h-2 flex z-50">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-red-600" />
        </div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23fff' d='M10,10 L20,10 L15,20 Z'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="size-4 text-yellow-400" />
                <span className="text-sm font-medium">Ethiopia's #1 Event Platform</span>
              </div>

              <div className="mb-6">
                <div className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-red-400 bg-clip-text text-transparent animate-gradient">
                    DEMS
                  </span>
                </div>
                <div className="h-1 w-32 mx-auto mb-8 flex rounded-full overflow-hidden">
                  <div className="flex-1 bg-green-500" />
                  <div className="flex-1 bg-yellow-400" />
                  <div className="flex-1 bg-red-500" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Discover. Experience. <br />
                <span className="text-green-400">Connect.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Ethiopia's premier platform for discovering amazing events, booking tickets instantly, 
                and creating unforgettable experiences.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link
                  to="/discover"
                  className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Explore Events
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/organizer/signup"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center gap-2"
                >
                  Start Organizing
                  <Calendar className="size-5" />
                </Link>
              </div>

              {/* Stats Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <stat.icon className="size-8 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Events Carousel */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4">
              <TrendingUp className="size-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Featured Events</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Events Near You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most anticipated events happening across Ethiopia
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event, idx) => (
                <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="size-4 text-green-600" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="size-4 text-red-500" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">{event.price}</span>
                      <Link to="/discover" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                        Book Now <ChevronRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4">
              <Zap className="size-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Why Choose DEMS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features to make event management and ticket booking seamless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Ticket, title: "Easy Booking", description: "Book tickets in seconds with our streamlined checkout", color: "green" },
              { icon: Shield, title: "Secure Payments", description: "Protected by Chapa, Ethiopia's leading payment gateway", color: "blue" },
              { icon: Smartphone, title: "Digital Tickets", description: "QR code tickets for contactless entry", color: "purple" },
              { icon: BarChart3, title: "Analytics Dashboard", description: "Real-time insights into your event performance", color: "orange" }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="size-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4">
              <Play className="size-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How DEMS Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Discover", description: "Browse through hundreds of events happening near you", icon: MapPin },
              { step: "02", title: "Book", description: "Select your tickets and checkout securely", icon: CreditCard },
              { step: "03", title: "Experience", description: "Scan your QR code and enjoy the event", icon: Users }
            ].map((step, idx) => (
              <div key={idx} className="relative text-center">
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/3 left-full w-full h-0.5 bg-gradient-to-r from-green-500 to-green-300 -translate-y-1/2 z-0">
                    <div className="absolute right-0 top-1/2 w-3 h-3 bg-green-500 rounded-full -translate-y-1/2" />
                  </div>
                )}
                <div className="relative z-10 bg-white rounded-2xl p-8 shadow-lg">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <step.icon className="size-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4">
              <Star className="size-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of event organizers and attendees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-900 to-green-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-green-200">Events Hosted</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500,000+</div>
              <div className="text-green-200">Tickets Sold</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5,000+</div>
              <div className="text-green-200">Happy Organizers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-green-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <Sparkles className="size-4 text-yellow-400" />
            <span className="text-sm font-medium">Ready to Get Started?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Ethiopia's Premier Event Platform
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Whether you're looking to attend events or host your own, DEMS has you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/discover"
              className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              Start Exploring
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/organizer/signup"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Become an Organizer
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
