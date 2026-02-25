# Event Marketplace & Ticketing Platform - Project Structure

## 🏗️ Architecture Overview

This is a full-stack event ticketing platform similar to Eventbrite, built with:
- **Frontend**: React (JSX) + Tailwind CSS
- **Authentication**: Firebase (Email + Google OAuth)
- **Database**: Supabase (PostgreSQL via KV Store)
- **Storage**: Supabase Storage (for event images)
- **Payments**: Stripe integration (simulated for demo)
- **QR Codes**: qrcode.react for generation, html5-qrcode for scanning

---

## 📁 Folder Structure

```
/src
├── /app
│   ├── /components
│   │   ├── Navbar.tsx                 # Main navigation
│   │   ├── EventCard.tsx              # Event display card
│   │   ├── StatsCard.tsx              # Statistics card
│   │   ├── TicketQR.tsx               # QR code display
│   │   ├── OrganizerSidebar.tsx       # Organizer navigation
│   │   └── /ui                        # Reusable UI components
│   ├── /pages
│   │   ├── Root.tsx                   # Layout wrapper with auth
│   │   ├── Home.tsx                   # Public event listing
│   │   ├── EventDetails.tsx           # Event details & purchase
│   │   ├── Login.tsx                  # Login page
│   │   ├── Signup.tsx                 # Signup page
│   │   ├── MyTickets.tsx              # User tickets list
│   │   ├── TicketView.tsx             # Single ticket QR view
│   │   ├── OrganizerDashboard.tsx     # Organizer stats dashboard
│   │   ├── CreateEvent.tsx            # Create event form
│   │   ├── ManageEvents.tsx           # Event management
│   │   ├── SalesOverview.tsx          # Sales analytics
│   │   ├── ScanTickets.tsx            # QR scanner for check-in
│   │   └── NotFound.tsx               # 404 page
│   ├── routes.tsx                     # React Router config
│   └── App.tsx                        # Main app entry
├── /context
│   └── AuthContext.tsx                # Firebase auth provider
├── /services
│   ├── api.ts                         # Base API client
│   ├── userService.ts                 # User profile API
│   ├── eventService.ts                # Event CRUD API
│   ├── ticketService.ts               # Ticket & order API
│   └── stripeService.ts               # Payment integration
├── /lib
│   └── firebase.ts                    # Firebase config
└── /styles                            # Global styles

/supabase/functions/server
└── index.tsx                          # Hono server with all endpoints
```

---

## 🗄️ Database Schema (KV Store)

### Users
```
key: user:{userId}
value: {
  id: string
  email: string
  name: string
  role: "attendee" | "organizer"
  created_at: string
}
```

### Events
```
key: event:{eventId}
value: {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  price: number
  capacity: number
  image_url?: string
  organizer_id: string
  organizer_name: string
  category?: string
  tickets_sold: number
  created_at: string
}
```

### Orders
```
key: order:{orderId}
value: {
  id: string
  event_id: string
  user_id: string
  quantity: number
  amount: number
  stripe_session_id: string
  created_at: string
}
```

### Tickets
```
key: ticket:{ticketId}
value: {
  id: string
  order_id: string
  event_id: string
  user_id: string
  qr_code: string (same as ticket id)
  checked_in: boolean
  check_in_status: boolean
  checked_in_at?: string
  created_at: string
}
```

### Supporting Keys
```
organizer:{organizerId}:events  → [eventId, ...]
user:{userId}:tickets           → [ticketId, ...]
```

---

## 🔐 Authentication Flow

1. **Firebase Auth** handles user authentication (Email/Password + Google OAuth)
2. On signup/sign-in, user profile is created/fetched from Supabase
3. AuthContext provides user state throughout the app
4. Protected routes check user role (attendee vs organizer)

---

## 🎫 Ticket Purchase Flow

1. User browses events on Home page
2. Clicks "View Details" → EventDetails page
3. Selects quantity and clicks "Buy Tickets"
4. (Demo) Simulated Stripe payment
5. Server creates Order + Tickets
6. QR code generated using ticket ID
7. User can view tickets in "My Tickets"

---

## 📲 QR Code System

### Generation
- QR codes generated using `qrcode.react`
- QR data = ticket ID (UUID)
- Displayed in TicketQR component

