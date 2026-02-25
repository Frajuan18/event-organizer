// services/api.ts
import { supabaseUrl, publicAnonKey, isSupabaseConfigured } from '../../utils/supabase/info';

// The specific function name
const FUNCTION_NAME = 'make-server-ce88a73d';
const API_BASE_URL = `${supabaseUrl}/functions/v1/${FUNCTION_NAME}`;

console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔧 Supabase Configured:', isSupabaseConfigured());

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase not configured. Please check your .env.local file.');
    throw new Error('Supabase configuration missing. Please check your environment variables.');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🌐 API Request:', {
    url,
    method: options.method || 'GET',
    endpoint
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    // Try to parse response as JSON, fallback to text
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      
      const errorMessage = typeof data === 'string' 
        ? data 
        : data.error || data.message || `API request failed with status ${response.status}`;
      
      throw new Error(errorMessage);
    }

    console.log('✅ API Success Response:', data);
    return data;
  } catch (error) {
    console.error('❌ API Request Failed:', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export async function apiUpload(endpoint: string, formData: FormData) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase configuration missing. Please check your environment variables.');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('📤 API Upload:', { url, endpoint });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: formData,
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = typeof data === 'string' 
        ? data 
        : data.error || data.message || `Upload failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log('✅ Upload Success:', data);
    return data;
  } catch (error) {
    console.error('❌ Upload Failed:', error);
    throw error;
  }
}