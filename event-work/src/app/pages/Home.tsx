// main/pages/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Ticket, 
  Calendar,
  MapPin,
  Users,
  Star,
  ChevronRight,
  Mail,
  Phone,
  Heart,
  Music,
  Globe,
  Award
} from 'lucide-react';

// Mock data for featured events
const featuredEvents = [
  {
    id: 1,
    title: "Summer Music Festival",
    date: "Aug 15-17, 2024",
    location: "Central Park, NY",
    category: "Music",
    price: "$49",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    attendees: 2500
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    date: "Sep 5-6, 2024",
    location: "Convention Center, SF",
    category: "Tech",
    price: "$199",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    attendees: 1200
  },
  {
    id: 3,
    title: "Art & Wine Evening",
    date: "Jul 28, 2024",
    location: "Downtown Gallery, LA",
    category: "Art",
    price: "$35",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
    attendees: 350
  },
  {
    id: 4,
    title: "Food Truck Festival",
    date: "Aug 3-5, 2024",
    location: "Waterfront Park, SD",
    category: "Food",
    price: "Free",
    image: "https://images.unsplash.com/photo-1565125711562-8d5f5b9b0b9a?w=400&h=300&fit=crop",
    attendees: 5000
  },
  {
    id: 5,
    title: "Wellness Retreat",
    date: "Sep 12-14, 2024",
    location: "Mountain Resort, CO",
    category: "Wellness",
    price: "$299",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
    attendees: 150
  },
  {
    id: 6,
    title: "Comedy Night",
    date: "Jul 20, 2024",
    location: "Laugh Factory, CHI",
    category: "Comedy",
    price: "$25",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=300&fit=crop",
    attendees: 200
  }
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Event Organizer",
    content: "This platform has transformed how I manage events. The ticketing system is seamless and my attendees love the experience.",
    avatar: "https://images.unsplash.com/photo-1494790108777-466d8531cef5?w=100&h=100&fit=crop",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Regular Attendee",
    content: "I've discovered so many amazing events through this app. The recommendations are spot-on and booking is super easy.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Concert Goer",
    content: "The best event discovery platform out there. Great selection of events and the interface is so intuitive.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5
  }
];

