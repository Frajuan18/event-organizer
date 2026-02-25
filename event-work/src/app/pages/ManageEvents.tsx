import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrganizerSidebar from '../components/OrganizerSidebar';
import MobileSidebar from '../components/MobileSidebar';
import { Event, getOrganizerEvents, deleteEvent } from '../../services/eventService';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, DollarSign, Users, Trash2, Loader2, Menu, Plus, Eye, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export default function ManageEvents() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || userProfile?.role !== 'organizer') {
      navigate('/');
      return;
    }

    loadEvents();
  }, [user, userProfile]);

  const loadEvents = async () => {
    if (!user) return;

    try {
      const data = await getOrganizerEvents(user.uid);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f4f4]">
        <OrganizerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-[#2e8b57] mx-auto mb-4" />
            <p className="text-2xl font-black uppercase tracking-tight">Loading Events...</p>
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
            <h2 className="text-xl font-black uppercase tracking-tight">Manage Events</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/organizer/create-event')}
                className="p-2 bg-[#2e8b57] text-white border-4 border-black rounded-xl hover:bg-[#1e5d3a] transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setMobileOpen(true)} 
                className="p-2 border-4 border-black bg-white hover:bg-black hover:text-white transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block p-8 pb-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
                  Manage <span className="text-[#2e8b57]">Events</span>
                </h1>
                <div className="h-2 w-24 bg-[#2e8b57]"></div>
              </div>
              <Button 
                onClick={() => navigate('/organizer/create-event')}
                className="bg-[#2e8b57] text-white hover:bg-[#1e5d3a] border-4 border-black rounded-2xl py-6 px-8 text-lg font-black uppercase tracking-wider shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1 transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 pt-4">
          <div className="max-w-7xl mx-auto">
            {events.length === 0 ? (
              <div className="bg-white border-4 border-black rounded-[3rem] p-16 text-center shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
                <Ticket className="h-24 w-24 text-[#2e8b57] mx-auto mb-6" />
                <p className="text-3xl font-black uppercase tracking-tight mb-4">No Events Yet</p>
                <p className="text-lg text-zinc-600 mb-8">You haven't created any events</p>
                <Button 
                  onClick={() => navigate('/organizer/create-event')} 
                  className="bg-black text-white hover:bg-[#2e8b57] border-4 border-black rounded-2xl py-6 px-12 text-xl font-black uppercase tracking-wider transition-colors"
                >
                  Create Your First Event
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {events.map((event) => {
                  const soldPercentage = (event.tickets_sold / event.capacity) * 100;
                  const isSoldOut = event.tickets_sold >= event.capacity;
                  
                  return (
                    <div 
                      key={event.id} 
                      className="bg-white border-4 border-black rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-shadow"
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Event Image */}
                          <div className="w-full lg:w-56 h-40 bg-zinc-100 rounded-2xl border-4 border-black overflow-hidden flex-shrink-0">
                            {event.image_url ? (
                              <img 
                                src={event.image_url} 
                                alt={event.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2e8b57] to-black">
                                <Calendar className="h-16 w-16 text-white opacity-30" />
                              </div>
                            )}
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-2xl font-black uppercase tracking-tight">
                                {event.title}
                              </h3>
                              {event.category && (
                                <Badge className="bg-white border-4 border-black text-black rounded-full px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                  {event.category}
                                </Badge>
                              )}
                            </div>

                            <p className="text-zinc-600 mb-4 line-clamp-2 font-medium">
                              {event.description}
                            </p>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center font-bold">
                                <Calendar className="h-5 w-5 mr-3 text-[#2e8b57] flex-shrink-0" />
                                <span>{format(new Date(event.date), 'MMM dd, yyyy')} at {event.time}</span>
                              </div>
                              <div className="flex items-center font-bold">
                                <MapPin className="h-5 w-5 mr-3 text-[#2e8b57] flex-shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                              <div className="flex items-center font-bold">
                                <DollarSign className="h-5 w-5 mr-3 text-[#2e8b57] flex-shrink-0" />
                                <span>${event.price.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center font-bold">
                                <Users className="h-5 w-5 mr-3 text-[#2e8b57] flex-shrink-0" />
                                <span>{event.tickets_sold} / {event.capacity} sold</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-4 bg-zinc-100 border-4 border-black rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${isSoldOut ? 'bg-red-600' : 'bg-[#2e8b57]'} transition-all duration-500`}
                                style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex lg:flex-col gap-3 lg:w-32">
                            <Button 
                              variant="outline" 
                              onClick={() => navigate(`/event/${event.id}`)}
                              className="flex-1 lg:flex-none border-4 border-black rounded-2xl py-6 font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                            >
                              <Eye className="h-5 w-5 lg:mr-2" />
                              <span className="hidden lg:inline">View</span>
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="destructive" 
                                  className="flex-1 lg:flex-none bg-red-600 text-white hover:bg-red-700 border-4 border-black rounded-2xl py-6 font-black uppercase tracking-wider"
                                >
                                  <Trash2 className="h-5 w-5 lg:mr-2" />
                                  <span className="hidden lg:inline">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              
                              <AlertDialogContent className="bg-white border-4 border-black rounded-[2rem] p-0 max-w-md">
                                <div className="p-8">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-3xl font-black uppercase tracking-tight mb-4">
                                      Delete Event
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-lg font-medium text-zinc-600">
                                      Are you sure you want to delete <span className="font-black text-black">"{event.title}"</span>? 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
                                    <AlertDialogCancel className="flex-1 border-4 border-black rounded-2xl py-6 font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDelete(event.id)}
                                      className="flex-1 bg-red-600 text-white hover:bg-red-700 border-4 border-black rounded-2xl py-6 font-black uppercase tracking-wider"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}