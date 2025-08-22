import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink,
  Globe,
  Lock,
  FileText,
  Calendar,
  BarChart3,
  Share2
} from "lucide-react";
import { Link } from "react-router-dom";

interface Portfolio {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'unlisted';
  template: string;
  viewCount: number;
  lastModified: string;
  url: string;
  customDomain?: string;
}

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: "1",
      title: "John Doe - Full Stack Developer",
      description: "Professional portfolio showcasing my web development projects and skills",
      status: "published",
      visibility: "public",
      template: "modern",
      viewCount: 1234,
      lastModified: "2024-03-15T10:30:00Z",
      url: "https://johndoe.skillweave.dev",
      customDomain: "johndoe.dev"
    },
    {
      id: "2", 
      title: "Creative Portfolio",
      description: "A creative showcase of my design and development work",
      status: "draft",
      visibility: "private",
      template: "creative",
      viewCount: 0,
      lastModified: "2024-03-10T14:22:00Z",
      url: "https://creative.skillweave.dev"
    },
    {
      id: "3",
      title: "Photography Portfolio",
      description: "Collection of my best photography work",
      status: "published",
      visibility: "unlisted",
      template: "minimal",
      viewCount: 567,
      lastModified: "2024-03-08T09:15:00Z",
      url: "https://photos.skillweave.dev"
    }
  ]);

  const [filteredPortfolios, setFilteredPortfolios] = useState(portfolios);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);

  useEffect(() => {
    let filtered = portfolios;

    if (searchTerm) {
      filtered = filtered.filter(portfolio => 
        portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        portfolio.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(portfolio => portfolio.status === statusFilter);
    }

    setFilteredPortfolios(filtered);
  }, [portfolios, searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
      case 'unlisted':
        return <Eye className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const handleDeletePortfolio = (id: string) => {
    if (confirm("Are you sure you want to delete this portfolio?")) {
      setPortfolios(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleDuplicatePortfolio = (portfolio: Portfolio) => {
    const duplicate = {
      ...portfolio,
      id: `${portfolio.id}-copy`,
      title: `${portfolio.title} (Copy)`,
      status: 'draft' as const,
      viewCount: 0,
      lastModified: new Date().toISOString(),
      url: `${portfolio.url}-copy`,
      customDomain: undefined
    };
    setPortfolios(prev => [...prev, duplicate]);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Portfolios</h1>
          <p className="text-muted-foreground">
            Manage and track your portfolio websites
          </p>
        </div>
        <Button asChild>
          <Link to="/builder">
            <Plus className="h-4 w-4 mr-2" />
            Create New Portfolio
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search portfolios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Portfolios", value: portfolios.length, icon: FileText },
          { label: "Published", value: portfolios.filter(p => p.status === 'published').length, icon: Globe },
          { label: "Draft", value: portfolios.filter(p => p.status === 'draft').length, icon: Edit },
          { label: "Total Views", value: portfolios.reduce((sum, p) => sum + p.viewCount, 0), icon: BarChart3 }
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolios List */}
      <div className="space-y-4">
        {filteredPortfolios.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || statusFilter !== "all" ? "No portfolios found" : "No portfolios yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "Create your first portfolio to get started"
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button asChild>
                  <Link to="/builder">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Portfolio
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPortfolios.map((portfolio) => (
            <Card key={portfolio.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Portfolio Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold truncate">{portfolio.title}</h3>
                      <Badge className={`${getStatusColor(portfolio.status)} capitalize`}>
                        {portfolio.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getVisibilityIcon(portfolio.visibility)}
                        <span className="text-sm capitalize">{portfolio.visibility}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {portfolio.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Updated {formatDate(portfolio.lastModified)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>{portfolio.viewCount.toLocaleString()} views</span>
                      </div>
                      {portfolio.customDomain && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <span>{portfolio.customDomain}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {portfolio.status === 'published' && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={portfolio.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Live
                        </a>
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/builder?portfolio=${portfolio.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Portfolio Actions</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigator.clipboard.writeText(portfolio.url)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy URL
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => handleDuplicatePortfolio(portfolio)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Duplicate
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            asChild
                          >
                            <Link to={`/portfolio/${portfolio.id}/analytics`}>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-destructive hover:text-destructive"
                            onClick={() => handleDeletePortfolio(portfolio.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Portfolio
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Portfolio;
