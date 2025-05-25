
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Send, User } from "lucide-react";
import { getComments, createComment } from "@/services/reportService";
import { useToast } from "@/hooks/use-toast";
import { Comment } from "@/types/schema";

interface CommentSectionProps {
  reportId: string;
  isAuthenticated: boolean;
}

const CommentSection = ({ reportId, isAuthenticated }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, [reportId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const commentsData = await getComments(reportId);
      setComments(commentsData);
    } catch (error: any) {
      toast({
        title: "Error loading comments",
        description: error.message || "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a comment",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createComment(reportId, newComment.trim());
      setNewComment("");
      await loadComments(); // Reload comments
      
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error posting comment",
        description: error.message || "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Comment input */}
        {isAuthenticated ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-1" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Sign in to post a comment</p>
        )}

        {/* Comments list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">{comment.username}</span>
                  <span className="text-xs text-gray-500">{comment.createdAt}</span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentSection;
