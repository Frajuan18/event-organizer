import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ticket as TicketType, getUserTickets } from '../../services/ticketService';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, QrCode, Loader2, Ticket, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function MyTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadTickets();
  }, [user]);

  const loadTickets = async () => {
    if (!user) return;

    try {
      const data = await getUserTickets(user.uid);
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-[#2e8b57] mx-auto mb-4" />
          <p className="text-2xl font-black uppercase tracking-tight">Loading Tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
            My <span className="text-[#2e8b57]">Tickets</span>
          </h1>
          <div className="h-2 w-24 bg-[#2e8b57] mb-4"></div>
          <p className="text-zinc-600 text-lg font-medium">
            View and manage all your purchased tickets
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white border-4 border-black rounded-[3rem] p-16 text-center shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
            <div className="w-32 h-32 bg-[#2e8b57]/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[#2e8b57]">
              <Ticket className="h-16 w-16 text-[#2e8b57]" />
            </div>
            <p className="text-3xl font-black uppercase tracking-tight mb-4">No Tickets Yet</p>
            <p className="text-lg text-zinc-600 mb-8">You haven't purchased any tickets</p>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-black text-white hover:bg-[#2e8b57] border-4 border-black rounded-2xl py-6 px-12 text-xl font-black uppercase tracking-wider transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1"
            >
              Browse Events
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => {
              const eventDate = ticket.event ? new Date(ticket.event.date) : null;
              const isPastEvent = eventDate ? eventDate < new Date() : false;
              
              return (
                <div 
                  key={ticket.id} 
                  className="bg-white border-4 border-black rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)] transition-all"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      {/* Ticket Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                            {ticket.event?.title || 'Event Unavailable'}
                          </h3>
                          {ticket.checked_in ? (
                            <Badge className="bg-green-100 border-4 border-green-600 text-green-600 rounded-full px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Checked In
                            </Badge>
                          ) : isPastEvent ? (
                            <Badge className="bg-gray-100 border-4 border-gray-600 text-gray-600 rounded-full px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              <Clock className="h-3 w-3 mr-1" />
                              Event Ended
                            </Badge>
                          ) : (
                            <Badge className="bg-[#2e8b57]/10 border-4 border-[#2e8b57] text-[#2e8b57] rounded-full px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              Active
                            </Badge>
                          )}
                        </div>

                        {/* Ticket Details */}
                        {ticket.event && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center font-bold">
                              <Calendar className="h-5 w-5 mr-3 text-[#2e8b57] flex-shrink-0" />
                              <span>
                                {format(new Date(ticket.event.date), 'MMM dd, yyyy')} at {ticket.event.time}
                              </span>
                            </div>
                            <div className="flex items-center font-bold">
                              <MapPin className="h-5 w-5 mr-3 text-[#2e8b57] flex-shrink-0" />
                              <span className="truncate">{ticket.event.location}</span>
                            </div>
                          </div>
                        )}

                        {/* Ticket ID */}
                        <div className="inline-block bg-zinc-100 border-2 border-black rounded-xl px-4 py-2">
                          <span className="text-xs font-black uppercase tracking-wider text-zinc-500 mr-2">
                            Ticket ID:
                          </span>
                          <span className="font-mono font-bold text-sm">
                            {ticket.id.slice(0, 8)}...{ticket.id.slice(-4)}
                          </span>
                        </div>
                      </div>

                      {/* View QR Code Button */}
                      <div className="flex justify-center md:justify-end">
                        <Link to={`/ticket/${ticket.id}`}>
                          <Button 
                            className="bg-black text-white hover:bg-[#2e8b57] border-4 border-black rounded-2xl py-8 px-8 text-lg font-black uppercase tracking-wider transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1"
                          >
                            <QrCode className="h-6 w-6 mr-2" />
                            View QR Code
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Ticket Stub */}
                  <div className="border-t-4 border-dashed border-black bg-zinc-50 p-4">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-[#2e8b57]">✓ Valid Entry</span>
                      <span className="text-zinc-400">EventHub • {ticket.event?.date ? format(new Date(ticket.event.date), 'yyyy') : ''}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}