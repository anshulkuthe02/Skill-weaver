import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean and contemporary design with bold typography",
      category: "minimal",
      rating: 4.8,
      preview: "/api/placeholder/400/300",
      popular: true
    },
    {
      id: "creative",
      name: "Creative",
      description: "Vibrant design perfect for creative professionals",
      category: "creative",
      rating: 4.7,
      preview: "/api/placeholder/400/300",
      popular: false
    },
    {
      id: "professional",
      name: "Professional",
      description: "Traditional corporate style for business professionals",
      category: "business",
      rating: 4.9,
      preview: "/api/placeholder/400/300",
      popular: true
    },
    {
      id: "developer",
      name: "Developer",
      description: "Tech-focused design with code snippets and project highlights",
      category: "tech",
      rating: 4.6,
      preview: "/api/placeholder/400/300",
      popular: false
    }
  ];

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "minimal", name: "Minimal" },
    { id: "creative", name: "Creative" },
    { id: "business", name: "Business" },
    { id: "tech", name: "Tech" }
  ];

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Portfolio Templates</h1>
        <p className="text-muted-foreground">Choose from our collection of professionally designed templates</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="border-border/50 shadow-elegant hover:shadow-glow transition-shadow">
            <CardHeader className="p-0">
              <div className="relative">
                <div className="bg-muted h-48 rounded-t-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Template Preview</span>
                </div>
                {template.popular && (
                  <Badge className="absolute top-2 right-2 bg-accent">Popular</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm text-muted-foreground">{template.rating}</span>
                </div>
              </div>
              <CardDescription className="mb-4">
                {template.description}
              </CardDescription>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to="/builder">Use Template</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;