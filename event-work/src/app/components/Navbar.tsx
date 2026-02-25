// main/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Ticket, LogOut, LayoutDashboard, Menu, X, ChevronDown, Settings, Home, Calendar, Star, Mail } from 'lucide-react';

// Button component
const Button = ({ children, variant, onClick, className, ...props }) => {
  const baseClasses = "px-4 py-2 font-bold rounded-xl transition-all duration-200";
  const variantClasses = variant === 'ghost' 
    ? 'bg-transparent hover:bg-zinc-100' 
    : 'bg-black text-white hover:bg-zinc-800';
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Mock Auth Context (replace with your actual auth context)
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const signOut = async () => {
    setUser(null);
    setUserProfile(null);
  };

  // For demo - uncomment to test logged-in state
  // useEffect(() => {
  //   setUser({ email: 'demo@example.com' });
  //   setUserProfile({ name: 'Demo User', role: 'user' });
  // }, []);

  return { user, userProfile, signOut };
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Events', path: '/events', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Features', path: '/#features', icon: <Star className="w-4 h-4" /> },
    { name: 'Contact', path: '/#contact', icon: <Mail className="w-4 h-4" /> }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Sign out error', err);
    }
  };

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path.includes('#')) return false; // Don't highlight hash links
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b-4 border-black font-['Fredoka']">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-black p-2 rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-3">
                  <Ticket className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-black">
                  event<span className="font-light opacity-40">hub</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all ${
                    isActivePath(link.path)
                      ? 'bg-black text-white'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={menuRef}>
                  {/* User Menu Trigger */}
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center space-x-3 p-1.5 pr-4 rounded-2xl border-2 transition-all duration-200 ${
                      userMenuOpen ? 'border-black bg-zinc-100' : 'border-transparent hover:bg-zinc-50 hover:border-zinc-200'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg border-2 border-black">
                      {(userProfile?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold leading-none text-black">
                        {userProfile?.name || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        {userProfile?.role || 'Member'}
                      </p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-black transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in duration-200">
                      <div className="p-5 border-b-2 border-zinc-100 bg-zinc-50/50">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Signed in as</p>
                        <p className="text-sm font-bold truncate mt-1 text-black">{user?.email || 'user@example.com'}</p>
                      </div>
                      
                      <div className="p-2">
                        {userProfile?.role === 'organizer' ? (
                          <button 
                            onClick={() => {
                              navigate('/organizer/dashboard');
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-black hover:text-white transition-colors group"
                          >
                            <LayoutDashboard className="h-5 w-5" />
                            <span className="font-bold">Organizer Dashboard</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              navigate('/my-tickets');
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-black hover:text-white transition-colors"
                          >
                            <Ticket className="h-5 w-5" />
                            <span className="font-bold">My Tickets</span>
                          </button>
                        )}
                        
                        <button 
                          onClick={() => {
                            navigate('/settings');
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-zinc-100 transition-colors"
                        >
                          <Settings className="h-5 w-5" />
                          <span className="font-bold text-zinc-600">Settings</span>
                        </button>

                        <div className="h-[2px] bg-zinc-100 my-2 mx-2" />

                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-5 w-5" />
                          <span className="font-bold">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/login')} 
                    className="font-bold text-black rounded-xl hover:bg-zinc-100 px-6"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/signup')} 
                    className="bg-black text-white rounded-xl px-8 py-6 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-zinc-800 transition-all active:translate-x-1 active:translate-y-1"
                  >
                    Join Now
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setMobileOpen(true)} 
                className="p-3 bg-black text-white rounded-2xl active:scale-95 transition-transform"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[60] lg:hidden font-['Fredoka'] ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setMobileOpen(false)} 
        />

        <aside className={`absolute top-4 right-4 bottom-4 w-[85%] max-w-sm bg-white rounded-[2.5rem] border-4 border-black transition-transform duration-500 ease-out transform ${mobileOpen ? 'translate-x-0' : 'translate-x-[110%]'}`}>
          <div className="flex items-center justify-between p-8 border-b-2 border-zinc-100">
            <span className="text-2xl font-bold tracking-tight">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 bg-zinc-100 rounded-full hover:rotate-90 transition-transform">
              <X className="h-6 w-6 text-black" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 w-full text-left p-4 text-xl font-bold rounded-2xl transition-all ${
                    isActivePath(link.path)
                      ? 'bg-black text-white'
                      : 'hover:bg-zinc-100 text-black'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile User Section */}
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-zinc-50 rounded-3xl border-2 border-black/5">
                  <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-xl">
                    {(userProfile?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-lg truncate text-black">{userProfile?.name || user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{userProfile?.role || 'Member'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      navigate(userProfile?.role === 'organizer' ? '/organizer/dashboard' : '/my-tickets');
                      setMobileOpen(false);
                    }} 
                    className="flex items-center space-x-3 w-full text-left p-4 text-xl font-bold rounded-2xl hover:bg-zinc-100 transition-all"
                  >
                    {userProfile?.role === 'organizer' ? <LayoutDashboard className="h-5 w-5" /> : <Ticket className="h-5 w-5" />}
                    <span>{userProfile?.role === 'organizer' ? 'Dashboard' : 'My Tickets'}</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      navigate('/settings');
                      setMobileOpen(false);
                    }} 
                    className="flex items-center space-x-3 w-full text-left p-4 text-xl font-bold rounded-2xl hover:bg-zinc-100 transition-all"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMobileOpen(false);
                    }} 
                    className="flex items-center space-x-3 w-full text-left p-4 text-xl font-bold text-red-500 rounded-2xl hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Button 
                  onClick={() => {
                    navigate('/login');
                    setMobileOpen(false);
                  }} 
                  className="w-full py-8 rounded-2xl border-4 border-black bg-white text-black font-bold text-xl hover:bg-zinc-50"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/signup');
                    setMobileOpen(false);
                  }} 
                  className="w-full py-8 rounded-2xl bg-black text-white font-bold text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}