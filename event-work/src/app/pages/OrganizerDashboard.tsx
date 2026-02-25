import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrganizerSidebar from '../components/OrganizerSidebar';
import MobileSidebar from '../components/MobileSidebar';
import StatsCard from '../components/StatsCard';
import { getOrganizerStats } from '../../services/eventService';
import { Ticket, DollarSign, Users, Calendar, Menu, TrendingUp, Plus, Eye, Sparkles } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function OrganizerDashboard() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (userProfile?.role !== 'organizer') {
      navigate('/');
      return;
    }

    loadStats();
  }, [user, userProfile]);

  const loadStats = async () => {
    if (!user) return;

    try {
      const data = await getOrganizerStats(user.uid);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f4f4]">
        <OrganizerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-[#2e8b57] mx-auto mb-4" />
            <p className="text-2xl font-black uppercase tracking-tight">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      <OrganizerSidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      
      <main className="flex-1">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-4 border-black p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight">Dashboard</h2>
            <button 
              onClick={() => setMobileOpen(true)} 
              className="p-2 border-4 border-black bg-white hover:bg-black hover:text-white transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#2e8b57] p-2 rounded-xl border-4 border-black">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
                  Sales <span className="text-[#2e8b57]">Report</span>
                </h1>
              </div>
              <div className="h-2 w-32 bg-[#2e8b57] mb-4"></div>
              <p className="text-zinc-600 text-lg font-medium">
                Track your event performance and manage your business
              </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatsCard
                title="Total Events"
                value={stats?.total_events || 0}
                icon={Calendar}
                className="bg-white border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all"
              />
              <StatsCard
                title="Tickets Sold"
                value={stats?.total_tickets_sold || 0}
                icon={Ticket}
                className="bg-white border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all"
              />
              <StatsCard
                title="Total Revenue"
                value={`$${(stats?.total_revenue || 0).toFixed(2)}`}
                icon={DollarSign}
                className="bg-white border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all"
              />
              <StatsCard
                title="Attendees"
                value={stats?.total_attendees || 0}
                icon={Users}
                subtitle="Checked in"
                className="bg-white border-4 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Overview Section */}
              <div className="lg:col-span-2 bg-white border-4 border-black rounded-[3rem] p-8 shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#2e8b57] p-2 rounded-xl border-2 border-black">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Overview</h3>
                </div>
                
                <p className="text-zinc-600 text-lg mb-8">
                  Manage your events, track sales, and scan tickets all in one place. Your dashboard gives you real-time insights into your event performance.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 border-4 border-black rounded-2xl p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Avg. Price</p>
                    <p className="text-2xl font-black text-[#2e8b57]">
                      ${stats?.average_ticket_price ? stats.average_ticket_price.toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="bg-zinc-50 border-4 border-black rounded-2xl p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Fill Rate</p>
                    <p className="text-2xl font-black text-[#2e8b57]">
                      {stats?.average_fill_rate ? Math.round(stats.average_fill_rate) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border-4 border-black rounded-[3rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-500 mb-6">
                  Quick Actions
                </h3>
                
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate('/organizer/create-event')}
                    className="w-full bg-[#2e8b57] text-white hover:bg-[#1e5d3a] border-4 border-black rounded-2xl py-8 text-lg font-black uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1 transition-all"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Event
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/organizer/manage-events')}
                    variant="outline"
                    className="w-full border-4 border-black rounded-2xl py-8 text-lg font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Manage Events
                  </Button>
                </div>

                {/* Recent Activity Preview */}
                <div className="mt-8 pt-6 border-t-4 border-black">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-4">
                    Quick Stats
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total Capacity</span>
                      <span className="font-black text-lg">{stats?.total_capacity || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Active Events</span>
                      <span className="font-black text-lg text-[#2e8b57]">{stats?.active_events || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Events Section (if available) */}
            {stats?.recent_events && stats.recent_events.length > 0 && (
              <div className="mt-10">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Recent Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.recent_events.slice(0, 3).map((event: any) => (
                    <div key={event.id} className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <h4 className="font-black uppercase tracking-tight mb-2">{event.title}</h4>
                      <p className="text-sm font-bold text-zinc-600 mb-4">
                        {event.tickets_sold} / {event.capacity} sold
                      </p>
                      <div className="w-full h-3 bg-zinc-100 border-2 border-black rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#2e8b57]"
                          style={{ width: `${(event.tickets_sold / event.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}