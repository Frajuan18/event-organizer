import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrganizerSidebar from '../components/OrganizerSidebar';
import MobileSidebar from '../components/MobileSidebar';
import { Event, getOrganizerEvents, getEventStats } from '../../services/eventService';
import { Badge } from '../components/ui/badge';
import { Loader2, DollarSign, Ticket, Users, Menu, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EventWithStats extends Event {
  stats?: {
    total_tickets_sold: number;
    total_revenue: number;
    attendees_checked_in: number;
  };
}

export default function SalesOverview() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || userProfile?.role !== 'organizer') {
      navigate('/');
      return;
    }

    loadEventsWithStats();
  }, [user, userProfile]);

  const loadEventsWithStats = async () => {
    if (!user) return;

    try {
      const eventsData = await getOrganizerEvents(user.uid);
      
      // Load stats for each event
      const eventsWithStats = await Promise.all(
        eventsData.map(async (event) => {
          try {
            const stats = await getEventStats(event.id);
            return { ...event, stats };
          } catch (error) {
            return event;
          }
        })
      );

      setEvents(eventsWithStats);
    } catch (error) {
      console.error('Error loading events with stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = events.reduce((sum, event) => sum + (event.stats?.total_revenue || 0), 0);
  const totalTickets = events.reduce((sum, event) => sum + (event.stats?.total_tickets_sold || 0), 0);
  const totalAttendees = events.reduce((sum, event) => sum + (event.stats?.attendees_checked_in || 0), 0);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f4f4]">
        <OrganizerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-[#2e8b57] mx-auto mb-4" />
            <p className="text-2xl font-black uppercase tracking-tight">Loading Sales Data...</p>
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
            <h2 className="text-xl font-black uppercase tracking-tight">Sales Overview</h2>
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
                  Sales <span className="text-[#2e8b57]">Overview</span>
                </h1>
              </div>
              <div className="h-2 w-32 bg-[#2e8b57] mb-4"></div>
              <p className="text-zinc-600 text-lg font-medium">
                Track your event performance and revenue metrics
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Total Revenue Card */}
              <div className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-black text-[#2e8b57]">
                      ${totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-[#2e8b57]/10 p-3 rounded-xl border-4 border-black">
                    <DollarSign className="h-6 w-6 text-[#2e8b57]" />
                  </div>
                </div>
                <div className="border-t-4 border-black pt-4">
                  <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                    From {events.length} {events.length === 1 ? 'event' : 'events'}
                  </p>
                </div>
              </div>

              {/* Total Tickets Sold Card */}
              <div className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">
                      Total Tickets Sold
                    </p>
                    <p className="text-3xl font-black text-[#2e8b57]">
                      {totalTickets}
                    </p>
                  </div>
                  <div className="bg-[#2e8b57]/10 p-3 rounded-xl border-4 border-black">
                    <Ticket className="h-6 w-6 text-[#2e8b57]" />
                  </div>
                </div>
                <div className="border-t-4 border-black pt-4">
                  <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                    Average ${(totalRevenue / (totalTickets || 1)).toFixed(2)} per ticket
                  </p>
                </div>
              </div>

              {/* Attendees Checked In Card */}
              <div className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">
                      Attendees Checked In
                    </p>
                    <p className="text-3xl font-black text-[#2e8b57]">
                      {totalAttendees}
                    </p>
                  </div>
                  <div className="bg-[#2e8b57]/10 p-3 rounded-xl border-4 border-black">
                    <Users className="h-6 w-6 text-[#2e8b57]" />
                  </div>
                </div>
                <div className="border-t-4 border-black pt-4">
                  <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                    {((totalAttendees / (totalTickets || 1)) * 100).toFixed(1)}% check-in rate
                  </p>
                </div>
              </div>
            </div>

            {/* Events Table Section */}
            <div className="bg-white border-4 border-black rounded-[3rem] overflow-hidden shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
              <div className="p-6 border-b-4 border-black bg-zinc-50">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-[#2e8b57]" />
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    Event Sales Breakdown
                  </h3>
                </div>
              </div>
              
              <div className="p-6">
                {events.length === 0 ? (
                  <div className="text-center py-16">
                    <Ticket className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
                    <p className="text-2xl font-black uppercase tracking-tight text-zinc-400 mb-2">
                      No Events Found
                    </p>
                    <p className="text-zinc-500 font-medium">
                      Create your first event to start tracking sales
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-4 border-black">
                          <th className="text-left py-4 px-2 font-black uppercase tracking-wider">Event</th>
                          <th className="text-left py-4 px-2 font-black uppercase tracking-wider">Date</th>
                          <th className="text-right py-4 px-2 font-black uppercase tracking-wider">Price</th>
                          <th className="text-right py-4 px-2 font-black uppercase tracking-wider">Tickets Sold</th>
                          <th className="text-right py-4 px-2 font-black uppercase tracking-wider">Revenue</th>
                          <th className="text-right py-4 px-2 font-black uppercase tracking-wider">Checked In</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => {
                          const soldPercentage = ((event.stats?.total_tickets_sold || 0) / event.capacity) * 100;
                          
                          return (
                            <tr 
                              key={event.id} 
                              className="border-b-2 border-black hover:bg-zinc-50 transition-colors cursor-pointer"
                              onClick={() => navigate(`/organizer/event/${event.id}/details`)}
                            >
                              <td className="py-4 px-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-black">{event.title}</span>
                                  {event.category && (
                                    <Badge className="bg-white border-4 border-black text-black rounded-full px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                      {event.category}
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-2 font-bold">
                                {format(new Date(event.date), 'MMM dd, yyyy')}
                              </td>
                              <td className="text-right py-4 px-2 font-bold">
                                ${event.price.toFixed(2)}
                              </td>
                              <td className="text-right py-4 px-2">
                                <div className="flex flex-col items-end">
                                  <span className="font-black">{event.stats?.total_tickets_sold || 0} / {event.capacity}</span>
                                  <div className="w-24 h-2 bg-zinc-100 border-2 border-black rounded-full mt-1 overflow-hidden">
                                    <div 
                                      className="h-full bg-[#2e8b57]"
                                      style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="text-right py-4 px-2 font-black text-[#2e8b57]">
                                ${(event.stats?.total_revenue || 0).toFixed(2)}
                              </td>
                              <td className="text-right py-4 px-2 font-bold">
                                {event.stats?.attendees_checked_in || 0}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      
                      {/* Table Footer with Totals */}
                      <tfoot className="border-t-4 border-black bg-zinc-50">
                        <tr>
                          <td colSpan={3} className="py-4 px-2 font-black uppercase">
                            Totals
                          </td>
                          <td className="text-right py-4 px-2 font-black">
                            {totalTickets}
                          </td>
                          <td className="text-right py-4 px-2 font-black text-[#2e8b57]">
                            ${totalRevenue.toFixed(2)}
                          </td>
                          <td className="text-right py-4 px-2 font-black">
                            {totalAttendees}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}