import { apiRequest } from './api';

export interface Ticket {
  id: string;
  order_id: string;
  event_id: string;
  user_id: string;
  qr_code: string;
  checked_in: boolean;
  check_in_status: boolean;
  checked_in_at?: string;
  created_at: string;
  event?: any;
}

export interface CreateOrderParams {
  eventId: string;
  userId: string;
  quantity: number;
  amount: number;
  stripeSessionId: string;
}

export async function createOrder(params: CreateOrderParams) {
  const response = await apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  
  return { order: response.order, tickets: response.tickets };
}

export async function getUserTickets(userId: string): Promise<Ticket[]> {
  const response = await apiRequest(`/users/${userId}/tickets`);
  return response.tickets;
}

export async function getTicket(ticketId: string): Promise<Ticket> {
  const response = await apiRequest(`/tickets/${ticketId}`);
  return response.ticket;
}

export async function checkInTicket(ticketId: string) {
  const response = await apiRequest(`/tickets/${ticketId}/checkin`, {
    method: 'POST',
  });
  
  return response;
}
