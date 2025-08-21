import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateSelectionProps {
  selectedTemplate: string;
  onTemplateSelect: (template: string) => void;
}

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and minimalist design with bold typography",
    preview: "🎨"
  },
  {
    id: "creative",
    name: "Creative",
    description: "Vibrant colors and unique layouts for designers",
    preview: "🌈"
  },
  {
    id: "professional",
    name: "Professional", 
    description: "Corporate-friendly design for business use",
    preview: "💼"
  },
  {
    id: "developer",
    name: "Developer",
    description: "Code-focused layout with terminal aesthetics",
    preview: "⚡"
  }
];

const TemplateSelection = ({ selectedTemplate, onTemplateSelect }: TemplateSelectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card 
          key={template.id}
          className={cn(
            "cursor-pointer transition-all duration-300 hover:shadow-glow border-2",
            selectedTemplate === template.id 
              ? "border-accent shadow-glow" 
              : "border-border hover:border-accent/50"
          )}
          onClick={() => onTemplateSelect(template.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="text-2xl">{template.preview}</div>
              {selectedTemplate === template.id && (
                <div className="rounded-full bg-accent p-1">
                  <Check className="h-3 w-3 text-accent-foreground" />
                </div>
              )}
            </div>
            <h3 className="font-semibold mb-1">{template.name}</h3>
            <p className="text-xs text-muted-foreground">{template.description}</p>
            {selectedTemplate === template.id && (
              <Badge variant="secondary" className="mt-2 text-xs">
                Selected
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TemplateSelection;