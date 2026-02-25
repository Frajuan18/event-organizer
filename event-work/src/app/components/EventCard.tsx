import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Calendar, MapPin, DollarSign, Ticket } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: any;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isFree = event.price === 0;

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <div className="bg-white border-4 border-black rounded-[2rem] overflow-hidden transition-all hover:shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
        {/* Image Container */}
        <div className="relative aspect-video border-b-4 border-black overflow-hidden bg-zinc-100">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2e8b57] to-black">
              <Ticket className="h-16 w-16 text-white opacity-30" />
            </div>
          )}
          
          {/* Category Badge */}
          {event.category && (
            <Badge className="absolute top-4 left-4 bg-white border-4 border-black text-black rounded-full px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {event.category}
            </Badge>
          )}

          {/* Price Badge */}
          <div className={cn(
            "absolute top-4 right-4 border-4 border-black rounded-full px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
            isFree ? "bg-[#2e8b57] text-white" : "bg-white text-black"
          )}>
            {isFree ? 'FREE' : `$${event.price.toFixed(2)}`}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 line-clamp-2">
            {event.title}
          </h3>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#2e8b57]/10 p-2 rounded-xl border-2 border-black">
                <Calendar className="h-4 w-4 text-[#2e8b57]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Date & Time</p>
                <p className="font-bold text-sm">
                  {format(eventDate, 'MMM dd, yyyy')} • {event.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#2e8b57]/10 p-2 rounded-xl border-2 border-black">
                <MapPin className="h-4 w-4 text-[#2e8b57]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Location</p>
                <p className="font-bold text-sm truncate">{event.location}</p>
              </div>
            </div>

            {/* Organizer */}
            <div className="pt-3 mt-3 border-t-4 border-black">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500">
                  Organized by
                </span>
                <span className="font-bold text-sm text-[#2e8b57]">
                  {event.organizer_name}
                </span>
              </div>
            </div>
          </div>

          {/* Hover Indicator */}
          <div className="mt-4 flex justify-end">
            <div className="bg-black text-white px-4 py-2 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Add this cn utility at the top or import it
const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};