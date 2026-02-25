// routes.tsx - UPDATED
import { createBrowserRouter } from 'react-router-dom';
import Root from './pages/Root';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyTickets from './pages/MyTickets';
import TicketView from './pages/TicketView';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateEvent from './pages/CreateEvent';
import ManageEvents from './pages/ManageEvents';
import SalesOverview from './pages/SalesOverview';
import ScanTickets from './pages/ScanTickets';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'events/:eventId', Component: EventDetails }, // Changed from 'event/:eventId' to 'events/:eventId'
      { path: 'login', Component: Login },
      { path: 'signup', Component: Signup },
      
      // Protected routes
      {
        path: 'my-tickets',
        element: (
          <ProtectedRoute>
            <MyTickets />
          </ProtectedRoute>
        )
      },
      {
        path: 'ticket/:ticketId',
        element: (
          <ProtectedRoute>
            <TicketView />
          </ProtectedRoute>
        )
      },
      
      // Organizer routes
      {
        path: 'organizer/dashboard',
        element: (
          <ProtectedRoute requiredRole="organizer">
            <OrganizerDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'organizer/create-event',
        element: (
          <ProtectedRoute requiredRole="organizer">
            <CreateEvent />
          </ProtectedRoute>
        )
      },
      {
        path: 'organizer/manage-events',
        element: (
          <ProtectedRoute requiredRole="organizer">
            <ManageEvents />
          </ProtectedRoute>
        )
      },
      {
        path: 'organizer/sales',
        element: (
          <ProtectedRoute requiredRole="organizer">
            <SalesOverview />
          </ProtectedRoute>
        )
      },
      {
        path: 'organizer/scan',
        element: (
          <ProtectedRoute requiredRole="organizer">
            <ScanTickets />
          </ProtectedRoute>
        )
      },
      
      { path: '*', Component: NotFound },
    ],
  },
]);