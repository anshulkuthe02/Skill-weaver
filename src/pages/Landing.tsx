import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Sparkles, Eye, Palette, Zap, Globe, Users, Star, X } from "lucide-react";
import { Link } from "react-router-dom";

// Template type definition
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  preview: JSX.Element;
  fullPreview: JSX.Element;
}

// Template Preview Modal Component
const TemplatePreviewModal = ({ template, isOpen, onClose }: { 
  template: Template | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{template.name} - Full Preview</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 overflow-auto max-h-[80vh]">
          {template.fullPreview}
        </div>
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <Button className="flex-1">
            <Code2 className="h-4 w-4 mr-2" />
            Use This Template
          </Button>
          <Button variant="outline">
            Download Files
          </Button>
          <Button variant="outline">
            Live Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Template data
  const templates: Template[] = [
    {
      id: 'modern-professional',
      name: 'Modern Professional',
      description: 'Clean, corporate design perfect for software engineers and tech professionals',
      category: 'Professional',
      tags: ['React', 'Responsive', 'Dark Mode'],
      preview: (
        <div className="aspect-[4/3] bg-gradient-to-b from-slate-50 to-white border">
          <div className="flex justify-between items-center p-3 bg-white border-b">
            <div className="text-sm font-bold">ALEX CHEN</div>
            <div className="flex gap-3 text-xs text-gray-600">
              <span>Home</span>
              <span>About</span>
              <span>Projects</span>
              <span>Contact</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <div className="text-sm font-bold">Alex Chen</div>
                <div className="text-xs text-gray-600">Software Engineer</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 mb-3">
              Building scalable web applications with modern technologies. 
              Passionate about clean code and user experience.
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 bg-blue-100 rounded border flex items-center justify-center text-xs">
                React Project
              </div>
              <div className="h-8 bg-green-100 rounded border flex items-center justify-center text-xs">
                Node.js API
              </div>
            </div>
          </div>
        </div>
      ),
      fullPreview: (
        <div className="bg-white min-h-[600px] border rounded-lg overflow-hidden">
          <div className="bg-white border-b sticky top-0 z-10">
            <div className="flex justify-between items-center p-6">
              <div className="text-2xl font-bold">Alex Chen</div>
              <div className="flex gap-6 text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer">Home</span>
                <span className="hover:text-blue-600 cursor-pointer">About</span>
                <span className="hover:text-blue-600 cursor-pointer">Projects</span>
                <span className="hover:text-blue-600 cursor-pointer">Contact</span>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Alex Chen</h1>
                <p className="text-xl text-gray-600 mb-4">Senior Software Engineer</p>
                <p className="text-gray-700 max-w-2xl">
                  Passionate about building scalable web applications with modern technologies. 
                  5+ years of experience in React, Node.js, and cloud architecture.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="font-bold mb-3">E-Commerce Platform</h3>
                <p className="text-gray-600 mb-4">Full-stack React application with Node.js backend</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">React</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Node.js</span>
                </div>
              </div>
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="font-bold mb-3">Task Management App</h3>
                <p className="text-gray-600 mb-4">Real-time collaboration tool with WebSocket integration</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">Vue.js</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Socket.io</span>
                </div>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="font-bold mb-3">Analytics Dashboard</h3>
                <p className="text-gray-600 mb-4">Data visualization dashboard with D3.js and Python backend</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">D3.js</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">Python</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      description: 'Vibrant, artistic design ideal for designers, artists, and creative professionals',
      category: 'Creative',
      tags: ['Gallery', 'Animations', 'Mobile First'],
      preview: (
        <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
          <div className="p-3 bg-white/90 backdrop-blur">
            <div className="flex justify-between items-center">
              <div className="text-sm font-bold text-purple-600">MAYA.DESIGN</div>
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
            </div>
          </div>
          <div className="p-4">
            <div className="text-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-2"></div>
              <div className="text-sm font-bold">Maya Rodriguez</div>
              <div className="text-xs text-gray-600">Creative Director</div>
            </div>
            <div className="grid grid-cols-3 gap-1 mb-2">
              <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded"></div>
              <div className="aspect-square bg-gradient-to-br from-pink-200 to-orange-200 rounded"></div>
              <div className="aspect-square bg-gradient-to-br from-orange-200 to-yellow-200 rounded"></div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-700">Latest Creative Works</div>
            </div>
          </div>
        </div>
      ),
      fullPreview: (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-[600px] rounded-lg overflow-hidden">
          <div className="bg-white/95 backdrop-blur border-b sticky top-0 z-10">
            <div className="flex justify-between items-center p-6">
              <div className="text-2xl font-bold text-purple-600">MAYA.DESIGN</div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
            </div>
          </div>
          <div className="p-8">
            <div className="text-center mb-12">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-6"></div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Maya Rodriguez
              </h1>
              <p className="text-2xl text-gray-600 mb-6">Creative Director & Visual Designer</p>
              <p className="text-gray-700 max-w-3xl mx-auto text-lg">
                Bringing ideas to life through bold, innovative design. Specializing in brand identity, 
                digital experiences, and creative storytelling that captivates and inspires.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-300 rounded-xl mb-4 group-hover:scale-105 transition-transform"></div>
                <h3 className="font-bold mb-2">Brand Identity Design</h3>
                <p className="text-gray-600">Complete visual identity for emerging tech startup</p>
              </div>
              <div className="group cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-pink-200 to-orange-300 rounded-xl mb-4 group-hover:scale-105 transition-transform"></div>
                <h3 className="font-bold mb-2">Mobile App Interface</h3>
                <p className="text-gray-600">User-centered design for wellness application</p>
              </div>
              <div className="group cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-orange-200 to-yellow-300 rounded-xl mb-4 group-hover:scale-105 transition-transform"></div>
                <h3 className="font-bold mb-2">Editorial Design</h3>
                <p className="text-gray-600">Magazine layout and typography for fashion publication</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'developer-terminal',
      name: 'Developer Terminal',
      description: 'Terminal-inspired design perfect for developers and programmers who love CLI',
      category: 'Developer',
      tags: ['CLI Theme', 'Syntax Highlight', 'GitHub Ready'],
      preview: (
        <div className="aspect-[4/3] bg-gray-900 text-green-400 font-mono">
          <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-400">portfolio.dev</div>
          </div>
          <div className="p-3 text-xs leading-relaxed">
            <div className="text-gray-400">$ whoami</div>
            <div className="text-white">sarah-johnson</div>
            <div className="text-gray-400 mt-2">$ cat about.txt</div>
            <div className="text-green-400">Full Stack Developer</div>
            <div className="text-white">5+ years experience</div>
            <div className="text-gray-400 mt-2">$ ls projects/</div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <div className="text-blue-400">react-app/</div>
              <div className="text-yellow-400">node-api/</div>
              <div className="text-purple-400">python-ml/</div>
              <div className="text-red-400">vue-dashboard/</div>
            </div>
            <div className="text-green-400 mt-2">$ _</div>
          </div>
        </div>
      ),
      fullPreview: (
        <div className="bg-gray-900 text-green-400 font-mono min-h-[600px] rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
            <div className="flex gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm text-gray-400">sarah-johnson@portfolio:~$</div>
          </div>
          <div className="p-6 text-sm leading-loose">
            <div className="mb-8">
              <div className="text-gray-400">$ whoami</div>
              <div className="text-white ml-2">sarah-johnson</div>
              <div className="text-gray-400 mt-4">$ cat about.txt</div>
              <div className="ml-2">
                <div className="text-green-400">Name: Sarah Johnson</div>
                <div className="text-blue-400">Role: Full Stack Developer</div>
                <div className="text-yellow-400">Experience: 5+ years</div>
                <div className="text-purple-400">Location: San Francisco, CA</div>
                <div className="text-white mt-2">
                  Passionate about building scalable web applications and contributing to open source.
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="text-gray-400">$ ls -la skills/</div>
              <div className="ml-2 grid grid-cols-2 gap-2">
                <div className="text-blue-400">drwxr-xr-x javascript/</div>
                <div className="text-green-400">drwxr-xr-x python/</div>
                <div className="text-yellow-400">drwxr-xr-x react/</div>
                <div className="text-purple-400">drwxr-xr-x node-js/</div>
                <div className="text-red-400">drwxr-xr-x docker/</div>
                <div className="text-cyan-400">drwxr-xr-x kubernetes/</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-gray-400">$ git log --oneline projects/</div>
              <div className="ml-2 space-y-1">
                <div><span className="text-yellow-400">a1b2c3d</span> <span className="text-white">feat: E-commerce platform with React & Node.js</span></div>
                <div><span className="text-yellow-400">d4e5f6g</span> <span className="text-white">feat: Real-time chat application with Socket.io</span></div>
                <div><span className="text-yellow-400">h7i8j9k</span> <span className="text-white">feat: Machine learning model deployment with Docker</span></div>
                <div><span className="text-yellow-400">l0m1n2o</span> <span className="text-white">feat: Microservices architecture with Kubernetes</span></div>
              </div>
            </div>

            <div className="text-green-400 flex items-center">
              <span>$</span>
              <span className="ml-2 animate-pulse">_</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const openPreview = (template: Template) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const closePreview = () => {
    setShowPreviewModal(false);
    setSelectedTemplate(null);
  };

  useEffect(() => {
    // Check if user has already accepted cookies this session
    const cookiesAccepted = sessionStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    sessionStorage.setItem('cookiesAccepted', 'true');
    setShowCookieBanner(false);
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold">SkillWeave</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-primary relative overflow-hidden">
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
            <Button size="lg" variant="secondary" className="shadow-glow" asChild>
              <Link to="/builder">
                <Code2 className="mr-2 h-5 w-5" />
                Start Building
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/templates">
                <Eye className="mr-2 h-5 w-5" />
                View Templates
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose SkillWeave?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to create a professional developer portfolio that stands out
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 shadow-elegant">
              <CardHeader>
                <Palette className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Beautiful Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose from professionally designed templates that showcase your work in the best light.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-elegant">
              <CardHeader>
                <Zap className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate your portfolio in minutes, not days. No coding required, just fill in your details.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-elegant">
              <CardHeader>
                <Globe className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Instant Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get a shareable link instantly. Your portfolio is hosted and ready to share with potential employers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-elegant">
              <CardHeader>
                <Users className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Contact Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built-in contact forms and social links make it easy for recruiters to reach out to you.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-elegant">
              <CardHeader>
                <Star className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Project Showcase</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Highlight your best work with detailed project descriptions, tech stacks, and live links.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-elegant">
              <CardHeader>
                <Code2 className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Developer Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built by developers, for developers. Features tailored to showcase technical skills and achievements.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Template Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Perfect Template</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start with a professionally designed template and customize it to match your style
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {templates.map((template, index) => (
              <Card key={template.id} className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    {template.preview}
                    <div className="absolute top-2 right-2">
                      <Badge className={`text-white text-xs ${
                        template.category === 'Professional' ? 'bg-blue-500' :
                        template.category === 'Creative' ? 'bg-purple-500' : 'bg-green-500'
                      }`}>
                        {template.category}
                      </Badge>
                    </div>
                    {/* Quick Actions */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Button size="sm" className="bg-white text-black hover:bg-gray-100" onClick={() => openPreview(template)}>
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                        <Code2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      {template.category === 'Professional' && <Sparkles className="h-4 w-4 text-blue-500" />}
                      {template.category === 'Creative' && <Palette className="h-4 w-4 text-purple-500" />}
                      {template.category === 'Developer' && <Code2 className="h-4 w-4 text-green-500" />}
                      {template.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <div className="flex gap-2 mb-3">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 text-xs">
                        Use Template
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => openPreview(template)}>
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link to="/builder">
                <Button size="lg" className="bg-gradient-accent shadow-glow">
                  <Eye className="mr-2 h-5 w-5" />
                  Start Building Now
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="outline" size="lg">
                  <Globe className="mr-2 h-5 w-5" />
                  Browse 50+ Templates
                </Button>
              </Link>
            </div>
            
            {/* Template Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="text-center p-3">
                <div className="text-2xl font-bold text-accent mb-1">50+</div>
                <div className="text-xs text-muted-foreground">Templates</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl font-bold text-accent mb-1">10k+</div>
                <div className="text-xs text-muted-foreground">Downloads</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl font-bold text-accent mb-1">5min</div>
                <div className="text-xs text-muted-foreground">Setup</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl font-bold text-accent mb-1">100%</div>
                <div className="text-xs text-muted-foreground">Customizable</div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-6">
              Each template is fully customizable and mobile-responsive. Choose your favorite design and personalize it with your content, colors, and style preferences.
            </p>
            
            {/* Quick Template Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <Code2 className="h-3 w-3 mr-1" />
                Developer (15)
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <Palette className="h-3 w-3 mr-1" />
                Creative (12)
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <Users className="h-3 w-3 mr-1" />
                Business (8)
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <Star className="h-3 w-3 mr-1" />
                Premium (10)
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <Sparkles className="h-3 w-3 mr-1" />
                Minimal (5)
              </Badge>
            </div>

            {/* Popular Template Thumbnails */}
            <div className="text-center mb-6">
              <div className="text-sm font-medium mb-3 text-muted-foreground">More Popular Templates</div>
              <div className="flex justify-center gap-2 mb-4">
                <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded border-2 border-white shadow-sm"></div>
                <div className="w-16 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded border-2 border-white shadow-sm"></div>
                <div className="w-16 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded border-2 border-white shadow-sm"></div>
                <div className="w-16 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded border-2 border-white shadow-sm"></div>
                <div className="w-16 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded border-2 border-white shadow-sm"></div>
                <div className="w-16 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded border-2 border-white shadow-sm"></div>
              </div>
              <div className="text-xs text-muted-foreground">
                + 44 more templates available in the gallery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Portfolio?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have already created their professional portfolios with SkillWeave.
          </p>
          <Button size="lg" className="bg-gradient-accent shadow-glow" asChild>
            <Link to="/builder">
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started for Free
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
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
                <a href="https://x.com/ak_writes01?s=09" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-accent hover:bg-gray-700 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/anshul-kuthe-7976ab28a" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-accent hover:bg-gray-700 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://github.com/anshulkuthe02" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-accent hover:bg-gray-700 transition-all duration-300">
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
                <li><Link to="/templates" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">Templates</Link></li>
                <li><Link to="/builder" className="text-gray-300 hover:text-accent transition-colors hover:translate-x-1 transform duration-200 inline-block">AI Builder</Link></li>
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

      {/* Template Preview Modal */}
      <TemplatePreviewModal 
        template={selectedTemplate}
        isOpen={showPreviewModal}
        onClose={closePreview}
      />
    </div>
  );
};

export default Landing;