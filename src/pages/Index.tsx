import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AuthModal from "@/components/auth/AuthModal";
import Navigation from "@/components/layout/Navigation";
import ReportForm from "@/components/reports/ReportForm";
import ReportCard from "@/components/reports/ReportCard";
import CategoryFilter from "@/components/filters/CategoryFilter";
import { Plus, MapPin, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getReports, voteOnReport } from "@/services/reportService";
import { Report, ReportCategory } from "@/types/schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ['reports', selectedCategory],
    queryFn: () => getReports(selectedCategory),
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading reports",
        description: "Failed to load the latest reports. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Modified to use proper typed category handler
  const handleCategoryChange = (category: string | null) => {
    // Validate that the category is one of our allowed types or null
    if (category === null || isCategoryValid(category)) {
      setSelectedCategory(category as ReportCategory | null);
    } else {
      console.error("Invalid category selected:", category);
      toast({
        title: "Invalid category",
        description: "The selected category is not valid.",
        variant: "destructive",
      });
    }
  };

  // Helper function to validate category
  const isCategoryValid = (category: string): category is ReportCategory => {
    return [
      "Traffic", "Road Damage", "Water Drainage", "Fallen Tree", 
      "Street Light Issue", "Under Maintenance", "Garbage Dumping", 
      "Illegal Parking", "Other"
    ].includes(category);
  };

  const handleVote = async (reportId: string, voteType: 'up' | 'down') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      console.log('Index: Handling vote for report', reportId, 'with type', voteType);
      
      // The voting is already handled in ReportCard, we just need to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['reports'] });
      
      console.log('Index: Vote completed, data refreshed');
    } catch (error: any) {
      console.error('Index: Vote error', error);
      toast({
        title: "Error recording vote",
        description: error.message || "An error occurred while recording your vote.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation 
        isAuthenticated={!!user}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={async () => {
          const { signOut } = await import('@/services/authService');
          await signOut();
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 animate-fade-in">
            Report. Vote. Improve.
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in max-w-2xl mx-auto">
            Help build a better community by reporting local issues and verifying reports from fellow citizens.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              onClick={() => user ? setShowReportForm(true) : setShowAuthModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-5 w-5" />
              Report an Issue
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-blue-200 hover:border-blue-300 px-8 py-3 rounded-full transition-all duration-300 hover:bg-blue-50"
              onClick={() => window.scrollTo({ 
                top: document.getElementById('reports-section')?.offsetTop - 100, 
                behavior: 'smooth' 
              })}
            >
              <MapPin className="mr-2 h-5 w-5" />
              View Reports
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{reports.length}</h3>
                <p className="text-gray-600">Issues Reported</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {reports.filter(report => report.votes.up > report.votes.down).length}
                </h3>
                <p className="text-gray-600">Confirmed Reports</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{user ? "1" : "0"}</h3>
                <p className="text-gray-600">Active Citizens</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section id="reports-section" className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Reports</h2>
              <p className="text-gray-600">Help verify these community reports</p>
            </div>
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report, index) => (
                <div 
                  key={report.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <ReportCard 
                    report={report}
                    onVote={handleVote}
                    isAuthenticated={!!user}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white/50 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No reports yet</h3>
              <p className="text-gray-600 mb-6">Be the first to report an issue in your community!</p>
              <Button
                onClick={() => user ? setShowReportForm(true) : setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Report
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          toast({
            title: "Welcome!",
            description: "You're now logged in and can start reporting issues.",
          });
        }}
      />

      <ReportForm 
        isOpen={showReportForm}
        onClose={() => setShowReportForm(false)}
        onSuccess={() => {
          setShowReportForm(false);
          queryClient.invalidateQueries({ queryKey: ['reports'] });
          toast({
            title: "Report submitted!",
            description: "Thank you for helping improve our community.",
          });
        }}
      />
    </div>
  );
};

export default Index;
