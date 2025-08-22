import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Sparkles, Eye, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import PortfolioForm from "@/components/PortfolioForm";
import PortfolioPreview from "@/components/PortfolioPreview";
import TemplateSelection from "@/components/TemplateSelection";
import { PortfolioData } from "@/types/portfolio";

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    name: "",
    title: "",
    bio: "",
    skills: [],
    projects: [],
    contact: {
      email: "",
      github: "",
      linkedin: "",
      website: ""
    }
  });
  const [generatedUrl, setGeneratedUrl] = useState("");

  useEffect(() => {
    // Check if user has already accepted cookies - use sessionStorage for temporary storage
    const cookiesAccepted = sessionStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    sessionStorage.setItem('cookiesAccepted', 'true');
    setShowCookieBanner(false);
  };

  const handleGeneratePortfolio = () => {
    // Simulate URL generation
    const url = `https://portfolio.dev/${portfolioData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    setGeneratedUrl(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-accent/20 rounded-xl">
              <Code2 className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
              SkillWeave
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Build Your Developer Portfolio in <span className="text-accent">Minutes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create stunning, professional portfolios that showcase your skills and projects. 
            No coding required - just your creativity and passion for development.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button size="lg" className="bg-gradient-accent shadow-glow">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Building
            </Button>
            <Button size="lg" variant="outline">
              <Eye className="mr-2 h-5 w-5" />
              View Examples
            </Button>
          </div>
        </div>

        {/* Main Portfolio Builder */}
        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="template">Choose Template</TabsTrigger>
            <TabsTrigger value="content">Add Content</TabsTrigger>
            <TabsTrigger value="preview">Preview & Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-8">
            <div className="text-center space-y-4 mb-8">
              <h3 className="text-2xl font-bold">Choose Your Template</h3>
              <p className="text-muted-foreground">
                Select a template that matches your style and profession
              </p>
            </div>
            <TemplateSelection 
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
          </TabsContent>

          <TabsContent value="content" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card className="border-border/50 shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5" />
                      Portfolio Information
                    </CardTitle>
                    <CardDescription>
                      Fill in your details to create your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PortfolioForm 
                      data={portfolioData}
                      onChange={setPortfolioData}
                    />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="border-border/50 shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Live Preview
                    </CardTitle>
                    <CardDescription>
                      See how your portfolio will look
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="bg-muted rounded-lg p-4 min-h-[600px]">
                      <PortfolioPreview 
                        data={portfolioData}
                        template={selectedTemplate}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Generate Your Portfolio</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ready to publish? Generate your portfolio and get a shareable link that you can use anywhere.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={handleGeneratePortfolio}
                  className="bg-gradient-accent shadow-glow"
                  disabled={!portfolioData.name}
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Generate Portfolio Link
                </Button>
              </div>
              
              {generatedUrl && (
                <Card className="max-w-2xl mx-auto border-accent/20 shadow-glow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-accent">Portfolio Generated!</h3>
                    <p className="text-muted-foreground mb-4">Your portfolio is now live at:</p>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">
                      {generatedUrl}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Copy Link
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="border-border/50 shadow-elegant">
                <CardHeader>
                  <CardTitle>Full Portfolio Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="bg-muted rounded-lg p-8 min-h-[800px]">
                    <PortfolioPreview 
                      data={portfolioData}
                      template={selectedTemplate}
                      fullView={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer - Enhanced with smooth transition */}
      <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white mt-16 relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-blue-500 to-purple-500"></div>
        
        <div className="container mx-auto px-4 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Code2 className="h-6 w-6 text-accent" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                  SkillWeave
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Build stunning developer portfolios in minutes with our AI-powered platform. 
                No coding required, just creativity and passion.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-accent hover:bg-gray-700 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-accent hover:bg-gray-700 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-accent hover:bg-gray-700 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-accent">Product</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Templates</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">AI Builder</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Custom Domains</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Analytics</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">SEO Tools</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Export Options</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-accent">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Community</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Tutorials</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">API Reference</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Changelog</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-accent">Support</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Live Chat</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Bug Reports</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Feature Requests</a></li>
                <li><a href="#" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Status Page</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl border border-gray-600">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-accent">Stay Updated</h3>
              <p className="text-gray-300 max-w-md mx-auto">
                Get the latest updates, tips, and exclusive content delivered to your inbox.
              </p>
              <div className="flex max-w-md mx-auto gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                />
                <Button className="px-6 bg-accent hover:bg-accent/90 text-white">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-12"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              <Link to="/privacy-policy" className="hover:text-accent transition-colors hover:underline">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-accent transition-colors hover:underline">Terms of Service</Link>
              <Link to="/cookie-policy" className="hover:text-accent transition-colors hover:underline">Cookie Policy</Link>
              <a href="#" className="hover:text-accent transition-colors hover:underline">GDPR Compliance</a>
              <a href="#" className="hover:text-accent transition-colors hover:underline">Accessibility</a>
              <a href="#" className="hover:text-accent transition-colors hover:underline">Security</a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-300 flex items-center gap-2">
              <span>© 2025 SkillWeave. All rights reserved.</span>
              <span className="text-accent">Made with ❤️ for developers</span>
            </div>
          </div>

          {/* Cookie Banner (conditionally shown) */}
          {showCookieBanner && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-6 z-50 shadow-2xl">
              <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-sm text-gray-300 flex-1">
                  <span className="font-medium text-white">🍪 We use cookies</span>
                  <span className="ml-2">
                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                  </span>
                  <Link to="/cookie-policy" className="text-accent hover:underline ml-1">
                    Learn more
                  </Link>
                </div>
                <div className="flex gap-3">
                  <Link to="/cookie-policy">
                    <Button variant="outline" size="sm" className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700">
                      Manage Preferences
                    </Button>
                  </Link>
                  <Button size="sm" className="text-xs bg-accent hover:bg-accent/90 text-white" onClick={handleAcceptCookies}>
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Index;