import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Initialize storage bucket on startup
const BUCKET_NAME = "make-ce88a73d-event-images";
try {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);
  if (!bucketExists) {
    await supabase.storage.createBucket(BUCKET_NAME, { public: false });
    console.log(`Created storage bucket: ${BUCKET_NAME}`);
  }
} catch (error) {
  console.error("Error initializing storage bucket:", error);
}

// Health check endpoint
app.get("/make-server-ce88a73d/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ USER PROFILE ENDPOINTS ============

// Create user profile (called after Firebase signup)
app.post("/make-server-ce88a73d/users", async (c) => {
  try {
    const { userId, email, name, role } = await c.req.json();
    
    const user = {
      id: userId,
      email,
      name,
      role: role || "attendee",
      created_at: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, user);
    
    return c.json({ success: true, user });
  } catch (error) {
    console.error("Error creating user profile:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get user profile
app.get("/make-server-ce88a73d/users/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }
    
    return c.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ EVENT ENDPOINTS ============

// Create event (organizer only)
app.post("/make-server-ce88a73d/events", async (c) => {
  try {
    const eventData = await c.req.json();
    const eventId = crypto.randomUUID();
    
    const event = {
      id: eventId,
      ...eventData,
      created_at: new Date().toISOString(),
      tickets_sold: 0,
    };

    await kv.set(`event:${eventId}`, event);
    
    // Add to organizer's events list
    const organizerEventsKey = `organizer:${eventData.organizer_id}:events`;
    const organizerEvents = (await kv.get(organizerEventsKey)) || [];
    organizerEvents.push(eventId);
    await kv.set(organizerEventsKey, organizerEvents);
    
    return c.json({ success: true, event });
  } catch (error) {
    console.error("Error creating event:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all events
app.get("/make-server-ce88a73d/events", async (c) => {
  try {
    const eventsData = await kv.getByPrefix("event:");
    const events = eventsData
      .map((item) => item.value)
      .sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    
    return c.json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single event
app.get("/make-server-ce88a73d/events/:eventId", async (c) => {
  try {
    const eventId = c.req.param("eventId");
    const event = await kv.get(`event:${eventId}`);
    
    if (!event) {
      return c.json({ success: false, error: "Event not found" }, 404);
    }
    
    return c.json({ success: true, event });
  } catch (error) {
    console.error("Error fetching event:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get organizer's events
app.get("/make-server-ce88a73d/organizer/:organizerId/events", async (c) => {
  try {
    const organizerId = c.req.param("organizerId");
    const eventIds = (await kv.get(`organizer:${organizerId}:events`)) || [];
    
    const events = await Promise.all(
      eventIds.map((id: string) => kv.get(`event:${id}`))
    );
    
    return c.json({ success: true, events: events.filter(Boolean) });
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update event
app.put("/make-server-ce88a73d/events/:eventId", async (c) => {
  try {
    const eventId = c.req.param("eventId");
    const updates = await c.req.json();
    
    const existingEvent = await kv.get(`event:${eventId}`);
    if (!existingEvent) {
      return c.json({ success: false, error: "Event not found" }, 404);
    }
    
    const updatedEvent = { ...existingEvent, ...updates };
    await kv.set(`event:${eventId}`, updatedEvent);
    
    return c.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete event
app.delete("/make-server-ce88a73d/events/:eventId", async (c) => {
  try {
    const eventId = c.req.param("eventId");
    const event = await kv.get(`event:${eventId}`);
    
    if (!event) {
      return c.json({ success: false, error: "Event not found" }, 404);
    }
    
    await kv.del(`event:${eventId}`);
    
    // Remove from organizer's events list
    if (event.organizer_id) {
      const organizerEventsKey = `organizer:${event.organizer_id}:events`;
      const organizerEvents = (await kv.get(organizerEventsKey)) || [];
      const filtered = organizerEvents.filter((id: string) => id !== eventId);
      await kv.set(organizerEventsKey, filtered);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ ORDER & TICKET ENDPOINTS ============

// Create order and ticket (after Stripe payment success)
app.post("/make-server-ce88a73d/orders", async (c) => {
  try {
    const { eventId, userId, quantity, amount, stripeSessionId } = await c.req.json();
    
    const orderId = crypto.randomUUID();
    const order = {
      id: orderId,
      event_id: eventId,
      user_id: userId,
      quantity,
      amount,
      stripe_session_id: stripeSessionId,
      created_at: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, order);
    
    // Create tickets for this order
    const tickets = [];
    for (let i = 0; i < quantity; i++) {
      const ticketId = crypto.randomUUID();
      const ticket = {
        id: ticketId,
        order_id: orderId,
        event_id: eventId,
        user_id: userId,
        qr_code: ticketId, // Using ticket ID as QR code data
        checked_in: false,
        check_in_status: false,
        created_at: new Date().toISOString(),
      };
      
      await kv.set(`ticket:${ticketId}`, ticket);
      tickets.push(ticket);
    }
    
    // Update event tickets_sold count
    const event = await kv.get(`event:${eventId}`);
    if (event) {
      event.tickets_sold = (event.tickets_sold || 0) + quantity;
      await kv.set(`event:${eventId}`, event);
    }
    
    // Add to user's tickets
    const userTicketsKey = `user:${userId}:tickets`;
    const userTickets = (await kv.get(userTicketsKey)) || [];
    userTickets.push(...tickets.map(t => t.id));
    await kv.set(userTicketsKey, userTickets);
    
    return c.json({ success: true, order, tickets });
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get user's tickets
app.get("/make-server-ce88a73d/users/:userId/tickets", async (c) => {
  try {
    const userId = c.req.param("userId");
    const ticketIds = (await kv.get(`user:${userId}:tickets`)) || [];
    
    const tickets = await Promise.all(
      ticketIds.map((id: string) => kv.get(`ticket:${id}`))
    );
    
    // Enrich with event data
    const enrichedTickets = await Promise.all(
      tickets.filter(Boolean).map(async (ticket: any) => {
        const event = await kv.get(`event:${ticket.event_id}`);
        return { ...ticket, event };
      })
    );
    
    return c.json({ success: true, tickets: enrichedTickets });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single ticket
app.get("/make-server-ce88a73d/tickets/:ticketId", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    const ticket = await kv.get(`ticket:${ticketId}`);
    
    if (!ticket) {
      return c.json({ success: false, error: "Ticket not found" }, 404);
    }
    
    const event = await kv.get(`event:${ticket.event_id}`);
    
    return c.json({ success: true, ticket: { ...ticket, event } });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Validate and check-in ticket (QR scan)
app.post("/make-server-ce88a73d/tickets/:ticketId/checkin", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    const ticket = await kv.get(`ticket:${ticketId}`);
    
    if (!ticket) {
      return c.json({ 
        success: false, 
        error: "Invalid ticket", 
        valid: false 
      }, 404);
    }
    
    if (ticket.checked_in || ticket.check_in_status) {
      return c.json({ 
        success: false, 
        error: "Ticket already used", 
        valid: false,
        ticket 
      }, 400);
    }
    
    // Mark ticket as checked in
    ticket.checked_in = true;
    ticket.check_in_status = true;
    ticket.checked_in_at = new Date().toISOString();
    await kv.set(`ticket:${ticketId}`, ticket);
    
    const event = await kv.get(`event:${ticket.event_id}`);
    
    return c.json({ 
      success: true, 
      valid: true, 
      ticket: { ...ticket, event },
      message: "Ticket validated successfully" 
    });
  } catch (error) {
    console.error("Error validating ticket:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get event statistics (for organizer dashboard)
app.get("/make-server-ce88a73d/events/:eventId/stats", async (c) => {
  try {
    const eventId = c.req.param("eventId");
    const event = await kv.get(`event:${eventId}`);
    
    if (!event) {
      return c.json({ success: false, error: "Event not found" }, 404);
    }
    
    // Get all tickets for this event
    const allTickets = await kv.getByPrefix("ticket:");
    const eventTickets = allTickets
      .map(item => item.value)
      .filter((ticket: any) => ticket.event_id === eventId);
    
    const totalTickets = eventTickets.length;
    const checkedInTickets = eventTickets.filter((t: any) => t.checked_in).length;
    const totalRevenue = totalTickets * (event.price || 0);
    
    return c.json({
      success: true,
      stats: {
        total_tickets_sold: totalTickets,
        total_revenue: totalRevenue,
        attendees_checked_in: checkedInTickets,
        event_name: event.title,
      },
    });
  } catch (error) {
    console.error("Error fetching event stats:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get organizer overall statistics
app.get("/make-server-ce88a73d/organizer/:organizerId/stats", async (c) => {
  try {
    const organizerId = c.req.param("organizerId");
    const eventIds = (await kv.get(`organizer:${organizerId}:events`)) || [];
    
    let totalTicketsSold = 0;
    let totalRevenue = 0;
    let totalAttendeesCheckedIn = 0;
    
    for (const eventId of eventIds) {
      const event = await kv.get(`event:${eventId}`);
      if (!event) continue;
      
      const allTickets = await kv.getByPrefix("ticket:");
      const eventTickets = allTickets
        .map(item => item.value)
        .filter((ticket: any) => ticket.event_id === eventId);
      
      const ticketCount = eventTickets.length;
      const checkedIn = eventTickets.filter((t: any) => t.checked_in).length;
      
      totalTicketsSold += ticketCount;
      totalRevenue += ticketCount * (event.price || 0);
      totalAttendeesCheckedIn += checkedIn;
    }
    
    return c.json({
      success: true,
      stats: {
        total_tickets_sold: totalTicketsSold,
        total_revenue: totalRevenue,
        total_attendees: totalAttendeesCheckedIn,
        total_events: eventIds.length,
      },
    });
  } catch (error) {
    console.error("Error fetching organizer stats:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ IMAGE UPLOAD ENDPOINT ============

app.post("/make-server-ce88a73d/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return c.json({ success: false, error: "No file provided" }, 400);
    }
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const fileBuffer = await file.arrayBuffer();
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });
    
    if (error) {
      console.error("Upload error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
    
    // Get signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000);
    
    return c.json({ 
      success: true, 
      url: signedUrlData?.signedUrl,
      path: fileName 
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Stripe webhook endpoint (for handling payment confirmations)
app.post("/make-server-ce88a73d/stripe-webhook", async (c) => {
  try {
    const payload = await c.req.json();
    
    // In production, verify the webhook signature here
    // For now, we'll handle the checkout.session.completed event
    
    if (payload.type === "checkout.session.completed") {
      const session = payload.data.object;
      
      // Create order and tickets
      // This would be triggered automatically by Stripe
      console.log("Payment successful:", session);
      
      return c.json({ received: true });
    }
    
    return c.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
