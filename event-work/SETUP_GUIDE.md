# 🚀 Setup Guide - Event Marketplace Platform

## Quick Start

Your Event Marketplace & Ticketing Platform is now fully built! Follow these steps to configure Firebase authentication and start using the application.

---

## ⚠️ Important Notice

**This platform is a proof-of-concept demonstration.** Figma Make is not designed for collecting personally identifiable information (PII) or handling real payment data in production. For a production-ready ticketing system:

- Use a dedicated hosting provider
- Implement proper data encryption
- Add compliance measures (GDPR, PCI-DSS)
- Use production Stripe accounts
- Set up proper email services
- Implement comprehensive security measures

---

## 🔥 Step 1: Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "EventHub")
4. Disable Google Analytics (optional)
5. Click "Create project"

### Get Firebase Configuration

1. In Firebase Console, click the gear icon → Project settings
2. Scroll to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register app with a nickname (e.g., "EventHub Web")
5. Copy the `firebaseConfig` object

### Add Firebase Config to Your App

The Firebase configuration should be added as environment variables. You'll need to provide these values:

```javascript
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

**Note**: Since you're using Figma Make, you may need to update the `/src/lib/firebase.ts` file directly with your configuration values.

---

## 🔐 Step 2: Enable Authentication

### Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Email/Password**
3. Enable the toggle
4. Click **Save**

### Enable Google Authentication

1. Still in **Sign-in method**, click on **Google**
2. Enable the toggle
3. Select a support email
4. Click **Save**

### Configure Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your app's domain (Figma Make will auto-configure this)
3. For local development, `localhost` is already authorized

---

## 💳 Step 3: Stripe Setup (Optional)

For the demo, payments are simulated. To enable real payments:

### Create Stripe Account

1. Sign up at [https://stripe.com](https://stripe.com)
2. Complete account verification

### Get API Keys

1. Go to Developers → API keys
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)

### Configure Stripe

Add to environment:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

**For Production**:
- Implement server-side checkout session creation
- Set up webhook endpoint at `/make-server-ce88a73d/stripe-webhook`
- Configure webhook signing secret
- Switch to live API keys

---

## 📊 Step 4: Test the Application

### Create Test Accounts

1. **As Attendee**:
   - Go to /signup
   - Select "Attend events"
   - Create account with email/password or Google

2. **As Organizer**:
   - Go to /signup
   - Select "Organize events"
   - Create account

### Test Flows

#### Organizer Flow:
1. Sign in as organizer
2. Navigate to Dashboard
3. Click "Create Event"
4. Fill out event form and upload image
5. View in "Manage Events"
6. Check "Sales Overview"

#### Attendee Flow:
1. Sign in as attendee
2. Browse events on home page
3. Click event → "Buy Tickets"
4. Complete purchase (simulated)
5. View "My Tickets"
6. Click ticket to view QR code

#### Check-in Flow:
1. Sign in as organizer
2. Go to "Scan Tickets"
3. Use camera to scan QR code OR enter ticket ID manually
4. See validation result (green = valid, red = invalid/used)

---

## 🗂️ Database Structure

The application uses Supabase's KV store with these key patterns:

```
user:{userId}                    → User profile
event:{eventId}                  → Event details
order:{orderId}                  → Order record
ticket:{ticketId}                → Ticket record
organizer:{organizerId}:events   → List of event IDs
user:{userId}:tickets            → List of ticket IDs
```

Storage:
- Bucket: `make-ce88a73d-event-images` (auto-created)
- Stores event images with signed URLs

---

## 🎨 UI Features

### Public Pages
- **Home**: Event listing with search and category filters
- **Event Details**: Full event info with ticket purchase
- **Login/Signup**: Firebase authentication with Google OAuth

### Attendee Pages
- **My Tickets**: List of purchased tickets
- **Ticket View**: QR code display for check-in

### Organizer Pages
- **Dashboard**: Statistics overview
- **Create Event**: Event creation form with image upload
- **Manage Events**: Event list with edit/delete
- **Sales Overview**: Revenue and ticket analytics
- **Scan Tickets**: QR scanner for event check-in

---

## 🔧 Troubleshooting

### Firebase Authentication Errors

**"auth/invalid-api-key"**
- Check that VITE_FIREBASE_API_KEY is correct
- Verify Firebase config in `/src/lib/firebase.ts`

**"auth/popup-closed-by-user"**
- User closed Google sign-in popup
- Normal behavior, no action needed

**"auth/unauthorized-domain"**
- Add your domain to Authorized domains in Firebase Console

### Image Upload Issues

**"Storage bucket error"**
- Check Supabase connection
- Verify bucket permissions (auto-created as private)

### QR Scanner Not Working

**Camera permission denied**
- Allow camera access in browser settings
- Try manual ticket ID entry as fallback

**QR not scanning**
- Ensure good lighting
- Hold camera steady
- Try manual entry if issues persist

---

## 📱 Mobile Testing

The platform is fully responsive. Test on:
- iOS Safari
- Android Chrome
- Various screen sizes

Key mobile features:
- Touch-friendly buttons
- Responsive grids
- Mobile-optimized forms
- Camera access for QR scanning

---

## 🚨 Security Reminders

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Firebase rules**: Set up proper Firestore/Storage security rules
4. **HTTPS only**: Always use HTTPS in production
5. **Validate inputs**: Server validates all user inputs
6. **Rate limiting**: Consider adding to prevent abuse

---

## 🎯 What's Working

✅ User registration and authentication  
✅ Email/Password and Google OAuth login  
✅ Event creation with image upload  
✅ Event browsing and search  
✅ Ticket purchasing (simulated payment)  
✅ QR code generation  
✅ QR code scanning and validation  
✅ Ticket check-in system  
✅ Sales analytics  
✅ Role-based access (Attendee/Organizer)  
✅ Responsive design  

---

## 📞 Support

For Firebase issues: [Firebase Documentation](https://firebase.google.com/docs)  
For Stripe issues: [Stripe Documentation](https://stripe.com/docs)  
For Supabase issues: [Supabase Documentation](https://supabase.com/docs)

---

## 🎊 You're All Set!

Your event ticketing platform is ready to use! Start by:

1. Setting up Firebase authentication (required)
2. Creating an organizer account
3. Creating your first event
4. Creating an attendee account
5. Purchasing a ticket
6. Testing the QR check-in flow

**Happy event organizing! 🎉**
