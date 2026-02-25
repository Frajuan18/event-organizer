import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Event, getEvent } from '../../services/eventService';
import { createOrder } from '../../services/ticketService';
import { simulatePayment } from '../../services/stripeService';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Calendar, MapPin, DollarSign, Users, Loader2, CheckCircle2, Ticket, Clock, User, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function EventDetails() {
  const { eventId } = useParams();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const data = await getEvent(eventId!);
      setEvent(data);
    } catch (error) {
      console.error('Error loading event:', error);
      toast.error('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please sign in to purchase tickets');
      navigate('/login');
      return;
    }

    if (!event) return;

    setPurchasing(true);

    try {
      // Simulate Stripe payment
      const paymentResult: any = await simulatePayment({
        eventId: event.id,
        eventTitle: event.title,
        price: event.price,
        quantity,
        userId: user.uid,
      });

      // Create order and tickets
      await createOrder({
        eventId: event.id,
        userId: user.uid,
        quantity,
        amount: event.price * quantity,
        stripeSessionId: paymentResult.sessionId,
      });

      setShowSuccess(true);
      toast.success('Tickets purchased successfully!');
      
      // Reload event to update tickets sold
      await loadEvent();
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      toast.error('Failed to purchase tickets');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-[#2e8b57] mx-auto mb-4" />
          <p className="text-2xl font-black uppercase tracking-tight">Loading Event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="bg-white border-4 border-black rounded-[3rem] p-12 text-center shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
          <Ticket className="h-24 w-24 text-[#2e8b57] mx-auto mb-6" />
          <p className="text-3xl font-black uppercase tracking-tight mb-4">Event Not Found</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-black text-white border-4 border-black rounded-2xl py-6 px-8 text-lg font-black uppercase tracking-wider hover:bg-[#2e8b57] hover:border-[#2e8b57] transition-colors"
          >
            Browse Events
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const availableTickets = event.capacity - event.tickets_sold;
  const totalPrice = event.price * quantity;
  const soldOut = availableTickets === 0;

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Image */}
        <div className="relative mb-8">
          <div className="aspect-[21/9] rounded-[3rem] border-4 border-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#2e8b57] to-black flex items-center justify-center">
                <Ticket className="h-32 w-32 text-white opacity-30" />
              </div>
            )}
          </div>
          
          {/* Category Badge */}
          {event.category && (
            <div className="absolute top-6 left-6">
              <Badge className="bg-white border-4 border-black text-black rounded-full px-6 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Tag className="h-4 w-4 mr-2 text-[#2e8b57]" />
                {event.category}
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Organizer */}
            <div className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
                {event.title}
              </h1>
              <div className="flex items-center text-lg">
                <User className="h-6 w-6 mr-3 text-[#2e8b57]" />
                <p className="font-bold">Organized by <span className="text-[#2e8b57]">{event.organizer_name}</span></p>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Calendar className="h-8 w-8 text-[#2e8b57] mb-4" />
                <h3 className="text-xl font-black uppercase mb-2">Date & Time</h3>
                <p className="font-bold text-lg">{format(eventDate, 'EEEE, MMMM dd, yyyy')}</p>
                <p className="text-zinc-600 font-medium flex items-center mt-2">
                  <Clock className="h-4 w-4 mr-2 text-[#2e8b57]" />
                  {event.time}
                </p>
              </div>

              <div className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <MapPin className="h-8 w-8 text-[#2e8b57] mb-4" />
                <h3 className="text-xl font-black uppercase mb-2">Location</h3>
                <p className="font-bold text-lg">{event.location}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase mb-6 flex items-center">
                <span className="bg-[#2e8b57] w-4 h-4 mr-3"></span>
                About This Event
              </h2>
              <p className="text-zinc-700 text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>

          {/* Purchase Card - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border-4 border-black rounded-[2rem] p-8 shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
              {/* Price */}
              <div className="text-center mb-8 pb-6 border-b-4 border-black">
                <p className="text-sm font-black uppercase tracking-wider text-zinc-500 mb-2">Price per ticket</p>
                <p className="text-5xl font-black">
                  {event.price === 0 ? (
                    <span className="text-[#2e8b57]">FREE</span>
                  ) : (
                    <>
                      <span className="text-3xl align-top">$</span>
                      {event.price.toFixed(2)}
                    </>
                  )}
                </p>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between mb-6 p-4 bg-zinc-50 border-2 border-black rounded-xl">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-[#2e8b57] mr-2" />
                  <span className="font-bold">Available</span>
                </div>
                <span className={`font-black text-lg ${soldOut ? 'text-red-600' : 'text-[#2e8b57]'}`}>
                  {soldOut ? 'SOLD OUT' : `${availableTickets} / ${event.capacity}`}
                </span>
              </div>

              {!soldOut ? (
                <>
                  {/* Quantity Selector */}
                  <div className="space-y-3 mb-6">
                    <Label htmlFor="quantity" className="text-lg font-black uppercase tracking-wider">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      max={Math.min(availableTickets, 10)}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="h-16 border-4 border-black rounded-2xl text-2xl font-bold text-center focus-visible:ring-0 focus-visible:border-[#2e8b57] transition-colors"
                    />
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Max 10 tickets per purchase
                    </p>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6 p-4 bg-black text-white rounded-xl">
                    <span className="font-black uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-black">
                      {event.price === 0 ? 'FREE' : `$${totalPrice.toFixed(2)}`}
                    </span>
                  </div>

                  {/* Purchase Button with Dialog */}
                  <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-[#2e8b57] text-white hover:bg-[#1e5d3a] border-4 border-black rounded-2xl py-8 text-xl font-black uppercase tracking-wider shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                        onClick={handlePurchase}
                        disabled={purchasing || !user}
                      >
                        {purchasing ? (
                          <>
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                            PROCESSING...
                          </>
                        ) : (
                          'BUY TICKETS'
                        )}
                      </Button>
                    </DialogTrigger>

                    {/* Success Dialog */}
                    <DialogContent className="bg-white border-4 border-black rounded-[2rem] p-0 max-w-md">
                      <div className="p-8 text-center">
                        <div className="w-24 h-24 bg-[#2e8b57]/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[#2e8b57]">
                          <CheckCircle2 className="h-12 w-12 text-[#2e8b57]" />
                        </div>
                        
                        <DialogHeader>
                          <DialogTitle className="text-3xl font-black uppercase tracking-tight mb-2">
                            Success!
                          </DialogTitle>
                          <DialogDescription className="text-lg font-medium">
                            Your tickets have been purchased
                          </DialogDescription>
                        </DialogHeader>

                        <div className="bg-zinc-50 border-4 border-black rounded-2xl p-6 my-6 space-y-3">
                          <p className="font-bold text-left">
                            <span className="text-zinc-500">Event:</span><br />
                            {event.title}
                          </p>
                          <p className="font-bold text-left">
                            <span className="text-zinc-500">Quantity:</span><br />
                            {quantity} {quantity === 1 ? 'ticket' : 'tickets'}
                          </p>
                          <p className="font-bold text-left">
                            <span className="text-zinc-500">Total:</span><br />
                            <span className="text-2xl text-[#2e8b57]">
                              ${totalPrice.toFixed(2)}
                            </span>
                          </p>
                        </div>

                        <Button 
                          className="w-full bg-black text-white hover:bg-[#2e8b57] border-4 border-black rounded-2xl py-6 text-lg font-black uppercase tracking-wider transition-colors"
                          onClick={() => navigate('/my-tickets')}
                        >
                          VIEW MY TICKETS
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {!user && (
                    <p className="text-sm font-bold text-center mt-4 p-3 bg-yellow-100 border-2 border-black rounded-xl">
                      Please sign in to purchase tickets
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-red-100 border-4 border-red-600 rounded-2xl p-6">
                    <p className="text-red-600 text-3xl font-black mb-2">SOLD OUT</p>
                    <p className="text-sm font-bold">No tickets available for this event</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}