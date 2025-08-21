import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Sparkles, Eye, Palette, Zap, Globe, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
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
      <footer className="border-t border-border/50 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Code2 className="h-6 w-6 text-accent" />
              <span className="font-semibold">SkillWeave</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 SkillWeave. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;