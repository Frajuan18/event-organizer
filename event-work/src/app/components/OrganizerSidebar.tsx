import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from './ui/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  QrCode,
  Ticket,
  Plus
} from 'lucide-react';

const navItems = [
  { path: '/organizer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/organizer/manage-events', label: 'Events', icon: Calendar },
  { path: '/organizer/sales', label: 'Sales', icon: DollarSign },
  { path: '/organizer/scan', label: 'Scan', icon: QrCode },
];

export default function OrganizerSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r-4 border-black min-h-screen shadow-[4px_0px_0px_0px_rgba(46,139,87,1)]">
      {/* Header */}
      <div className="p-6 border-b-4 border-black">
        <Link to="/organizer/dashboard" className="flex items-center gap-3 group">
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-black uppercase tracking-wider rounded-xl border-4 border-black transition-all',
                isActive 
                  ? 'bg-[#2e8b57] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                  : 'text-black hover:bg-zinc-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-lg border-4 border-black mr-3',
                isActive ? 'bg-white border-white' : 'bg-white border-black'
              )}>
                <Icon className={cn(
                  'h-4 w-4',
                  isActive ? 'text-[#2e8b57]' : 'text-black'
                )} />
              </div>
              <span className="flex-1">{item.label}</span>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="w-1.5 h-1.5 bg-white rounded-full border-2 border-black"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Create Event Button */}
      <div className="p-4 border-t-4 border-black">
        <Link
          to="/organizer/create-event"
          className="flex items-center justify-center gap-2 w-full bg-black text-white hover:bg-[#2e8b57] border-4 border-black rounded-xl py-3 px-4 text-sm font-black uppercase tracking-wider transition-colors shadow-[4px_4px_0px_0px_rgba(46,139,87,1)] hover:shadow-none active:translate-y-1 active:translate-x-1"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Link>
      </div>
    </aside>
  );
}