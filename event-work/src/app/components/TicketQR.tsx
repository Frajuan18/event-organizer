import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket } from '../../services/ticketService';
import { format } from 'date-fns';
import { CheckCircle, Calendar, MapPin, Ticket as TicketIcon, Hash } from 'lucide-react';

interface TicketQRProps {
  ticket: Ticket;
}

export default function TicketQR({ ticket }: TicketQRProps) {
  const { event } = ticket;

  return (
    <div className="bg-white border-4 border-black rounded-[2rem] overflow-hidden max-w-md mx-auto shadow-[12px_12px_0px_0px_rgba(46,139,87,1)]">
      {/* Header */}
      <div className="bg-black p-4 border-b-4 border-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TicketIcon className="h-5 w-5 text-white" />
            <span className="text-white font-black uppercase tracking-tighter text-sm">
              EVENT TICKET
            </span>
          </div>
          {ticket.checked_in && (
            <div className="bg-green-600 px-3 py-1 rounded-xl border-2 border-white">
              <span className="text-white font-black uppercase text-xs flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                CHECKED IN
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Event Title */}
      <div className="p-6 text-center border-b-4 border-black bg-zinc-50">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-black">
          {event?.title || 'Event Ticket'}
        </h3>
      </div>

      {/* QR Code Section */}
      <div className="p-8 flex justify-center bg-white border-b-4 border-black">
        <div className="bg-white p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <QRCodeSVG
            value={ticket.qr_code}
            size={220}
            level="H"
            includeMargin={true}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Event Details */}
      {event && (
        <div className="p-6 bg-zinc-50 border-b-4 border-black">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#2e8b57]/10 p-2 rounded-xl border-2 border-black">
                <Calendar className="h-4 w-4 text-[#2e8b57]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Date & Time</p>
                <p className="font-bold text-black">
                  {format(new Date(event.date), 'MMMM dd, yyyy')} at {event.time}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-[#2e8b57]/10 p-2 rounded-xl border-2 border-black">
                <MapPin className="h-4 w-4 text-[#2e8b57]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Location</p>
                <p className="font-bold text-black">{event.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket IDs */}
      <div className="p-6 bg-white">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-2 border-black rounded-xl p-3 bg-zinc-50">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-[#2e8b57]" />
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Ticket ID</span>
            </div>
            <span className="font-mono font-bold text-sm">{ticket.id.slice(0, 8)}...{ticket.id.slice(-4)}</span>
          </div>
          
          <div className="flex items-center justify-between border-2 border-black rounded-xl p-3 bg-zinc-50">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-[#2e8b57]" />
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Order ID</span>
            </div>
            <span className="font-mono font-bold text-sm">{ticket.order_id.slice(0, 8)}...{ticket.order_id.slice(-4)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-4 border-dashed border-black bg-zinc-50 p-3 text-center">
        <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
          Present this QR code at the entrance
        </p>
      </div>
    </div>
  );
}