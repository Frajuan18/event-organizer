# ⚡ Quick Start Checklist

## 🎯 Get Your Event Platform Running in 5 Minutes

### ✅ Step 1: Firebase Setup (Required)
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Create new project
- [ ] Get Firebase config (Project Settings → Your apps → Web)
- [ ] Update `/src/lib/firebase.ts` with your config OR set environment variables
- [ ] Enable Email/Password auth (Authentication → Sign-in method)
- [ ] Enable Google auth (Authentication → Sign-in method)

### ✅ Step 2: Test User Accounts
- [ ] Sign up as **Organizer** (to create events)
- [ ] Sign up as **Attendee** (to buy tickets)
- [ ] Test Google sign-in

### ✅ Step 3: Create Your First Event
- [ ] Log in as Organizer
- [ ] Go to Dashboard → Create Event
- [ ] Fill out form:
  - Title: "Sample Concert 2024"
  - Description: "Amazing live music event"
  - Date: Tomorrow
  - Time: 7:00 PM
  - Location: "123 Main St, Your City"
  - Price: 25.00 (or 0 for free)
  - Capacity: 100
  - Category: "Music"
- [ ] Upload an event image
- [ ] Click "Create Event"

### ✅ Step 4: Purchase a Ticket
- [ ] Log out and sign in as Attendee
- [ ] Browse events on home page
- [ ] Click on your event
- [ ] Select quantity (1-10)
- [ ] Click "Buy Tickets"
- [ ] Wait for success modal
- [ ] Go to "My Tickets"

### ✅ Step 5: Test QR Check-In
- [ ] Log in as Organizer
- [ ] Go to "Scan Tickets"
- [ ] Option A: Use camera scanner
  - [ ] Click "Start Camera"
  - [ ] Point at QR code (open ticket on another device)
- [ ] Option B: Manual entry
  - [ ] Copy ticket ID from "My Tickets" page
  - [ ] Paste into "Manual Entry" field
  - [ ] Click "Validate Ticket"
- [ ] See green success message ✅

---

## 🎉 You're Done!

Your platform is fully functional. Explore:
- Dashboard statistics
- Sales overview
- Event management
- Multiple ticket purchases

---

## 🔧 Optional: Stripe Setup

For real payments (not required for demo):
1. Create [Stripe account](https://stripe.com)
2. Get test publishable key
3. Add to environment: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
4. Implement server-side checkout (see PROJECT_STRUCTURE.md)

---

## 📚 Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **FEATURES.md** - Complete feature list
- **PROJECT_STRUCTURE.md** - Architecture and API docs

---

## 🐛 Common Issues

**Can't sign in?**
→ Check Firebase config in `/src/lib/firebase.ts`

**Image upload fails?**
→ Supabase storage bucket is auto-created, wait a moment and retry

**QR scanner not working?**
→ Grant camera permissions, or use manual entry

**Events not showing?**
→ Create an event first as an Organizer

---

## 💡 Tips

1. **Create multiple events** to test search and filters
2. **Try different categories** (Music, Sports, Conference, etc.)
3. **Test mobile** - the UI is fully responsive
4. **Check sales stats** after multiple ticket purchases
5. **Scan the same ticket twice** to see the "already used" error

---

## 🎊 What's Built

✅ Complete authentication (Email + Google)  
✅ Event creation with images  
✅ Ticket purchasing system  
✅ QR code generation & scanning  
✅ Sales analytics  
✅ Role-based access  
✅ Responsive design  
✅ Real-time validation  

---

**Ready to organize your first event? Let's go! 🚀**
