
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

// These would typically be environment variables
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-anon-key';

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Convert string dates to Date objects
export const parseDate = (dateString: string | null): Date => {
  return dateString ? new Date(dateString) : new Date();
};

// Format Date objects to strings for Supabase
export const formatDate = (date: Date): string => {
  return date.toISOString();
};
