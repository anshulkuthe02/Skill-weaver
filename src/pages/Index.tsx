import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Sparkles, Eye, Share2 } from "lucide-react";
import PortfolioForm from "@/components/PortfolioForm";
import PortfolioPreview from "@/components/PortfolioPreview";
import TemplateSelection from "@/components/TemplateSelection";
import { PortfolioData } from "@/types/portfolio";

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
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

  const handleGeneratePortfolio = () => {
    // Simulate URL generation
    const url = `https://portfolio.dev/${portfolioData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    setGeneratedUrl(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzQgOC0xMC0yLTEwaDEwbC0yIDEwIDggMTB2MTBoLTEwbC04LTEwLTggMTBoLTEwdi0xMFoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container relative z-10 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">No-Code Portfolio Builder</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-primary-foreground">
            Create Your Developer Portfolio
            <br />
            <span className="text-accent">In Minutes</span>
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Build a stunning portfolio website with our AI-powered generator. Choose from beautiful templates, 
            showcase your projects, and get a shareable link instantly.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="shadow-glow">
              <Code2 className="mr-2 h-5 w-5" />
              Start Building
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Eye className="mr-2 h-5 w-5" />
              View Examples
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-16">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create">Create Portfolio</TabsTrigger>
            <TabsTrigger value="preview">Preview & Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card className="border-border/50 shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-accent" />
                      Choose Template
                    </CardTitle>
                    <CardDescription>
                      Select a template that matches your style
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TemplateSelection 
                      selectedTemplate={selectedTemplate}
                      onTemplateSelect={setSelectedTemplate}
                    />
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-elegant">
                  <CardHeader>
                    <CardTitle>Portfolio Details</CardTitle>
                    <CardDescription>
                      Fill in your information to generate your portfolio
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

              <div className="lg:sticky lg:top-8">
                <Card className="border-border/50 shadow-elegant">
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
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
    </div>
  );
};

export default Index;