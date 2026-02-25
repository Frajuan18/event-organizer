// services/userService.ts
import { apiRequest } from './api';

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: 'attendee' | 'organizer';
  created_at: string;
}

export interface CreateUserProfileParams {
  userId: string;
  email: string;
  name: string;
  role: 'attendee' | 'organizer';
}

export async function createUserProfile(params: CreateUserProfileParams): Promise<UserProfile> {
  try {
    const response = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.user || response;
  } catch (error) {
    console.log('Failed to create profile in Supabase:', error);
    throw error; // Let AuthContext handle the fallback
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const response = await apiRequest(`/users/${userId}`);
    return response.user || response;
  } catch (error) {
    console.log('Failed to fetch profile from Supabase:', error);
    throw error; // Let AuthContext handle the fallback
  }
}