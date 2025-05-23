
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthModal from "@/components/auth/AuthModal";
import Navigation from "@/components/layout/Navigation";
import ReportForm from "@/components/reports/ReportForm";
import ReportCard from "@/components/reports/ReportCard";
import CategoryFilter from "@/components/filters/CategoryFilter";
import { Plus, MapPin, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockReports = [
    {
      id: 1,
      title: "Pothole on Main Street",
      description: "Large pothole causing traffic issues near the intersection of Main and Oak Street. Multiple cars have been damaged.",
      category: "Road Damage",
      location: "Main Street & Oak Street",
      votes: { up: 15, down: 2 },
      imageUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop",
      createdAt: "2 hours ago",
      userVote: null
    },
    {
      id: 2,
      title: "Broken Street Light",
      description: "Street light has been out for over a week, creating safety concerns for pedestrians.",
      category: "Street Light Issue",
      location: "Pine Avenue near Park",
      votes: { up: 8, down: 1 },
      imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop",
      createdAt: "1 day ago",
      userVote: null
    },
    {
      id: 3,
      title: "Fallen Tree Blocking Path",
      description: "Tree fell during last storm and is blocking the walking path in Central Park.",
      category: "Fallen Tree",
      location: "Central Park Walking Trail",
      votes: { up: 23, down: 0 },
      imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop",
      createdAt: "3 days ago",
      userVote: "up"
    }
  ];

  const handleVote = (reportId: number, voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    toast({
      title: "Vote recorded",
      description: `Your ${voteType === 'up' ? 'confirmation' : 'dispute'} has been recorded.`,
    });
  };

  const filteredReports = selectedCategory 
    ? mockReports.filter(report => report.category === selectedCategory)
    : mockReports;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation 
        isAuthenticated={isAuthenticated}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={() => setIsAuthenticated(false)}
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
              onClick={() => isAuthenticated ? setShowReportForm(true) : setShowAuthModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-5 w-5" />
              Report an Issue
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-blue-200 hover:border-blue-300 px-8 py-3 rounded-full transition-all duration-300 hover:bg-blue-50"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">247</h3>
                <p className="text-gray-600">Issues Reported</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">189</h3>
                <p className="text-gray-600">Issues Resolved</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">1,234</h3>
                <p className="text-gray-600">Active Citizens</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Reports</h2>
              <p className="text-gray-600">Help verify these community reports</p>
            </div>
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <div 
                key={report.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ReportCard 
                  report={report}
                  onVote={(voteType) => handleVote(report.id, voteType)}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setIsAuthenticated(true);
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
