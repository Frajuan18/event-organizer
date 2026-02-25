// services/eventService.ts
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  capacity: number;
  category: string;
  image_url: string;
  organizer_id: string;
  organizer_name: string;
  tickets_sold: number;
  created_at: string;
}

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'Join us for a day of amazing music and fun!',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '14:00',
    location: 'Central Park, New York',
    price: 49.99,
    capacity: 1000,
    category: 'Music',
    image_url: '',
    organizer_id: 'organizer1',
    organizer_name: 'Event Co.',
    tickets_sold: 0,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    description: 'Latest trends in technology',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    time: '09:00',
    location: 'Convention Center, SF',
    price: 199.99,
    capacity: 500,
    category: 'Technology',
    image_url: '',
    organizer_id: 'organizer1',
    organizer_name: 'Tech Events Inc.',
    tickets_sold: 0,
    created_at: new Date().toISOString()
  }
];

export async function getAllEvents(): Promise<Event[]> {
  return mockEvents;
}

export async function getEvent(eventId: string): Promise<Event | null> {
  return mockEvents.find(e => e.id === eventId) || null;
}

export async function getOrganizerEvents(organizerId: string): Promise<Event[]> {
  return mockEvents.filter(e => e.organizer_id === organizerId);
}

export async function createEvent(eventData: any): Promise<Event> {
  const newEvent = {
    ...eventData,
    id: Math.random().toString(36).substr(2, 9),
    tickets_sold: 0,
    created_at: new Date().toISOString()
  };
  mockEvents.push(newEvent);
  return newEvent;
}

export async function deleteEvent(eventId: string): Promise<void> {
  const index = mockEvents.findIndex(e => e.id === eventId);
  if (index !== -1) mockEvents.splice(index, 1);
}

export async function getOrganizerStats(organizerId: string) {
  const events = await getOrganizerEvents(organizerId);
  return {
    total_events: events.length,
    total_tickets_sold: 0,
    total_revenue: 0,
    total_attendees: 0
  };
}

export async function getEventStats(eventId: string) {
  return {
    total_tickets_sold: 0,
    total_revenue: 0,
    attendees_checked_in: 0
  };
}

export async function uploadEventImage(file: File): Promise<string> {
  return URL.createObjectURL(file);
}