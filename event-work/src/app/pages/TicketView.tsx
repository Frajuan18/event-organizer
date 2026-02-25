import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ticket as TicketType, getTicket } from '../../services/ticketService';
import TicketQR from '../components/TicketQR';
import { Button } from '../components/ui/button';
import { ArrowLeft, Loader2, Ticket, Calendar, MapPin, CheckCircle, QrCode } from 'lucide-react';
import { format } from 'date-fns';

export default function TicketView() {
  const { ticketId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (ticketId) {
      loadTicket();
    }
  }, [ticketId, user]);

  const loadTicket = async () => {
    try {
      const data = await getTicket(ticketId!);
      setTicket(data);
    } catch (error) {
      console.error('Error loading ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-white border-4 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Loader2 className="h-12 w-12 animate-spin text-[#2e8b57]" />
          </div>
          <p className="text-2xl font-black uppercase tracking-tight">Loading Ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="bg-white border-4 border-black rounded-[3rem] p-12 text-center max-w-md shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
          <div className="w-24 h-24 bg-red-100 border-4 border-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Ticket className="h-12 w-12 text-red-600" />
          </div>
          <p className="text-3xl font-black uppercase tracking-tight mb-4">Ticket Not Found</p>
          <p className="text-zinc-600 font-medium mb-8">The ticket you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/my-tickets')}
            className="bg-black text-white hover:bg-[#2e8b57] border-4 border-black rounded-2xl py-6 px-8 text-lg font-black uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to My Tickets
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = ticket.event ? new Date(ticket.event.date) : null;
  const isCheckedIn = ticket.checked_in;

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/my-tickets')}
          className="mb-8 border-4 border-black rounded-2xl py-6 px-6 text-sm font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Tickets
        </Button>

        {/* Ticket Container */}
        <div className="bg-white border-4 border-black rounded-[3rem] overflow-hidden shadow-[16px_16px_0px_0px_rgba(46,139,87,1)]">
          {/* Ticket Header */}
          <div className="p-8 border-b-4 border-black bg-zinc-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#2e8b57] p-3 rounded-xl border-4 border-black">
                  <Ticket className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                    Your <span className="text-[#2e8b57]">Ticket</span>
                  </h1>
                  <p className="text-zinc-600 font-medium">Present this QR code at the entrance</p>
                </div>
              </div>
              {isCheckedIn && (
                <div className="bg-green-100 border-4 border-green-600 rounded-2xl px-6 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-black uppercase text-green-600">Checked In</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Content */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4">
                  <div className="bg-[#2e8b57]/5 p-4 rounded-2xl">
                    <TicketQR ticket={ticket} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-zinc-500">
                  <QrCode className="h-4 w-4 text-[#2e8b57]" />
                  <span>Scan at entrance</span>
                </div>
              </div>

              {/* Right Column - Ticket Details */}
              <div className="space-y-6">
                {/* Event Info Card */}
                {ticket.event && (
                  <>
                    <div className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-4 pb-2 border-b-4 border-black">
                        {ticket.event.title}
                      </h3>
                      
                      <div className="space-y-4">
                        {eventDate && (
                          <div className="flex items-center gap-3">
                            <div className="bg-[#2e8b57]/10 p-2 rounded-xl border-2 border-black">
                              <Calendar className="h-5 w-5 text-[#2e8b57]" />
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Date & Time</p>
                              <p className="font-bold">{format(eventDate, 'EEEE, MMMM dd, yyyy')} at {ticket.event.time}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="bg-[#2e8b57]/10 p-2 rounded-xl border-2 border-black">
                            <MapPin className="h-5 w-5 text-[#2e8b57]" />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Location</p>
                            <p className="font-bold">{ticket.event.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ticket ID Card */}
                    <div className="bg-black text-white border-4 border-black rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(46,139,87,1)]">
                      <p className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">Ticket ID</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono font-bold text-lg break-all">{ticket.id}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(ticket.id);
                            toast.success('Ticket ID copied to clipboard');
                          }}
                          className="bg-white text-black px-4 py-2 rounded-xl border-2 border-white font-black uppercase text-xs tracking-wider hover:bg-[#2e8b57] hover:text-white transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Purchase Info */}
                    <div className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Price Paid</p>
                          <p className="text-3xl font-black text-[#2e8b57]">
                            ${ticket.event.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Quantity</p>
                          <p className="text-2xl font-black">1</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Ticket Footer */}
          <div className="border-t-4 border-dashed border-black bg-zinc-50 p-6">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#2e8b57] rounded-full"></div>
                  <span>Valid Entry</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span>One-time use</span>
                </div>
              </div>
              <span className="text-zinc-400">EventHub • {eventDate ? format(eventDate, 'yyyy') : ''}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-4 border-black rounded-2xl p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-2xl mb-2">1️⃣</div>
            <p className="font-black uppercase text-xs tracking-wider">Show QR code at entrance</p>
          </div>
          <div className="bg-white border-4 border-black rounded-2xl p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-2xl mb-2">2️⃣</div>
            <p className="font-black uppercase text-xs tracking-wider">Staff will scan for validation</p>
          </div>
          <div className="bg-white border-4 border-black rounded-2xl p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-2xl mb-2">3️⃣</div>
            <p className="font-black uppercase text-xs tracking-wider">Enjoy the event!</p>
          </div>
        </div>
      </div>
    </div>
  );
}