import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from './ui/utils';
import {
  LayoutDashboard,
  Plus,
  Calendar,
  DollarSign,
  QrCode,
  X,
  Ticket,
} from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/organizer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/organizer/create-event', label: 'Create Event', icon: Plus },
  { path: '/organizer/manage-events', label: 'Manage Events', icon: Calendar },
  { path: '/organizer/sales', label: 'Sales Overview', icon: DollarSign },
  { path: '/organizer/scan', label: 'Scan Tickets', icon: QrCode },
];

export default function MobileSidebar({ open, onClose }: Props) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-80 bg-white border-r-4 border-black z-50 transform transition-transform duration-500 ease-in-out shadow-[8px_0px_0px_0px_rgba(46,139,87,1)]',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black">
          <Link to="/organizer/dashboard" onClick={onClose} className="flex items-center gap-3 group">
            <div className="bg-black p-1.5 rounded-sm transition-transform group-hover:rotate-12">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter text-black uppercase">
                Event<span className="text-[#2e8b57] font-light">Hub</span>
              </span>
              <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Organizer</p>
            </div>
          </Link>
          <button 
            onClick={onClose} 
            aria-label="Close menu" 
            className="p-2 border-4 border-black rounded-xl hover:bg-black hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center px-4 py-4 text-sm font-black uppercase tracking-wider rounded-2xl border-4 border-black transition-all',
                  isActive 
                    ? 'bg-[#2e8b57] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                    : 'text-black hover:bg-zinc-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                )}
              >
                <div className={cn(
                  'p-2 rounded-xl border-4 border-black mr-4',
                  isActive ? 'bg-white border-white' : 'bg-white border-black'
                )}>
                  <Icon className={cn(
                    'h-5 w-5',
                    isActive ? 'text-[#2e8b57]' : 'text-black'
                  )} />
                </div>
                <span className="flex-1">{item.label}</span>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full border-2 border-black"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t-4 border-black pt-6">
            <div className="bg-zinc-50 border-4 border-black rounded-2xl p-4">
              <p className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">
                EventHub Pro
              </p>
              <p className="text-sm font-black text-[#2e8b57]">
                Organizer Access
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}