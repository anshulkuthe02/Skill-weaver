import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, FileText, Eye, Users, TrendingUp, Loader2, AlertCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { portfolioService } from "@/services/portfolioService";

interface Portfolio {
  id: string;
  title: string;
  description?: string;
  view_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface RecentActivity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  activity_data?: Record<string, unknown>;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || authLoading) return;

      try {
        setLoading(true);
        setError(null);

        // Load user portfolios
        const { data: portfoliosData } = await portfolioService.getUserPortfolios();
        setPortfolios(portfoliosData);

        // Load recent activities
        const { data: activitiesData } = await portfolioService.getRecentPortfolios(5);
        // For now, we'll use recent portfolios as activities
        // In a real app, you'd have a separate activities endpoint
        
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, authLoading]);

  const stats = {
    totalPortfolios: portfolios.length,
    totalViews: portfolios.reduce((sum, p) => sum + p.view_count, 0),
    publishedPortfolios: portfolios.filter(p => p.status === 'published').length,
    draftPortfolios: portfolios.filter(p => p.status === 'draft').length
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (authLoading || loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in to view your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.first_name || user.username || 'User'}!</h1>
          <p className="text-muted-foreground">Manage your portfolios and track your progress here.</p>
        </div>
        <Button asChild>
          <Link to="/builder">
            <Plus className="mr-2 h-4 w-4" />
            New Portfolio
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {user.first_name && user.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user.username || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">{user.username || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <p className="font-medium capitalize">{user.role || 'User'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPortfolios}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedPortfolios} published, {stats.draftPortfolios} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">Across all portfolios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Portfolios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedPortfolios}</div>
            <p className="text-xs text-muted-foreground">Live and accessible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Portfolios</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftPortfolios}</div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Portfolios */}
      <Card>
        <CardHeader>
          <CardTitle>Your Portfolios</CardTitle>
          <CardDescription>
            {portfolios.length === 0 
              ? "You haven't created any portfolios yet" 
              : `Manage your ${portfolios.length} portfolio${portfolios.length === 1 ? '' : 's'}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {portfolios.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No portfolios yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first portfolio to get started showcasing your work.
              </p>
              <Button asChild>
                <Link to="/builder">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Portfolio
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolios.slice(0, 5).map((portfolio) => (
                <div key={portfolio.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{portfolio.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {portfolio.description || 'No description'} • {portfolio.view_count} views
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Status: <span className="capitalize">{portfolio.status}</span> • 
                      Updated {formatDate(portfolio.updated_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/portfolio/${portfolio.id}`}>Edit</Link>
                    </Button>
                    {portfolio.status === 'published' && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/preview/${portfolio.id}`}>View</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {portfolios.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link to="/portfolio">View All Portfolios</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;