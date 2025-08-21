import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Github, ExternalLink } from "lucide-react";
import { PortfolioData, Project } from "@/types/portfolio";

interface PortfolioFormProps {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

const PortfolioForm = ({ data, onChange }: PortfolioFormProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    technologies: [],
    liveUrl: "",
    githubUrl: ""
  });

  const updateData = (field: keyof PortfolioData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      updateData("skills", [...data.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    updateData("skills", data.skills.filter(s => s !== skill));
  };

  const addProject = () => {
    if (newProject.title && newProject.description) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        technologies: newProject.technologies || [],
        liveUrl: newProject.liveUrl,
        githubUrl: newProject.githubUrl
      };
      updateData("projects", [...data.projects, project]);
      setNewProject({
        title: "",
        description: "",
        technologies: [],
        liveUrl: "",
        githubUrl: ""
      });
    }
  };

  const removeProject = (id: string) => {
    updateData("projects", data.projects.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => updateData("name", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => updateData("title", e.target.value)}
            placeholder="Full Stack Developer"
          />
        </div>
        
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={data.bio}
            onChange={(e) => updateData("bio", e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <Label>Skills</Label>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <Label>Projects</Label>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Add New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={newProject.title || ""}
              onChange={(e) => setNewProject({...newProject, title: e.target.value})}
              placeholder="Project title"
            />
            <Textarea
              value={newProject.description || ""}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Project description"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newProject.liveUrl || ""}
                onChange={(e) => setNewProject({...newProject, liveUrl: e.target.value})}
                placeholder="Live URL (optional)"
              />
              <Input
                value={newProject.githubUrl || ""}
                onChange={(e) => setNewProject({...newProject, githubUrl: e.target.value})}
                placeholder="GitHub URL (optional)"
              />
            </div>
            <Button onClick={addProject} size="sm" className="w-full">
              Add Project
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {data.projects.map((project) => (
            <Card key={project.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{project.title}</h4>
                  <X 
                    className="h-4 w-4 cursor-pointer hover:text-destructive" 
                    onClick={() => removeProject(project.id)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <Badge variant="outline" className="text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  )}
                  {project.githubUrl && (
                    <Badge variant="outline" className="text-xs">
                      <Github className="h-3 w-3 mr-1" />
                      Code
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <Label>Contact Information</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            value={data.contact.email}
            onChange={(e) => updateData("contact", {...data.contact, email: e.target.value})}
            placeholder="Email"
            type="email"
          />
          <Input
            value={data.contact.github}
            onChange={(e) => updateData("contact", {...data.contact, github: e.target.value})}
            placeholder="GitHub username"
          />
          <Input
            value={data.contact.linkedin}
            onChange={(e) => updateData("contact", {...data.contact, linkedin: e.target.value})}
            placeholder="LinkedIn username"
          />
          <Input
            value={data.contact.website}
            onChange={(e) => updateData("contact", {...data.contact, website: e.target.value})}
            placeholder="Personal website"
          />
        </div>
      </div>
    </div>
  );
};

export default PortfolioForm;