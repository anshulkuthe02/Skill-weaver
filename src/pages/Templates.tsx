import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Code, Palette, Briefcase, Sparkles, Globe, Users, Zap, Camera, Music, BookOpen, Gamepad2, Heart, Laptop, Edit, Download, X, ArrowRight, Check, Bot, Edit3, ExternalLink, Code2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BackendConnectionTest from "@/components/BackendConnectionTest";

// Template type definition
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: string;
  preview: JSX.Element;
  fullPreview?: JSX.Element;
  popular?: boolean;
  featured?: boolean;
  difficulty?: string;
  features?: string[];
}

// Template Action Modal Component
const TemplateActionModal = ({ template, isOpen, onClose }: {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  
  if (!isOpen || !template) return null;

  const handleUseTemplate = (mode: 'ai' | 'manual') => {
    // Pass template data through navigation state instead of localStorage
    const templateData = {
      id: template.id,
      name: template.name,
      category: template.category,
      data: template
    };
    
    if (mode === 'ai') {
      navigate('/builder', { 
        state: { 
          templateId: template.id, 
          templateName: template.name,
          templateData: templateData
        } 
      });
    } else {
      navigate('/manual-design', { 
        state: { 
          templateId: template.id, 
          templateName: template.name,
          templateData: templateData
        } 
      });
    }
    onClose();
  };

  const handlePreview = () => {
    // Open a new window with full preview
    const previewWindow = window.open('', '_blank', 'width=1200,height=800');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${template.name} - Preview</title>
          <style>
            body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
            .preview-container { min-height: 100vh; }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <div style="padding: 20px; background: #f3f4f6; border-bottom: 1px solid #e5e7eb;">
              <h1 style="margin: 0; color: #111827;">${template.name} - Template Preview</h1>
              <p style="margin: 5px 0 0 0; color: #6b7280;">${template.description}</p>
            </div>
            <!-- Template preview content would be rendered here -->
            <div style="padding: 40px; text-align: center;">
              <h2>Full Template Preview</h2>
              <p>This would show the complete template layout.</p>
              <p style="margin-top: 20px;">
                <button onclick="window.close()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Close Preview</button>
              </p>
            </div>
          </div>
        </body>
        </html>
      `);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-2xl font-semibold">{template.name}</h3>
            <p className="text-muted-foreground mt-1">{template.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex h-[70vh]">
          {/* Preview Section */}
          <div className="flex-1 p-6 border-r bg-gray-50">
            <div className="h-full bg-white rounded-lg overflow-hidden shadow-inner border">
              <div className="h-full flex items-center justify-center">
                <div className="transform scale-50 origin-center w-full h-full">
                  {template.preview}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Section */}
          <div className="w-80 p-6 space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Template Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span>{template.difficulty || 'Beginner'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{template.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Downloads:</span>
                  <span>{template.downloads}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Included Features</h4>
              <div className="space-y-2">
                {template.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                )) || (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Responsive Design</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Contact Form</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Project Gallery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>SEO Optimized</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Choose How to Start</h4>
              
              {/* AI Builder Option */}
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">AI Builder</span>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Recommended</Badge>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Answer a few questions and let AI customize this template with your content.
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleUseTemplate('ai')}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start with AI
                </Button>
              </div>

              {/* Manual Edit Option */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Edit3 className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Manual Editor</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Jump straight into the editor and customize everything manually.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleUseTemplate('manual')}
                >
                  <Code2 className="h-4 w-4 mr-2" />
                  Manual Edit
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handlePreview}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Screen Preview
              </Button>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Heart className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  // Template action handlers
  const handleUseTemplate = (templateId: string, mode: 'ai' | 'manual') => {
    if (mode === 'ai') {
      // Redirect to AI Builder with template pre-selected
      window.location.href = `/builder?template=${templateId}`;
    } else {
      // Redirect to Manual Design Editor with template
      window.location.href = `/manual-design?template=${templateId}`;
    }
  };

  const handlePreviewTemplate = (templateId: string) => {
    // Open template preview in a new tab or modal
    window.open(`/preview/${templateId}`, '_blank');
  };

  const openTemplateActions = (template: Template) => {
    setSelectedTemplate(template);
    setShowActionModal(true);
  };

  const closeActionModal = () => {
    setShowActionModal(false);
    setSelectedTemplate(null);
  };

  const templates = [
    // Developer/Tech Templates
    {
      id: "modern-dev",
      name: "Modern Developer",
      description: "Clean, contemporary design with bold typography and project showcase",
      category: "developer",
      rating: 4.9,
      downloads: "12k+",
      difficulty: "Beginner",
      features: [
        "Responsive Design",
        "Dark/Light Mode",
        "Project Gallery",
        "Contact Form",
        "Resume Download",
        "GitHub Integration",
        "SEO Optimized"
      ],
      preview: (
        <div className="bg-gradient-to-b from-slate-50 to-white h-full flex flex-col">
          <div className="flex justify-between items-center p-3 bg-white border-b">
            <div className="text-xs font-bold">ALEX CHEN</div>
            <div className="flex gap-2 text-xs text-gray-600">
              <span>Home</span><span>Projects</span><span>Contact</span>
            </div>
          </div>
          <div className="p-3 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <div className="text-xs font-bold">Full Stack Developer</div>
                <div className="text-xs text-gray-600">React • Node.js • AWS</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              <div className="h-4 bg-blue-100 rounded text-xs flex items-center justify-center">Project 1</div>
              <div className="h-4 bg-green-100 rounded text-xs flex items-center justify-center">Project 2</div>
            </div>
          </div>
        </div>
      ),
      popular: true,
      featured: true
    },
    {
      id: "terminal-dev",
      name: "Terminal Portfolio",
      description: "Terminal-inspired design perfect for developers who love CLI aesthetics",
      category: "developer",
      rating: 4.8,
      downloads: "8.5k+",
      difficulty: "Intermediate",
      features: [
        "Terminal Theme",
        "Syntax Highlighting",
        "Command History",
        "Matrix Animation",
        "GitHub Stats",
        "Code Snippets",
        "Dark Mode Only"
      ],
      preview: (
        <div className="bg-gray-900 text-green-400 font-mono h-full">
          <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-400">portfolio.dev</div>
          </div>
          <div className="p-2 text-xs">
            <div className="text-gray-400">$ whoami</div>
            <div className="text-white">sarah-johnson</div>
            <div className="text-gray-400 mt-1">$ ls projects/</div>
            <div className="text-blue-400">react-app/</div>
            <div className="text-yellow-400">node-api/</div>
            <div className="text-green-400 mt-1">$ _</div>
          </div>
        </div>
      ),
      popular: true
    },
    {
      id: "github-dev",
      name: "GitHub Developer",
      description: "GitHub-inspired design showcasing contributions and repositories",
      category: "developer",
      rating: 4.7,
      downloads: "6.2k+",
      difficulty: "Beginner",
      features: [
        "GitHub Integration",
        "Repository Showcase",
        "Contribution Graph",
        "Profile Stats",
        "README Style",
        "Code Blocks",
        "Issue Tracker"
      ],
      preview: (
        <div className="bg-white border h-full">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
              <div className="text-xs font-bold">johndoe</div>
            </div>
          </div>
          <div className="p-3">
            <div className="text-xs mb-2">Popular repositories</div>
            <div className="space-y-1">
              <div className="border rounded p-2">
                <div className="text-xs font-medium text-blue-600">awesome-project</div>
                <div className="text-xs text-gray-600">Full-stack web application</div>
              </div>
              <div className="border rounded p-2">
                <div className="text-xs font-medium text-blue-600">mobile-app</div>
                <div className="text-xs text-gray-600">React Native application</div>
              </div>
            </div>
          </div>
        </div>
      ),
      popular: false
    },

    // Creative Templates
    {
      id: "artistic-creative",
      name: "Artistic Portfolio",
      description: "Vibrant, artistic design ideal for designers and creative professionals",
      category: "creative",
      rating: 4.9,
      downloads: "15k+",
      preview: (
        <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 h-full">
          <div className="p-2 bg-white/90 backdrop-blur">
            <div className="flex justify-between items-center">
              <div className="text-xs font-bold text-purple-600">MAYA.DESIGN</div>
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
            </div>
          </div>
          <div className="p-3">
            <div className="text-center mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-1"></div>
              <div className="text-xs font-bold">Maya Rodriguez</div>
              <div className="text-xs text-gray-600">Creative Director</div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded"></div>
              <div className="aspect-square bg-gradient-to-br from-pink-200 to-orange-200 rounded"></div>
              <div className="aspect-square bg-gradient-to-br from-orange-200 to-yellow-200 rounded"></div>
            </div>
          </div>
        </div>
      ),
      popular: true,
      featured: true
    },
    {
      id: "photographer",
      name: "Photography Portfolio",
      description: "Image-focused design perfect for photographers and visual artists",
      category: "creative",
      rating: 4.8,
      downloads: "9.3k+",
      preview: (
        <div className="bg-black text-white h-full">
          <div className="p-2 border-b border-gray-800">
            <div className="text-xs font-light tracking-wider">PHOTOGRAPHY</div>
          </div>
          <div className="p-3">
            <div className="text-center mb-2">
              <div className="text-xs font-light">JOHN SMITH</div>
              <div className="text-xs text-gray-400">Visual Storyteller</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="aspect-square bg-gray-800 rounded"></div>
              <div className="aspect-square bg-gray-700 rounded"></div>
              <div className="aspect-square bg-gray-600 rounded"></div>
              <div className="aspect-square bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      ),
      popular: true
    },
    {
      id: "designer-minimal",
      name: "Minimal Designer",
      description: "Clean, minimal design focusing on typography and whitespace",
      category: "creative",
      rating: 4.6,
      downloads: "7.1k+",
      preview: (
        <div className="bg-white h-full border">
          <div className="p-4 border-b">
            <div className="text-xs font-light tracking-widest">DESIGN STUDIO</div>
          </div>
          <div className="p-4">
            <div className="text-center">
              <div className="text-xs font-light mb-2">Emma Wilson</div>
              <div className="text-xs text-gray-500 mb-3">UX/UI Designer</div>
              <div className="w-full h-8 bg-gray-100 rounded mb-2"></div>
              <div className="w-full h-6 bg-gray-50 rounded"></div>
            </div>
          </div>
        </div>
      ),
      popular: false
    },

    // Business Templates
    {
      id: "corporate-business",
      name: "Corporate Professional",
      description: "Traditional corporate style perfect for business professionals",
      category: "business",
      rating: 4.9,
      downloads: "11k+",
      preview: (
        <div className="bg-white border h-full">
          <div className="bg-blue-600 text-white p-2">
            <div className="text-xs font-medium">MICHAEL JOHNSON</div>
            <div className="text-xs opacity-80">Business Consultant</div>
          </div>
          <div className="p-3">
            <div className="text-xs mb-2">Professional Experience</div>
            <div className="space-y-1">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs font-medium">Senior Manager</div>
                <div className="text-xs text-gray-600">Fortune 500 Company</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs font-medium">Team Lead</div>
                <div className="text-xs text-gray-600">Tech Startup</div>
              </div>
            </div>
          </div>
        </div>
      ),
      popular: true,
      featured: true
    },
    {
      id: "executive-business",
      name: "Executive Profile",
      description: "Sophisticated design for C-level executives and senior professionals",
      category: "business",
      rating: 4.7,
      downloads: "5.8k+",
      preview: (
        <div className="bg-gradient-to-b from-gray-100 to-white h-full border">
          <div className="p-3 text-center border-b">
            <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-1"></div>
            <div className="text-xs font-semibold">Dr. Sarah Chen</div>
            <div className="text-xs text-gray-600">Chief Technology Officer</div>
          </div>
          <div className="p-3">
            <div className="text-xs mb-2 font-medium">Leadership</div>
            <div className="bg-blue-50 p-2 rounded text-xs">
              Leading digital transformation initiatives
            </div>
          </div>
        </div>
      ),
      popular: false
    },
    {
      id: "consultant-business",
      name: "Consultant Portfolio",
      description: "Professional design tailored for consultants and freelancers",
      category: "business",
      rating: 4.8,
      downloads: "8.7k+",
      preview: (
        <div className="bg-white border h-full">
          <div className="bg-green-600 text-white p-2">
            <div className="text-xs font-medium">CONSULTING SERVICES</div>
          </div>
          <div className="p-3">
            <div className="text-xs font-medium mb-2">Maria Garcia</div>
            <div className="text-xs text-gray-600 mb-2">Strategy Consultant</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="bg-green-50 p-1 rounded text-xs text-center">Strategy</div>
              <div className="bg-blue-50 p-1 rounded text-xs text-center">Operations</div>
            </div>
          </div>
        </div>
      ),
      popular: false
    },

    // Academic Templates
    {
      id: "academic-researcher",
      name: "Academic Researcher",
      description: "Professional design for academics, researchers, and educators",
      category: "academic",
      rating: 4.6,
      downloads: "4.2k+",
      preview: (
        <div className="bg-white border h-full">
          <div className="p-3 border-b">
            <div className="text-xs font-semibold">Dr. James Wilson</div>
            <div className="text-xs text-gray-600">Professor of Computer Science</div>
          </div>
          <div className="p-3">
            <div className="text-xs mb-2">Recent Publications</div>
            <div className="space-y-1">
              <div className="border-l-2 border-blue-500 pl-2">
                <div className="text-xs font-medium">AI in Healthcare</div>
                <div className="text-xs text-gray-500">Nature, 2024</div>
              </div>
              <div className="border-l-2 border-green-500 pl-2">
                <div className="text-xs font-medium">Machine Learning</div>
                <div className="text-xs text-gray-500">IEEE, 2024</div>
              </div>
            </div>
          </div>
        </div>
      ),
      popular: false
    },

    // Student Templates
    {
      id: "student-portfolio",
      name: "Student Portfolio",
      description: "Fresh, modern design perfect for students and new graduates",
      category: "student",
      rating: 4.5,
      downloads: "13k+",
      preview: (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 h-full border">
          <div className="p-3 bg-white/80 backdrop-blur border-b">
            <div className="text-xs font-semibold">Alex Student</div>
            <div className="text-xs text-gray-600">Computer Science Major</div>
          </div>
          <div className="p-3">
            <div className="text-xs mb-2">Projects & Skills</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="bg-white/60 p-1 rounded text-xs text-center">React</div>
              <div className="bg-white/60 p-1 rounded text-xs text-center">Python</div>
              <div className="bg-white/60 p-1 rounded text-xs text-center">Mobile App</div>
              <div className="bg-white/60 p-1 rounded text-xs text-center">Web Dev</div>
            </div>
          </div>
        </div>
      ),
      popular: true
    },

    // Freelancer Templates
    {
      id: "freelancer-multi",
      name: "Multi-Service Freelancer",
      description: "Versatile design for freelancers offering multiple services",
      category: "freelancer",
      rating: 4.7,
      downloads: "9.8k+",
      preview: (
        <div className="bg-white border h-full">
          <div className="bg-purple-600 text-white p-2">
            <div className="text-xs font-medium">FREELANCER</div>
          </div>
          <div className="p-3">
            <div className="text-xs font-semibold mb-1">Lisa Chen</div>
            <div className="text-xs text-gray-600 mb-2">Full-Stack Developer & Designer</div>
            <div className="grid grid-cols-1 gap-1">
              <div className="bg-purple-50 p-1 rounded text-xs">Web Development</div>
              <div className="bg-blue-50 p-1 rounded text-xs">UI/UX Design</div>
              <div className="bg-green-50 p-1 rounded text-xs">Consulting</div>
            </div>
          </div>
        </div>
      ),
      popular: false
    },

    // Startup Templates
    {
      id: "startup-founder",
      name: "Startup Founder",
      description: "Dynamic design for entrepreneurs and startup founders",
      category: "startup",
      rating: 4.8,
      downloads: "6.5k+",
      preview: (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 h-full border">
          <div className="p-2 bg-white/90 backdrop-blur border-b">
            <div className="text-xs font-bold text-orange-600">STARTUP FOUNDER</div>
          </div>
          <div className="p-3">
            <div className="text-xs font-semibold">David Kim</div>
            <div className="text-xs text-gray-600 mb-2">CEO & Co-Founder</div>
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-2 rounded">
              <div className="text-xs font-medium">TechStartup Inc.</div>
              <div className="text-xs text-gray-600">Raised $2M Series A</div>
            </div>
          </div>
        </div>
      ),
      popular: false
    },

    // Minimal Templates
    {
      id: "ultra-minimal",
      name: "Ultra Minimal",
      description: "Extremely clean and simple design with focus on content",
      category: "minimal",
      rating: 4.4,
      downloads: "10k+",
      preview: (
        <div className="bg-white h-full border">
          <div className="p-4 border-b">
            <div className="text-xs font-light">PORTFOLIO</div>
          </div>
          <div className="p-4">
            <div className="text-center">
              <div className="text-xs font-light mb-4">Jane Doe</div>
              <div className="w-full h-2 bg-gray-100 rounded mb-2"></div>
              <div className="w-2/3 h-2 bg-gray-50 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      ),
      popular: true
    }
  ];

  const categories = [
    { id: "all", name: "All Templates", icon: Globe, count: templates.length },
    { id: "developer", name: "Developer", icon: Code, count: templates.filter(t => t.category === "developer").length },
    { id: "creative", name: "Creative", icon: Palette, count: templates.filter(t => t.category === "creative").length },
    { id: "business", name: "Business", icon: Briefcase, count: templates.filter(t => t.category === "business").length },
    { id: "academic", name: "Academic", icon: BookOpen, count: templates.filter(t => t.category === "academic").length },
    { id: "student", name: "Student", icon: Users, count: templates.filter(t => t.category === "student").length },
    { id: "freelancer", name: "Freelancer", icon: Zap, count: templates.filter(t => t.category === "freelancer").length },
    { id: "startup", name: "Startup", icon: Sparkles, count: templates.filter(t => t.category === "startup").length },
    { id: "minimal", name: "Minimal", icon: Heart, count: templates.filter(t => t.category === "minimal").length }
  ];
  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const featuredTemplates = templates.filter(template => template.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Portfolio Templates</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose from our collection of {templates.length}+ professionally designed templates. 
              Perfect for developers, designers, and professionals.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.8 average rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <span>100k+ downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span>Mobile responsive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Backend Connection Test */}
        <div className="mb-8">
          <BackendConnectionTest />
        </div>

        {/* Featured Templates */}
        {selectedCategory === "all" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              Featured Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredTemplates.map((template) => (
                <Card key={template.id} className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <div className="h-48 rounded-t-lg overflow-hidden border-b">
                        {template.preview}
                      </div>
                      <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                        Featured
                      </Badge>
                      {template.popular && (
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium">{template.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="mb-3 line-clamp-2">
                      {template.description}
                    </CardDescription>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="capitalize">
                        {template.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{template.downloads} downloads</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePreviewTemplate(template.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => openTemplateActions(template)}>
                        <Sparkles className="mr-1 h-3 w-3" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* All Templates Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              {selectedCategory === "all" ? "All Templates" : `${categories.find(c => c.id === selectedCategory)?.name} Templates`}
            </h3>
            <span className="text-sm text-muted-foreground">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-[1.02] group">
                <CardHeader className="p-0">
                  <div className="relative">
                    <div className="h-40 rounded-t-lg overflow-hidden border-b">
                      {template.preview}
                    </div>
                    {template.popular && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                        Popular
                      </Badge>
                    )}
                    {template.featured && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500 text-white text-xs">
                        Featured
                      </Badge>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handlePreviewTemplate(template.id)}>
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" onClick={() => openTemplateActions(template)}>
                        <Sparkles className="h-3 w-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-base truncate">{template.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs">{template.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="mb-3 text-sm line-clamp-2">
                    {template.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize text-xs">
                      {template.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{template.downloads}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">Ready to Build Your Portfolio?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Choose a template and customize it to match your unique style and personality.
          </p>
          <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link to="/builder">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Building Now
            </Link>
          </Button>
        </div>
      </div>

      {/* Template Action Modal */}
      <TemplateActionModal 
        template={selectedTemplate}
        isOpen={showActionModal}
        onClose={closeActionModal}
      />
    </div>
  );
};

export default Templates;