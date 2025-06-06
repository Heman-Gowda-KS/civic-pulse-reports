
import { supabase } from '@/integrations/supabase/client';
import { Report, ReportCategory } from '@/types/schema';
import { Database } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';

// Type guard to validate votes data structure
function isValidVotesData(data: any): data is { up: number; down: number } {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.up === 'number' &&
    typeof data.down === 'number'
  );
}

export const getReports = async (category: ReportCategory | null = null) => {
  try {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Get session to determine if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    // Process and format the reports
    const reports: Report[] = await Promise.all(
      (data || []).map(async (report) => {
        // Get votes for this report
        const { data: votesData } = await supabase.rpc('get_report_votes', {
          report_id: report.id
        });
        
        // Use our type guard to ensure votes data is valid
        const votes = isValidVotesData(votesData) 
          ? votesData 
          : { up: 0, down: 0 };
        
        // Get user's vote for this report if authenticated
        let userVote = null;
        if (userId) {
          const { data: userVoteData } = await supabase.rpc('get_user_vote', { 
            p_report_id: report.id, 
            p_user_id: userId 
          });
          userVote = userVoteData as 'up' | 'down' | null;
        }
        
        return {
          id: report.id,
          title: report.title,
          description: report.description,
          category: report.category as ReportCategory,
          location: report.location,
          votes: votes,
          imageUrl: report.image_url,
          createdAt: new Date(report.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          userVote: userVote as 'up' | 'down' | null
        };
      })
    );
    
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const createReport = async (reportData: {
  title: string;
  description: string;
  category: ReportCategory;
  location: string;
  imageFile?: File;
}) => {
  try {
    const { title, description, category, location, imageFile } = reportData;
    
    // Get current user ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    let imageUrl: string | null = null;
    
    // If image exists, upload it to storage first
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('report_images')
        .upload(`public/${fileName}`, imageFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('report_images')
        .getPublicUrl(`public/${fileName}`);
      
      imageUrl = publicUrl;
    }
    
    // Insert the report
    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
        title,
        description,
        category,
        location,
        image_url: imageUrl
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

export const voteOnReport = async (reportId: string, voteType: 'up' | 'down') => {
  try {
    console.log('Starting vote operation:', { reportId, voteType });
    
    // Get current user ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    console.log('User authenticated:', userId);
    
    // Check if user has already voted on this report
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id, vote_type')
      .eq('user_id', userId)
      .eq('report_id', reportId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing vote:', checkError);
      throw checkError;
    }
    
    console.log('Existing vote:', existingVote);
    
    if (existingVote) {
      // User already voted - handle based on whether it's the same vote or not
      if (existingVote.vote_type === voteType) {
        // Remove vote if it's the same type (toggle off)
        console.log('Removing existing vote');
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);
          
        if (deleteError) {
          console.error('Error deleting vote:', deleteError);
          throw deleteError;
        }
      } else {
        // Update vote if it's a different type
        console.log('Updating existing vote');
        const { error: updateError } = await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);
          
        if (updateError) {
          console.error('Error updating vote:', updateError);
          throw updateError;
        }
      }
    } else {
      // Create new vote
      console.log('Creating new vote');
      const { error: insertError } = await supabase
        .from('votes')
        .insert([
          {
            user_id: userId,
            report_id: reportId,
            vote_type: voteType
          }
        ]);
        
      if (insertError) {
        console.error('Error inserting vote:', insertError);
        throw insertError;
      }
    }
    
    // Get updated vote counts
    console.log('Fetching updated vote counts');
    const { data: votesData } = await supabase.rpc('get_report_votes', {
      report_id: reportId
    });
    
    // Use our type guard here too
    const votes = isValidVotesData(votesData) 
      ? votesData 
      : { up: 0, down: 0 };
    
    // Get user's current vote after this operation
    const { data: userVoteData } = await supabase.rpc('get_user_vote', { 
      p_report_id: reportId, 
      p_user_id: userId 
    });
    
    console.log('Vote operation completed:', { votes, userVote: userVoteData });
    
    return {
      votes: votes,
      userVote: userVoteData as 'up' | 'down' | null
    };
  } catch (error) {
    console.error('Error voting on report:', error);
    throw error;
  }
};

export const getComments = async (reportId: string) => {
  try {
    // Use type assertion to work around missing comments table in types
    const { data, error } = await (supabase as any)
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles(username)
      `)
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map((comment: any) => ({
      id: comment.id,
      reportId: reportId,
      userId: comment.user_id,
      content: comment.content,
      createdAt: new Date(comment.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      username: comment.profiles?.username || 'Anonymous'
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (reportId: string, content: string) => {
  try {
    // Get current user ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Use type assertion to work around missing comments table in types
    const { data, error } = await (supabase as any)
      .from('comments')
      .insert({
        report_id: reportId,
        user_id: userId,
        content: content
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};
