
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MapPin, Clock } from "lucide-react";
import { voteOnReport } from "@/services/reportService";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  votes: { up: number; down: number };
  imageUrl?: string;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
}

interface ReportCardProps {
  report: Report;
  onVote: (reportId: string, voteType: 'up' | 'down') => void;
  isAuthenticated: boolean;
}

const ReportCard = ({ report, onVote, isAuthenticated }: ReportCardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();
  
  const isLikelyFalse = report.votes.down > report.votes.up;
  const totalVotes = report.votes.up + report.votes.down;

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Traffic": "bg-red-100 text-red-800 border-red-200",
      "Road Damage": "bg-orange-100 text-orange-800 border-orange-200",
      "Water Drainage": "bg-blue-100 text-blue-800 border-blue-200",
      "Fallen Tree": "bg-green-100 text-green-800 border-green-200",
      "Street Light Issue": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Under Maintenance": "bg-purple-100 text-purple-800 border-purple-200",
      "Garbage Dumping": "bg-gray-100 text-gray-800 border-gray-200",
      "Illegal Parking": "bg-pink-100 text-pink-800 border-pink-200",
      "Other": "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      onVote(report.id, voteType); // This will trigger the auth modal
      return;
    }
    
    if (isVoting) return;
    
    try {
      setIsVoting(true);
      await voteOnReport(report.id, voteType);
      onVote(report.id, voteType);
      
      toast({
        title: `Vote ${voteType === 'up' ? 'confirmed' : 'disputed'}`,
        description: `Your ${voteType === 'up' ? 'confirmation' : 'dispute'} has been recorded.`,
      });
    } catch (error: any) {
      toast({
        title: "Error submitting vote",
        description: error.message || "An error occurred while voting.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-white/20 overflow-hidden">
      {report.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={report.imageUrl} 
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isLikelyFalse && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="bg-red-500/90 text-white">
                Likely False
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {report.title}
          </h3>
          <Badge className={`${getCategoryColor(report.category)} border text-xs shrink-0`}>
            {report.category}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{report.location}</span>
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            <Clock className="h-4 w-4" />
            <span>{report.createdAt}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">{report.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={report.userVote === 'up' ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote('up')}
              disabled={!isAuthenticated || isVoting}
              className={`transition-all duration-300 ${
                report.userVote === 'up' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'hover:bg-green-50 hover:border-green-300 hover:text-green-700'
              }`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {report.votes.up}
            </Button>
            
            <Button
              variant={report.userVote === 'down' ? "destructive" : "outline"}
              size="sm"
              onClick={() => handleVote('down')}
              disabled={!isAuthenticated || isVoting}
              className={`transition-all duration-300 ${
                report.userVote === 'down' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'hover:bg-red-50 hover:border-red-300 hover:text-red-700'
              }`}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              {report.votes.down}
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
          </div>
        </div>

        {!isAuthenticated && (
          <p className="text-xs text-gray-500 italic">Sign in to vote on this report</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportCard;
