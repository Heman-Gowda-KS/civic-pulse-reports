
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Report = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  votes: { up: number; down: number };
  imageUrl?: string;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
};
