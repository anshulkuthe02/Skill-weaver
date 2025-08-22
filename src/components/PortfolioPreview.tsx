import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, ExternalLink, Mail, Linkedin, Globe, FileText, Download, Eye, Image, Video, Music } from "lucide-react";
import { PortfolioData } from "@/types/portfolio";

interface PortfolioPreviewProps {
  data: PortfolioData;
  template: string;
  fullView?: boolean;
}

const PortfolioPreview = ({ data, template, fullView = false }: PortfolioPreviewProps) => {
  const getTemplateStyle = () => {
    switch (template) {
      case "creative":
        return "bg-gradient-accent";
      case "professional":
        return "bg-secondary";
      case "developer":
        return "bg-gradient-secondary";
      default:
        return "bg-gradient-primary";
    }
  };

  if (!data.name) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Fill in your details to see the preview</p>
      </div>
    );
  }

  return (
    <div className={`${fullView ? "space-y-8" : "space-y-4 text-sm"} text-foreground`}>
      {/* Header */}
      <div className={`${getTemplateStyle()} rounded-lg p-6 text-center`}>
        <div className="w-16 h-16 bg-primary-foreground/20 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-foreground">
            {data.name.charAt(0)}
          </span>
        </div>
        <h1 className={`${fullView ? "text-3xl" : "text-xl"} font-bold text-primary-foreground mb-2`}>
          {data.name}
        </h1>
        <p className={`${fullView ? "text-lg" : "text-sm"} text-primary-foreground/80`}>
          {data.title}
        </p>
      </div>

      {/* Bio */}
      {data.bio && (
        <div className="space-y-2">
          <h2 className={`${fullView ? "text-xl" : "text-lg"} font-semibold`}>About</h2>
          <p className="text-muted-foreground">{data.bio}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="space-y-2">
          <h2 className={`${fullView ? "text-xl" : "text-lg"} font-semibold`}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className={fullView ? "" : "text-xs"}>
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="space-y-4">
          <h2 className={`${fullView ? "text-xl" : "text-lg"} font-semibold`}>Projects</h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <Card key={project.id} className="border-border/50">
                <CardContent className={`${fullView ? "p-6" : "p-4"} space-y-2`}>
                  <div className="flex justify-between items-start">
                    <h3 className={`${fullView ? "text-lg" : "text-base"} font-semibold`}>
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                          <Github className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className={`text-muted-foreground ${fullView ? "text-sm" : "text-xs"}`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Documents Section */}
      {data.documents && data.documents.length > 0 && (
        <div className="space-y-4">
          <h2 className={`${fullView ? "text-xl" : "text-lg"} font-semibold`}>Documents</h2>
          <div className="space-y-2">
            {data.documents.filter(doc => doc.isPublic).map((doc) => (
              <Card key={doc.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{doc.name}</span>
                        <Badge variant={doc.type === 'cv' ? 'default' : 'secondary'}>
                          {doc.type.toUpperCase()}
                        </Badge>
                        {data.resumeId === doc.id && (
                          <Badge variant="default">Primary</Badge>
                        )}
                      </div>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Media Gallery */}
      {data.media && data.media.length > 0 && (
        <div className="space-y-4">
          <h2 className={`${fullView ? "text-xl" : "text-lg"} font-semibold`}>Media Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.media.slice(0, fullView ? undefined : 6).map((media) => (
              <Card key={media.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {media.type === 'image' ? (
                    <img 
                      src={media.content} 
                      alt={media.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      {media.type === 'video' && <Video className="h-6 w-6" />}
                      {media.type === 'audio' && <Music className="h-6 w-6" />}
                      {media.type === 'document' && <FileText className="h-6 w-6" />}
                      <span className="text-xs mt-1">{media.type.toUpperCase()}</span>
                    </div>
                  )}
                </div>
                {fullView && (
                  <CardContent className="p-2">
                    <div className="text-sm font-medium truncate">{media.name}</div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="space-y-4">
        <h2 className={`${fullView ? "text-xl" : "text-lg"} font-semibold`}>Contact</h2>
        <div className="flex flex-wrap gap-2">
          {data.contact.email && (
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {fullView && "Email"}
            </Button>
          )}
          {data.contact.github && (
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              {fullView && "GitHub"}
            </Button>
          )}
          {data.contact.linkedin && (
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              {fullView && "LinkedIn"}
            </Button>
          )}
          {data.contact.website && (
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {fullView && "Website"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;