// Features data
const features = [
  {
    icon: <Calendar className="w-8 h-8 text-[#2e8b57]" />,
    title: "Easy Event Creation",
    description: "Create and publish events in minutes with our intuitive dashboard"
  },
  {
    icon: <Ticket className="w-8 h-8 text-[#2e8b57]" />,
    title: "Smart Ticketing",
    description: "Sell tickets online with secure payments and instant delivery"
  },
  {
    icon: <Users className="w-8 h-8 text-[#2e8b57]" />,
    title: "Attendee Management",
    description: "Track RSVPs, send updates, and engage with your audience"
  },
  {
    icon: <MapPin className="w-8 h-8 text-[#2e8b57]" />,
    title: "Location Based",
    description: "Discover events happening near you with our geo-location features"
  },
  {
    icon: <Star className="w-8 h-8 text-[#2e8b57]" />,
    title: "Reviews & Ratings",
    description: "Build trust with authentic reviews from past attendees"
  },
  {
    icon: <Heart className="w-8 h-8 text-[#2e8b57]" />,
    title: "Personalized Recommendations",
    description: "Get event suggestions tailored to your interests"
  }
];

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black font-['Fredoka']">
      {/* Hero Section - Mobile Optimized */}
      <section id="home" className="pt-16 sm:pt-20 px-4 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-4 border-black rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-16 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(46,139,87,1)] sm:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
            <div className="relative z-10 max-w-2xl">
              {/* Badge - Mobile optimized */}
              <div className="inline-flex items-center space-x-2 bg-[#2e8b57]/10 text-[#2e8b57] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 border-2 border-[#2e8b57]/20">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Live Your Best Life</span>
              </div>
              
              {/* Heading - Responsive text sizes */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6">
                Discover <span className="text-[#2e8b57]">Amazing</span> Events Near You.
              </h1>
              
              {/* Description - Mobile optimized */}
              <p className="text-base sm:text-lg md:text-xl text-zinc-600 font-medium max-w-md mb-6 sm:mb-8">
                The most curated selection of music, tech, and art events in the city.
              </p>
              
              {/* CTA Buttons - Stack on mobile, row on larger screens */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/events" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#2e8b57] text-white border-4 border-black rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-[#236b43] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 sm:hover:translate-x-1 sm:hover:translate-y-1">
                    Explore Events
                  </button>
                </Link>
                <Link to="/create-event" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white border-4 border-black rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-zinc-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 sm:hover:translate-x-1 sm:hover:translate-y-1">
                    Create Event
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Abstract Graphic - Hidden on mobile, visible on larger screens */}
            <div className="absolute top-10 right-10 hidden lg:block">
              <div className="w-48 lg:w-64 bg-[#2e8b57] rounded-[3rem] lg:rounded-[4rem] rotate-12 flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Ticket className="w-24 lg:w-32 h-24 lg:h-32 text-white -rotate-12" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section (shown only when logged in) */}
      {isLoggedIn && (
        <section className="px-4 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white border-4 border-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[#2e8b57]" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-zinc-50 border-2 border-black rounded-xl sm:rounded-2xl text-base sm:text-lg focus:outline-none focus:border-[#2e8b57] transition-colors"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <select className="h-12 sm:h-14 px-3 sm:px-4 bg-zinc-50 border-2 border-black rounded-xl sm:rounded-2xl text-sm sm:text-base focus:outline-none focus:border-[#2e8b57] font-bold">
                    <option>All</option>
                    <option>Music</option>
                    <option>Tech</option>
                    <option>Art</option>
                  </select>
                  
                  <button className="h-12 sm:h-14 px-6 bg-[#2e8b57] text-white border-2 border-black rounded-xl sm:rounded-2xl font-bold hover:bg-[#236b43] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Search
                  </button>
                </div>
              </div>

              {/* Quick Filters - Scrollable on mobile */}
              <div className="flex flex-wrap gap-2 mt-4 overflow-x-auto pb-2 sm:pb-0">
                <span className="text-xs sm:text-sm text-zinc-500 font-bold whitespace-nowrap">Popular:</span>
                <button className="px-2 sm:px-3 py-1 bg-zinc-100 border-2 border-black rounded-full text-xs sm:text-sm font-bold whitespace-nowrap hover:bg-[#2e8b57] hover:text-white transition-colors">
                  Today
                </button>
                <button className="px-2 sm:px-3 py-1 bg-zinc-100 border-2 border-black rounded-full text-xs sm:text-sm font-bold whitespace-nowrap hover:bg-[#2e8b57] hover:text-white transition-colors">
                  Weekend
                </button>
                <button className="px-2 sm:px-3 py-1 bg-zinc-100 border-2 border-black rounded-full text-xs sm:text-sm font-bold whitespace-nowrap hover:bg-[#2e8b57] hover:text-white transition-colors">
                  Free
                </button>
                <button className="px-2 sm:px-3 py-1 bg-zinc-100 border-2 border-black rounded-full text-xs sm:text-sm font-bold whitespace-nowrap hover:bg-[#2e8b57] hover:text-white transition-colors">
                  Near Me
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rest of the sections remain the same but with responsive padding */}
      
      {/* Features Section - with responsive padding */}
      <section id="features" className="py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#2e8b57]/10 text-[#2e8b57] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border-2 border-[#2e8b57]/20">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Why Choose Us</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">
              Everything you need to{' '}
              <span className="text-[#2e8b57]">manage events</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 max-w-2xl mx-auto px-4">
              Powerful features that make event planning and discovery effortless
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white border-4 border-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-[8px_8px_0px_0px_rgba(46,139,87,1)] sm:hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#2e8b57]/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border-2 border-[#2e8b57]/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-zinc-600 font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section - with responsive grid */}
      <section id="events" className="py-12 sm:py-20 px-4 bg-[#2e8b57]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#2e8b57]/10 text-[#2e8b57] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border-2 border-[#2e8b57]/20">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Don't Miss Out</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">
              Featured{' '}
              <span className="text-[#2e8b57]">Events</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 max-w-2xl mx-auto px-4">
              Hand-picked events you'll love
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {featuredEvents.map((event) => (
              <div 
                key={event.id}
                className="bg-white border-4 border-black rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(46,139,87,1)] sm:hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all hover:-translate-y-1 sm:hover:-translate-y-2 group cursor-pointer"
              >
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white border-2 border-black rounded-full px-2 sm:px-3 py-0.5 sm:py-1 font-bold text-xs sm:text-sm">
                    {event.category}
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 className="text-lg sm:text-xl font-black">{event.title}</h3>
                    <span className="text-[#2e8b57] font-black text-base sm:text-lg">{event.price}</span>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">{event.attendees} attending</span>
                    </div>
                  </div>

                  <Link to={`/event/${event.id}`}>
                    <button className="w-full py-2 sm:py-3 bg-[#2e8b57] text-white border-2 border-black rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:bg-[#236b43] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      Get Tickets
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link to="/events">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-4 border-black rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg hover:bg-zinc-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 sm:hover:translate-x-1 sm:hover:translate-y-1">
                View All Events
                <ChevronRight className="inline ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - responsive grid */}
      <section id="testimonials" className="py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#2e8b57]/10 text-[#2e8b57] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border-2 border-[#2e8b57]/20">
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Love Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">
              What our{' '}
              <span className="text-[#2e8b57]">community</span> says
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white border-4 border-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-[8px_8px_0px_0px_rgba(46,139,87,1)] sm:hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-black"
                  />
                  <div>
                    <h4 className="font-black text-base sm:text-lg">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-zinc-500 font-medium">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#2e8b57] text-[#2e8b57]" />
                  ))}
                </div>
                
                <p className="text-sm sm:text-base text-zinc-600 font-medium italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - responsive grid */}
      <section id="contact" className="py-12 sm:py-20 px-4 bg-[#2e8b57]/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Info */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#2e8b57]/10 text-[#2e8b57] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border-2 border-[#2e8b57]/20">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Get in Touch</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6">
                Let's{' '}
                <span className="text-[#2e8b57]">connect</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-zinc-600 mb-6 sm:mb-8">
                Have questions? We're here to help!
              </p>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-black rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#2e8b57]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-zinc-500 font-medium">Email</p>
                    <p className="text-sm sm:text-base font-bold">hello@eventhub.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-black rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#2e8b57]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-zinc-500 font-medium">Phone</p>
                    <p className="text-sm sm:text-base font-bold">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-black rounded-lg sm:rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#2e8b57]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-zinc-500 font-medium">Office</p>
                    <p className="text-sm sm:text-base font-bold">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - responsive */}
            <div className="bg-white border-4 border-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(46,139,87,1)] sm:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
              <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">Send us a message</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block font-bold mb-1 sm:mb-2 text-sm sm:text-base">Name</label>
                  <input 
                    type="text"
                    placeholder="Your name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-50 border-2 border-black rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#2e8b57]"
                  />
                </div>
                
                <div>
                  <label className="block font-bold mb-1 sm:mb-2 text-sm sm:text-base">Email</label>
                  <input 
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-50 border-2 border-black rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#2e8b57]"
                  />
                </div>
                
                <div>
                  <label className="block font-bold mb-1 sm:mb-2 text-sm sm:text-base">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="How can we help?"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-50 border-2 border-black rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#2e8b57]"
                  />
                </div>
                
                <button className="w-full py-3 sm:py-4 bg-[#2e8b57] text-white border-4 border-black rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-[#236b43] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 sm:hover:translate-x-1 sm:hover:translate-y-1">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - responsive */}
      <footer className="bg-black text-white py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2e8b57] rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-white">
                  <Ticket className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-black">EventHub</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-400">
                Your ultimate destination for discovering amazing events.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-black text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li><a href="#home" className="text-sm sm:text-base text-zinc-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="text-sm sm:text-base text-zinc-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#events" className="text-sm sm:text-base text-zinc-400 hover:text-white transition-colors">Events</a></li>
                <li><a href="#contact" className="text-sm sm:text-base text-zinc-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-black text-base sm:text-lg mb-3 sm:mb-4">Support</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li><a href="#" className="text-sm sm:text-base text-zinc-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm sm:text-base text-zinc-400 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-sm sm:text-base text-zinc-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-black text-base sm:text-lg mb-3 sm:mb-4">Stay Updated</h4>
              <p className="text-sm sm:text-base text-zinc-400 mb-3 sm:mb-4">Get the latest events straight to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-zinc-800 border-2 border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#2e8b57]"
                />
                <button className="px-4 py-2 bg-[#2e8b57] rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:bg-[#236b43] transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-zinc-400">
              © 2024 EventHub. All rights reserved.
            </p>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;