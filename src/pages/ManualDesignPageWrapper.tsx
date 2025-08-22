import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ManualDesignPage from "./ManualDesignPage";

interface Element {
  id: string;
  type: 'text' | 'shape' | 'image' | 'button' | 'divider' | 'icon' | 'video';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  lineHeight?: number;
  letterSpacing?: number;
  opacity?: number;
  rotation?: number;
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
  shadowColor?: string;
}

interface TemplateData {
  id: string;
  name: string;
  category: string;
  data: {
    id: string;
    name: string;
    description: string;
    category: string;
    rating?: number;
    downloads?: string;
    popular?: boolean;
    featured?: boolean;
    difficulty?: string;
    features?: string[];
  };
}

const ManualDesignPageWrapper = () => {
  const location = useLocation();
  const [customCSS, setCustomCSS] = useState("");
  const [theme, setTheme] = useState("Light");
  const [color, setColor] = useState("#000000");
  const [gradient, setGradient] = useState("");
  const [footer, setFooter] = useState("");
  const [siteLength, setSiteLength] = useState(1200);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);

  const applyTemplateSettings = useCallback((templateData: TemplateData) => {
    // Set default template-based configurations
    switch (templateData.category) {
      case 'Developer':
        setTheme("Dark");
        setColor("#00ff88");
        setGradient("linear-gradient(135deg, #0f0f23, #1a1a2e)");
        setSiteLength(1400);
        setElements([
          {
            id: "dev-header-1",
            type: "text",
            content: "John Developer",
            x: 60,
            y: 80,
            width: 400,
            height: 60,
            fontSize: 36,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: "bold",
            color: "#00ff88",
            backgroundColor: "transparent",
            borderWidth: 0,
            borderRadius: 0,
            opacity: 1,
            rotation: 0
          },
          {
            id: "dev-subtitle-1", 
            type: "text",
            content: "Full Stack Developer & Code Enthusiast",
            x: 60,
            y: 150,
            width: 500,
            height: 40,
            fontSize: 18,
            fontFamily: "Arial",
            fontWeight: "normal",
            color: "#a0a0a0",
            backgroundColor: "transparent",
            opacity: 0.9
          },
          {
            id: "dev-bio-1", 
            type: "text",
            content: "Passionate about creating amazing web experiences with modern technologies. I love solving complex problems and building scalable applications.",
            x: 60,
            y: 220,
            width: 600,
            height: 100,
            fontSize: 16,
            fontFamily: "Arial",
            fontWeight: "normal",
            color: "#ffffff",
            backgroundColor: "transparent",
            lineHeight: 1.6
          },
          {
            id: "dev-skills-header",
            type: "text",
            content: "Tech Stack",
            x: 60,
            y: 360,
            width: 200,
            height: 40,
            fontSize: 24,
            fontFamily: "Arial",
            fontWeight: "600",
            color: "#00ff88",
            backgroundColor: "transparent"
          },
          {
            id: "dev-code-block",
            type: "shape",
            content: "",
            x: 60,
            y: 420,
            width: 400,
            height: 200,
            backgroundColor: "#1e1e1e",
            borderColor: "#00ff88",
            borderWidth: 2,
            borderRadius: 8,
            opacity: 0.9
          },
          {
            id: "dev-code-text",
            type: "text",
            content: "const skills = {\n  frontend: ['React', 'TypeScript'],\n  backend: ['Node.js', 'Python'],\n  database: ['PostgreSQL', 'MongoDB']\n};",
            x: 80,
            y: 450,
            width: 360,
            height: 140,
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: "normal",
            color: "#ffffff",
            backgroundColor: "transparent",
            lineHeight: 1.4
          }
        ]);
        break;
        
      case 'Creative':
        setTheme("Light");
        setColor("#ff6b6b");
        setGradient("linear-gradient(135deg, #667eea, #764ba2, #f093fb)");
        setSiteLength(1600);
        setElements([
          {
            id: "creative-header",
            type: "text", 
            content: "Sarah Artist",
            x: 100,
            y: 120,
            width: 400,
            height: 80,
            fontSize: 42,
            fontFamily: "Georgia, serif",
            fontWeight: "normal",
            fontStyle: "italic",
            color: "#ffffff",
            backgroundColor: "transparent",
            opacity: 1,
            shadowX: 2,
            shadowY: 2,
            shadowBlur: 8,
            shadowColor: "rgba(0,0,0,0.3)"
          },
          {
            id: "creative-subtitle",
            type: "text",
            content: "Visual Designer & Creative Director",
            x: 100,
            y: 210,
            width: 450,
            height: 50,
            fontSize: 20,
            fontFamily: "Arial",
            fontWeight: "300",
            color: "#ffffff",
            backgroundColor: "transparent",
            opacity: 0.95
          },
          {
            id: "creative-shape-1",
            type: "shape",
            content: "",
            x: 80,
            y: 320,
            width: 120,
            height: 120,
            backgroundColor: "#ff6b6b",
            borderRadius: 60,
            opacity: 0.8,
            rotation: 15
          },
          {
            id: "creative-shape-2",
            type: "shape",
            content: "",
            x: 220,
            y: 350,
            width: 100,
            height: 100,
            backgroundColor: "#4ecdc4",
            borderRadius: 20,
            opacity: 0.7,
            rotation: -10
          },
          {
            id: "creative-shape-3",
            type: "shape",
            content: "",
            x: 340,
            y: 330,
            width: 80,
            height: 80,
            backgroundColor: "#ffe66d",
            borderRadius: 40,
            opacity: 0.6,
            rotation: 25
          },
          {
            id: "creative-bio",
            type: "text",
            content: "I believe in the power of visual storytelling. My work spans across digital design, branding, and creative strategy.",
            x: 100,
            y: 480,
            width: 500,
            height: 80,
            fontSize: 18,
            fontFamily: "Georgia, serif",
            fontWeight: "normal",
            color: "#ffffff",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            lineHeight: 1.5,
            opacity: 0.9
          }
        ]);
        break;
        
      case 'Business':
        setTheme("Minimal");
        setColor("#2c3e50");
        setGradient("linear-gradient(135deg, #f5f7fa, #c3cfe2)");
        setSiteLength(1200);
        setElements([
          {
            id: "business-header",
            type: "text",
            content: "Michael Johnson",
            x: 80,
            y: 100,
            width: 400,
            height: 60,
            fontSize: 32,
            fontFamily: "Arial, sans-serif",
            fontWeight: "700",
            color: "#2c3e50",
            backgroundColor: "transparent"
          },
          {
            id: "business-title",
            type: "text",
            content: "Senior Business Consultant",
            x: 80,
            y: 170,
            width: 350,
            height: 40,
            fontSize: 18,
            fontFamily: "Arial",
            fontWeight: "400",
            color: "#34495e",
            backgroundColor: "transparent"
          },
          {
            id: "business-divider",
            type: "divider",
            content: "",
            x: 80,
            y: 230,
            width: 300,
            height: 3,
            backgroundColor: "#3498db"
          },
          {
            id: "business-bio",
            type: "text",
            content: "Experienced business strategist with 10+ years helping companies optimize operations and drive growth.",
            x: 80,
            y: 260,
            width: 500,
            height: 60,
            fontSize: 16,
            fontFamily: "Arial",
            fontWeight: "normal",
            color: "#2c3e50",
            backgroundColor: "transparent",
            lineHeight: 1.5
          },
          {
            id: "business-button-1",
            type: "button",
            content: "Contact Me",
            x: 80,
            y: 350,
            width: 140,
            height: 45,
            fontSize: 16,
            fontFamily: "Arial",
            fontWeight: "600",
            color: "#ffffff",
            backgroundColor: "#3498db",
            borderRadius: 8,
            borderWidth: 0
          },
          {
            id: "business-button-2",
            type: "button",
            content: "View Portfolio",
            x: 240,
            y: 350,
            width: 140,
            height: 45,
            fontSize: 16,
            fontFamily: "Arial",
            fontWeight: "600",
            color: "#3498db",
            backgroundColor: "transparent",
            borderColor: "#3498db",
            borderWidth: 2,
            borderRadius: 8
          }
        ]);
        break;
        
      default:
        // Modern template (default)
        setTheme("Light");
        setColor("#3b82f6");
        setGradient("linear-gradient(135deg, #667eea, #764ba2)");
        setSiteLength(1300);
        setElements([
          {
            id: "modern-header",
            type: "text",
            content: "Alex Modern",
            x: 80,
            y: 100,
            width: 350,
            height: 60,
            fontSize: 38,
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
            color: "#ffffff",
            backgroundColor: "transparent",
            shadowX: 1,
            shadowY: 1,
            shadowBlur: 4,
            shadowColor: "rgba(0,0,0,0.2)"
          },
          {
            id: "modern-subtitle",
            type: "text",
            content: "UX/UI Designer",
            x: 80,
            y: 170,
            width: 300,
            height: 40,
            fontSize: 20,
            fontFamily: "Inter, sans-serif",
            fontWeight: "400",
            color: "#e2e8f0",
            backgroundColor: "transparent",
            opacity: 0.9
          },
          {
            id: "modern-card",
            type: "shape",
            content: "",
            x: 80,
            y: 240,
            width: 450,
            height: 200,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 16,
            borderColor: "rgba(255,255,255,0.2)",
            borderWidth: 1,
            opacity: 0.9
          },
          {
            id: "modern-bio",
            type: "text",
            content: "Designing beautiful and functional user experiences with a focus on accessibility and modern design principles.",
            x: 110,
            y: 280,
            width: 390,
            height: 120,
            fontSize: 16,
            fontFamily: "Inter, sans-serif",
            fontWeight: "normal",
            color: "#ffffff",
            backgroundColor: "transparent",
            lineHeight: 1.6,
            opacity: 0.95
          }
        ]);
        break;
    }
    
    console.log(`✅ Applied ${templateData.category} template settings`);
  }, []);

  useEffect(() => {
    // Check if template data was passed from navigation
    if (location.state && location.state.templateData) {
      const templateData = location.state.templateData as TemplateData;
      setSelectedTemplate(templateData);
      
      console.log('📄 Template selected for manual editing:', templateData.name);
      
      // Apply template-specific settings
      applyTemplateSettings(templateData);
    }
  }, [location.state, applyTemplateSettings]);

  return (
    <div className="min-h-screen bg-background">
      {selectedTemplate && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Editing: {selectedTemplate.name}
              </h2>
              <p className="text-sm text-blue-700">
                Category: <span className="font-medium">{selectedTemplate.category}</span> • 
                Template ID: {selectedTemplate.id} • 
                <span className="text-green-600 font-medium">Elements loaded successfully</span>
              </p>
            </div>
            <div className="text-sm text-white bg-green-500 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Template Active
            </div>
          </div>
        </div>
      )}
      
      <ManualDesignPage
        customCSS={customCSS}
        onChange={setCustomCSS}
        theme={theme}
        setTheme={setTheme}
        color={color}
        setColor={setColor}
        gradient={gradient}
        setGradient={setGradient}
        footer={footer}
        setFooter={setFooter}
        siteLength={siteLength}
        setSiteLength={setSiteLength}
        elements={elements}
        setElements={setElements}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
      />
    </div>
  );
};

export default ManualDesignPageWrapper;
