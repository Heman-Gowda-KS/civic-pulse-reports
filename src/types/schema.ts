
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

// Define the report category type from the database enum
export type ReportCategory = Database['public']['Enums']['report_category'];

export type Report = {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  location: string;
  votes: { up: number; down: number };
  imageUrl?: string;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
};
