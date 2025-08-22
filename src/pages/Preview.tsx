import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  ExternalLink, 
  Share2, 
  Edit, 
  Download, 
  Monitor, 
  Smartphone, 
  Tablet,
  Eye,
  Globe,
  Code,
  Settings,
  BarChart3,
  Calendar,
  Users
} from "lucide-react";

interface Portfolio {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  template: string;
  url: string;
  customDomain?: string;
  viewCount: number;
  lastModified: string;
}

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    // Simulate loading portfolio data
    const loadPortfolio = async () => {
      setIsLoading(true);
      // In a real app, you'd fetch from your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock portfolio data
      const mockPortfolio: Portfolio = {
        id: id || "1",
        title: "John Doe - Full Stack Developer",
        description: "Professional portfolio showcasing web development projects and skills",
        status: "published",
        template: "modern",
        url: "https://johndoe.skillweave.dev",
        customDomain: "johndoe.dev",
        viewCount: 1234,
        lastModified: "2024-03-15T10:30:00Z"
      };
      
      setPortfolio(mockPortfolio);
      setIsLoading(false);
    };

    if (id) {
      loadPortfolio();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const getViewModeIcon = (mode: string) => {
    switch (mode) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getViewModeSize = () => {
    switch (viewMode) {
      case 'desktop':
        return 'w-full';
      case 'tablet':
        return 'w-[768px] mx-auto';
      case 'mobile':
        return 'w-[375px] mx-auto';
      default:
        return 'w-full';
    }
  };

  const handleShare = async () => {
    if (portfolio) {
      try {
        await navigator.share({
          title: portfolio.title,
          text: portfolio.description,
          url: portfolio.customDomain ? `https://${portfolio.customDomain}` : portfolio.url
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(portfolio.customDomain ? `https://${portfolio.customDomain}` : portfolio.url);
      }
    }
  };

  const mockHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio?.title || 'Portfolio'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 0; text-align: center; }
        .avatar { width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.2); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold; }
        h1 { font-size: 3rem; margin-bottom: 10px; }
        .subtitle { font-size: 1.2rem; opacity: 0.9; }
        section { padding: 80px 0; }
        h2 { font-size: 2.5rem; margin-bottom: 30px; text-align: center; }
        .skills { display: flex; flex-wrap: gap: 10px; justify-content: center; margin-top: 30px; }
        .skill { background: #f0f0f0; padding: 8px 16px; border-radius: 20px; font-size: 14px; }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 50px; }
        .project { background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
        .project-image { height: 200px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); }
        .project-content { padding: 20px; }
        .project h3 { margin-bottom: 10px; }
        .contact { background: #f8f9fa; text-align: center; }
        .contact-links { display: flex; justify-content: center; gap: 20px; margin-top: 30px; }
        .contact-link { padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="avatar">JD</div>
            <h1>John Doe</h1>
            <p class="subtitle">Full Stack Developer</p>
        </div>
    </header>
    
    <section>
        <div class="container">
            <h2>About Me</h2>
            <p style="text-align: center; max-width: 600px; margin: 0 auto; font-size: 1.1rem;">
                Passionate developer with 5+ years of experience building modern web applications. 
                I love creating beautiful, functional, and user-friendly digital experiences.
            </p>
            <div class="skills">
                <span class="skill">React</span>
                <span class="skill">Node.js</span>
                <span class="skill">TypeScript</span>
                <span class="skill">Python</span>
                <span class="skill">AWS</span>
            </div>
        </div>
    </section>
    
    <section style="background: #f8f9fa;">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="projects">
                <div class="project">
                    <div class="project-image"></div>
                    <div class="project-content">
                        <h3>E-commerce Platform</h3>
                        <p>A full-stack e-commerce solution built with React and Node.js</p>
                    </div>
                </div>
                <div class="project">
                    <div class="project-image"></div>
                    <div class="project-content">
                        <h3>Task Management App</h3>
                        <p>Collaborative task management tool with real-time updates</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <section class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <p>Let's work together on your next project!</p>
            <div class="contact-links">
                <a href="mailto:john@example.com" class="contact-link">Email</a>
                <a href="#" class="contact-link">LinkedIn</a>
                <a href="#" class="contact-link">GitHub</a>
            </div>
        </div>
    </section>
</body>
</html>`;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Portfolio not found</h2>
            <p className="text-muted-foreground mb-4">
              The portfolio you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/portfolio')}>
              Back to Portfolios
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/portfolio')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="font-semibold">{portfolio.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {portfolio.status}
                  </Badge>
                  <span>•</span>
                  <span>{portfolio.template} template</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Selector */}
              <div className="flex items-center border rounded-lg p-1">
                {[
                  { mode: 'desktop', icon: Monitor },
                  { mode: 'tablet', icon: Tablet },
                  { mode: 'mobile', icon: Smartphone }
                ].map(({ mode, icon: Icon }) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode(mode as 'desktop' | 'tablet' | 'mobile')}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button variant="outline" size="sm" asChild>
                <a href={portfolio.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Live
                </a>
              </Button>

              <Button size="sm" asChild>
                <a href={`/builder?portfolio=${portfolio.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="container mx-auto p-6">
        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              View Code
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className={`transition-all duration-300 ${getViewModeSize()}`}>
              <div className={`border rounded-lg overflow-hidden bg-white shadow-lg ${
                viewMode === 'mobile' ? 'max-h-[600px]' : 'min-h-[600px]'
              }`}>
                <iframe
                  srcDoc={mockHTML}
                  className="w-full h-full min-h-[600px]"
                  title="Portfolio Preview"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generated HTML Code</CardTitle>
                <CardDescription>
                  This is the HTML code that powers your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                    <code>{mockHTML}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => navigator.clipboard.writeText(mockHTML)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Views</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">{portfolio.viewCount.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {new Date(portfolio.lastModified).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Domain</span>
                  </div>
                  <div className="text-sm font-medium mt-1 truncate">
                    {portfolio.customDomain || new URL(portfolio.url).hostname}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Detailed analytics for your portfolio performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Analytics dashboard coming soon</p>
                  <p className="text-sm">Track visitors, page views, and engagement metrics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Preview;
