import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import PortfolioForm from "@/components/PortfolioForm";
import PortfolioPreview from "@/components/PortfolioPreview";
import TemplateSelection from "@/components/TemplateSelection";
import ManualDesign from "@/components/ManualDesign";
// ManualDesignPage will be loaded via route
import { PortfolioData } from "@/types/portfolio";

const Builder = () => {
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
    },
    documents: [],
    media: [],
    resumeId: undefined
  });
  const [customCSS, setCustomCSS] = useState("");
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Portfolio Builder</h1>
        <p className="text-muted-foreground">Create your professional developer portfolio</p>
      </div>

      <Tabs defaultValue="template" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="template">Choose Template</TabsTrigger>
          <TabsTrigger value="content">Add Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        {/* Manual design section is now part of the template tab only */}

        <TabsContent value="template" className="space-y-6">
          <Card className="border-border/50 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Choose Template
              </CardTitle>
              <CardDescription>
                Select a template that matches your style and professional brand. You can also manually design your template below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateSelection 
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
              />
            </CardContent>
              <div className="mt-8">
                <Card className="border-dashed cursor-pointer hover:shadow-glow transition-all duration-300" onClick={() => navigate('/manual-design')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🎨 Manual Design
                    </CardTitle>
                    <CardDescription>
                      Click to manually style your portfolio with theme, color, gradient, footer, and more
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle>Portfolio Details</CardTitle>
                <CardDescription>
                  Fill in your information to create your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioForm 
                  data={portfolioData}
                  onChange={setPortfolioData}
                />
              </CardContent>
            </Card>

            <div className="lg:sticky lg:top-6">
              <Card className="border-border/50 shadow-elegant">
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    See how your portfolio will look as you build it
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

        <TabsContent value="preview" className="space-y-6">
          <Card className="border-border/50 shadow-elegant">
            <CardHeader>
              <CardTitle>Full Portfolio Preview</CardTitle>
              <CardDescription>
                Preview your complete portfolio before publishing
              </CardDescription>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Builder;