### Scanning
- Organizers use ScanTickets page
- Camera access via `html5-qrcode`
- Decoded ticket ID sent to server
- Server validates and marks as checked-in
- Visual feedback (green = valid, red = invalid/used)

---

## 📊 Organizer Features

### Dashboard
- Total events, tickets sold, revenue, attendees

### Create Event
- Form with image upload to Supabase Storage
- All event details (date, time, location, price, capacity)

### Manage Events
- List all organizer's events
- Delete events

### Sales Overview
- Revenue breakdown by event
- Tickets sold vs capacity
- Check-in statistics

### Scan Tickets
- Live camera QR scanning
- Manual ticket ID entry
- Real-time validation with visual feedback

---

## 🔌 API Endpoints

### Users
- `POST /users` - Create user profile
- `GET /users/:userId` - Get user profile

### Events
- `POST /events` - Create event
- `GET /events` - Get all events
- `GET /events/:eventId` - Get single event
- `GET /organizer/:organizerId/events` - Get organizer events
- `PUT /events/:eventId` - Update event
- `DELETE /events/:eventId` - Delete event
- `GET /events/:eventId/stats` - Get event statistics
- `GET /organizer/:organizerId/stats` - Get organizer statistics

### Orders & Tickets
- `POST /orders` - Create order and tickets
- `GET /users/:userId/tickets` - Get user tickets
- `GET /tickets/:ticketId` - Get single ticket
- `POST /tickets/:ticketId/checkin` - Check-in ticket

### Storage
- `POST /upload-image` - Upload event image

---

## 🎨 UI Components

Built with:
- Tailwind CSS for styling
- Radix UI primitives (shadcn/ui)
- Lucide React icons
- Responsive mobile-first design
- Clean SaaS aesthetic

---

## 🚀 Key Features Implemented

✅ Role-based authentication (Attendee/Organizer)  
✅ Event browsing with search and filters  
✅ Event creation with image upload  
✅ Ticket purchasing (simulated payment)  
✅ QR code generation for tickets  
✅ QR code scanning for check-in  
✅ Real-time ticket validation  
✅ Sales analytics and reporting  
✅ Event management (CRUD)  
✅ Responsive design  
✅ Protected routes  
✅ Toast notifications  
✅ Loading states  
✅ Error handling  

---

## 🔧 Environment Variables Needed

### Firebase (Frontend)
Add to `.env` or environment:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Stripe (Frontend)
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Note**: The STRIPE_SECRET_KEY would be set in Supabase environment variables for the server (not implemented in demo).

---

## 📝 Setup Instructions

### 1. Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Email/Password authentication
3. Enable Google OAuth provider
4. Copy your Firebase config and add to environment variables

### 2. Google OAuth Setup
1. In Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Follow setup instructions

### 3. Stripe Setup (Optional for production)
1. Create Stripe account
2. Get publishable key
3. Implement server-side checkout session creation
4. Set up webhooks for payment confirmation

### 4. Supabase
- Already connected and configured
- Storage bucket created automatically

---

## 🎯 Next Steps for Production

1. **Stripe Integration**
   - Implement real Stripe checkout
   - Set up webhook endpoint
   - Handle payment confirmations

2. **Email Notifications**
   - Send ticket confirmations
   - Event reminders
   - Organizer notifications

3. **Advanced Features**
   - Event categories and tags
   - Featured events
   - User reviews and ratings
   - Refund handling
   - Multiple ticket tiers
   - Promo codes

4. **Security**
   - Rate limiting
   - Input validation
   - XSS protection
   - CORS configuration

5. **Performance**
   - Image optimization
   - Caching
   - Pagination
   - Search indexing

---

## 📱 Mobile Considerations

- Responsive grid layouts
- Touch-friendly UI elements
- Camera access for QR scanning
- Mobile-optimized forms
- Drawer/sheet components for mobile navigation

---

## 🐛 Known Limitations

1. **Stripe**: Currently simulated - needs real integration
2. **Email**: No email service configured
3. **Search**: Basic string matching - no full-text search
4. **Pagination**: All data loaded at once
5. **Image Processing**: No compression or optimization
6. **Real-time Updates**: Requires manual refresh

---

This platform provides a solid foundation for an event ticketing marketplace with all core features functional and ready for enhancement!
