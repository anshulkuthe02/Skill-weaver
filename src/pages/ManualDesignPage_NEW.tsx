import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SketchPicker } from "react-color";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface ManualDesignPageProps {
  customCSS: string;
  onChange: (css: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  color: string;
  setColor: (color: string) => void;
  gradient: string;
  setGradient: (gradient: string) => void;
  footer: string;
  setFooter: (footer: string) => void;
  siteLength: number;
  setSiteLength: (length: number) => void;
  elements: Element[];
  setElements: (elements: Element[]) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
}

const themes = ["Light", "Dark", "Minimal", "Creative"];

const ManualDesignPage = ({
  customCSS, onChange, theme, setTheme, color, setColor, gradient, setGradient, footer, setFooter, siteLength, setSiteLength, elements, setElements, selectedElement, setSelectedElement
}: ManualDesignPageProps) => {

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string } | null>(null);
  const [canvasZoom, setCanvasZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addElement = (type: 'text' | 'shape' | 'image' | 'button' | 'divider' | 'icon' | 'video') => {
    const baseElement = {
      id: `element-${Date.now()}`,
      type,
      content: '',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#000000',
      backgroundColor: type === 'shape' || type === 'button' ? '#3b82f6' : 'transparent',
      borderColor: '#000000',
      borderWidth: type === 'button' || type === 'shape' ? 1 : 0,
      borderRadius: type === 'button' ? 8 : 0,
      lineHeight: 1.5,
      letterSpacing: 0,
      opacity: 1,
      rotation: 0,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowColor: '#000000'
    };

    let elementConfig: Partial<Element> = {};
    
    switch (type) {
      case 'text':
        elementConfig = {
          content: 'New Text',
          width: 200,
          height: 40
        };
        break;
      case 'shape':
        elementConfig = {
          content: '',
          width: 100,
          height: 100,
          backgroundColor: '#3b82f6'
        };
        break;
      case 'image':
        elementConfig = {
          content: '',
          width: 150,
          height: 150
        };
        break;
      case 'button':
        elementConfig = {
          content: 'Click Me',
          width: 120,
          height: 40,
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: 8
        };
        break;
      case 'divider':
        elementConfig = {
          content: '',
          width: 200,
          height: 2,
          backgroundColor: '#e5e7eb'
        };
        break;
      case 'icon':
        elementConfig = {
          content: '★',
          width: 40,
          height: 40,
          fontSize: 24
        };
        break;
      case 'video':
        elementConfig = {
          content: '',
          width: 300,
          height: 200
        };
        break;
    }

    const newElement: Element = { ...baseElement, ...elementConfig } as Element;
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  }, [elements, setElements]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElement) return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        setElements(elements.filter(el => el.id !== selectedElement));
        setSelectedElement(null);
      } else if (e.key === 'Escape') {
        setSelectedElement(null);
        setEditingElement(null);
      } else if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'c': {
            if (selectedElement) {
              const elementToCopy = elements.find(el => el.id === selectedElement);
              if (elementToCopy) {
                localStorage.setItem('copiedElement', JSON.stringify(elementToCopy));
              }
            }
            break;
          }
          case 'v': {
            e.preventDefault();
            const copiedElement = localStorage.getItem('copiedElement');
            if (copiedElement) {
              const parsed = JSON.parse(copiedElement);
              const newElement = {
                ...parsed,
                id: `element-${Date.now()}`,
                x: parsed.x + 20,
                y: parsed.y + 20
              };
              setElements([...elements, newElement]);
              setSelectedElement(newElement.id);
            }
            break;
          }
          case 'd': {
            e.preventDefault();
            if (selectedElement) {
              const elementToDuplicate = elements.find(el => el.id === selectedElement);
              if (elementToDuplicate) {
                const newElement = {
                  ...elementToDuplicate,
                  id: `element-${Date.now()}`,
                  x: elementToDuplicate.x + 20,
                  y: elementToDuplicate.y + 20
                };
                setElements([...elements, newElement]);
                setSelectedElement(newElement.id);
              }
            }
            break;
          }
        }
      } else if (selectedElement) {
        const moveDistance = e.shiftKey ? 10 : 1;
        const selectedEl = elements.find(el => el.id === selectedElement);
        if (selectedEl) {
          const updates: Partial<Element> = {};
          switch (e.key) {
            case 'ArrowUp':
              e.preventDefault();
              updates.y = Math.max(0, selectedEl.y - moveDistance);
              break;
            case 'ArrowDown':
              e.preventDefault();
              updates.y = selectedEl.y + moveDistance;
              break;
            case 'ArrowLeft':
              e.preventDefault();
              updates.x = Math.max(0, selectedEl.x - moveDistance);
              break;
            case 'ArrowRight':
              e.preventDefault();
              updates.x = selectedEl.x + moveDistance;
              break;
          }
          if (Object.keys(updates).length > 0) {
            updateElement(selectedElement, updates);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, elements, setElements, setSelectedElement, updateElement]);

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  const selectedEl = elements.find(el => el.id === selectedElement);
  
  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      {/* Left Sidebar with Tools and Editing */}
      <div className="w-1/3 bg-[#1a1a1a] shadow-2xl flex flex-col overflow-y-auto border-r border-[#333]">
        
        {/* Tool Icons */}
        <div className="bg-[#111111] p-4 border-b border-[#333]">
          <h3 className="text-white text-sm font-medium mb-3">Add Elements</h3>
          <div className="grid grid-cols-4 gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              title="Add Text" 
              className="text-white hover:bg-blue-600/40 border border-[#444] bg-[#2a2a2a] transition-all duration-200" 
              onClick={() => addElement('text')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5h7M5 5h.01M12 19h7M5 19h.01M8 5v14l4-7 4 7V5"/>
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              title="Add Shape" 
              className="text-white hover:bg-purple-600/40 border border-[#444] bg-[#2a2a2a] transition-all duration-200" 
              onClick={() => addElement('shape')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="4"/>
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              title="Add Button" 
              className="text-white hover:bg-green-600/40 border border-[#444] bg-[#2a2a2a] transition-all duration-200" 
              onClick={() => addElement('button')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="6" width="16" height="8" rx="4"/>
                <circle cx="12" cy="10" r="1"/>
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              title="Add Icon" 
              className="text-white hover:bg-yellow-600/40 border border-[#444] bg-[#2a2a2a] transition-all duration-200" 
              onClick={() => addElement('icon')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26"/>
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              title="Add Divider" 
              className="text-white hover:bg-orange-600/40 border border-[#444] bg-[#2a2a2a] transition-all duration-200" 
              onClick={() => addElement('divider')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="12" x2="20" y2="12"/>
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              title="Add Video" 
              className="text-white hover:bg-red-600/40 border border-[#444] bg-[#2a2a2a] transition-all duration-200" 
              onClick={() => addElement('video')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="12" rx="2"/>
                <polygon points="10,8 16,12 10,16"/>
              </svg>
            </Button>
            
            <label className="cursor-pointer">
              <Button variant="ghost" size="sm" title="Upload Image" className="text-white hover:bg-cyan-600/30 border border-[#444] bg-[#2a2a2a] w-full">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              </Button>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const imageUrl = event.target?.result as string;
                    const newElement: Element = {
                      id: `element-${Date.now()}`,
                      type: 'image',
                      content: imageUrl,
                      x: 100,
                      y: 100,
                      width: 200,
                      height: 150,
                      fontSize: 16,
                      fontFamily: 'Arial',
                      fontWeight: 'normal',
                      fontStyle: 'normal',
                      textDecoration: 'none',
                      color: '#000000',
                      backgroundColor: 'transparent',
                      borderColor: '#000000',
                      borderWidth: 0,
                      borderRadius: 0,
                      lineHeight: 1.5,
                      letterSpacing: 0,
                      opacity: 1,
                      rotation: 0,
                      shadowX: 0,
                      shadowY: 0,
                      shadowBlur: 0,
                      shadowColor: '#000000'
                    };
                    setElements([...elements, newElement]);
                    setSelectedElement(newElement.id);
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            </label>
            
            <Button variant="ghost" size="sm" title="Clear All" className="text-white hover:bg-red-600/30 border border-[#444] bg-[#2a2a2a]" onClick={() => {
              setElements([]);
              setSelectedElement(null);
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Element Properties */}
          {selectedEl && (
            <Card className="bg-[#2a2a2a] border-[#444] text-white">
              <CardHeader>
                <CardTitle className="text-yellow-400">Element Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-yellow-300">X Position</Label>
                    <Input type="number" value={selectedEl.x} 
                      onChange={e => updateElement(selectedEl.id, { x: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                  <div>
                    <Label className="text-yellow-300">Y Position</Label>
                    <Input type="number" value={selectedEl.y} 
                      onChange={e => updateElement(selectedEl.id, { y: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-yellow-300">Width</Label>
                    <Input type="number" value={selectedEl.width} 
                      onChange={e => updateElement(selectedEl.id, { width: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                  <div>
                    <Label className="text-yellow-300">Height</Label>
                    <Input type="number" value={selectedEl.height} 
                      onChange={e => updateElement(selectedEl.id, { height: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-yellow-300">Text Color</Label>
                    <Input type="color" value={selectedEl.color || '#000000'} 
                      onChange={e => updateElement(selectedEl.id, { color: e.target.value })} 
                      className="bg-[#1a1a1a] border-[#555] text-white h-10" />
                  </div>
                  <div>
                    <Label className="text-yellow-300">Background</Label>
                    <Input type="color" value={selectedEl.backgroundColor || '#ffffff'} 
                      onChange={e => updateElement(selectedEl.id, { backgroundColor: e.target.value })} 
                      className="bg-[#1a1a1a] border-[#555] text-white h-10" />
                  </div>
                </div>
                
                <Button onClick={() => deleteElement(selectedEl.id)} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Delete Element
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Text Properties */}
          {selectedEl && selectedEl.type === 'text' && (
            <Card className="bg-[#2a2a2a] border-[#444] text-white">
              <CardHeader>
                <CardTitle className="text-cyan-400">Text Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-cyan-300">Content</Label>
                  <Input 
                    value={selectedEl.content} 
                    onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                    className="bg-[#1a1a1a] border-[#555] text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-cyan-300">Font Size</Label>
                    <Input 
                      type="number" 
                      value={selectedEl.fontSize || 16} 
                      onChange={(e) => updateElement(selectedEl.id, { fontSize: Number(e.target.value) })}
                      className="bg-[#1a1a1a] border-[#555] text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-cyan-300">Font Family</Label>
                    <Select value={selectedEl.fontFamily || 'Arial'} onValueChange={(value) => updateElement(selectedEl.id, { fontFamily: value })}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#555] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#555]">
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={selectedEl.fontWeight === 'bold' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => updateElement(selectedEl.id, { fontWeight: selectedEl.fontWeight === 'bold' ? 'normal' : 'bold' })}
                    className="border-[#555] text-gray-300"
                  >
                    Bold
                  </Button>
                  <Button 
                    variant={selectedEl.fontStyle === 'italic' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => updateElement(selectedEl.id, { fontStyle: selectedEl.fontStyle === 'italic' ? 'normal' : 'italic' })}
                    className="border-[#555] text-gray-300"
                  >
                    Italic
                  </Button>
                  <Button 
                    variant={selectedEl.textDecoration === 'underline' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => updateElement(selectedEl.id, { textDecoration: selectedEl.textDecoration === 'underline' ? 'none' : 'underline' })}
                    className="border-[#555] text-gray-300"
                  >
                    Underline
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Theme Section */}
          <Card className="bg-[#2a2a2a] border-[#444] text-white">
            <CardHeader>
              <CardTitle className="text-purple-400">Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {themes.map(t => (
                  <Button key={t} variant={theme === t ? "default" : "outline"} 
                    className={theme === t ? "bg-purple-600 text-white" : "border-[#555] text-gray-300 hover:bg-purple-600/20"} 
                    onClick={() => setTheme(t)}>{t}</Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Section */}
          <Card className="bg-[#2a2a2a] border-[#444] text-white">
            <CardHeader>
              <CardTitle className="text-blue-400">Color</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center w-full">
                  <SketchPicker 
                    color={color} 
                    onChange={c => setColor(c.hex)} 
                    styles={{
                      default: {
                        picker: {
                          background: '#1a1a1a',
                          border: '1px solid #555',
                          borderRadius: '8px',
                          boxShadow: 'none',
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gradient Section */}
          <Card className="bg-[#2a2a2a] border-[#444] text-white">
            <CardHeader>
              <CardTitle className="text-green-400">Gradient Background</CardTitle>
            </CardHeader>
            <CardContent>
              <Input value={gradient} onChange={e => setGradient(e.target.value)} 
                placeholder="linear-gradient(45deg, #ff6b6b, #4ecdc4)" 
                className="bg-[#1a1a1a] border-[#555] text-white placeholder:text-gray-500" />
            </CardContent>
          </Card>

          {/* Footer Section */}
          <Card className="bg-[#2a2a2a] border-[#444] text-white">
            <CardHeader>
              <CardTitle className="text-orange-400">Footer</CardTitle>
            </CardHeader>
            <CardContent>
              <Input value={footer} onChange={e => setFooter(e.target.value)} 
                placeholder="© 2024 Your Company" 
                className="bg-[#1a1a1a] border-[#555] text-white placeholder:text-gray-500" />
            </CardContent>
          </Card>

          {/* Site Length Section */}
          <Card className="bg-[#2a2a2a] border-[#444] text-white">
            <CardHeader>
              <CardTitle className="text-pink-400">Site Length</CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="number" value={siteLength} onChange={e => setSiteLength(Number(e.target.value))} 
                placeholder="600" 
                className="bg-[#1a1a1a] border-[#555] text-white" />
            </CardContent>
          </Card>

          {/* Custom CSS Section */}
          <Card className="bg-[#2a2a2a] border-[#444] text-white">
            <CardHeader>
              <CardTitle className="text-red-400">Custom CSS</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={customCSS} onChange={e => onChange(e.target.value)} rows={6} 
                placeholder="Type your custom CSS here..." 
                className="bg-[#1a1a1a] border-[#555] text-white placeholder:text-gray-500 font-mono" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-[#0f0f0f] p-4">
        <Card className="h-full bg-[#2a2a2a] border-[#444] text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-400">Canvas Editor</CardTitle>
                <CardDescription className="text-gray-400">
                  Double-click text to edit • Drag to move • Use handles to resize
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="Zoom Out" 
                  className="text-white hover:bg-gray-600/30 border border-[#444] bg-[#2a2a2a] px-2"
                  onClick={() => setCanvasZoom(Math.max(0.25, canvasZoom - 0.25))}
                >
                  -
                </Button>
                <span className="text-xs text-gray-400 min-w-[3rem] text-center">
                  {Math.round(canvasZoom * 100)}%
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="Zoom In" 
                  className="text-white hover:bg-gray-600/30 border border-[#444] bg-[#2a2a2a] px-2"
                  onClick={() => setCanvasZoom(Math.min(3, canvasZoom + 0.25))}
                >
                  +
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="Reset Zoom" 
                  className="text-white hover:bg-gray-600/30 border border-[#444] bg-[#2a2a2a] px-3"
                  onClick={() => setCanvasZoom(1)}
                >
                  100%
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <div 
              ref={canvasRef}
              className="relative h-full min-h-[600px] bg-white overflow-hidden border-t border-[#444]"
              style={{
                transform: `scale(${canvasZoom})`,
                transformOrigin: 'top left',
                width: `${100 / canvasZoom}%`,
                height: `${100 / canvasZoom}%`
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElement(null);
                  setContextMenu(null);
                  setEditingElement(null);
                }
              }}
            >
              {/* Grid Background */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                  opacity: canvasZoom > 0.5 ? 0.3 : 0
                }}
              />
              
              {/* Sample content area indicator */}
              {elements.length === 0 && (
                <div className="absolute inset-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="text-lg font-medium">Start Creating</div>
                    <div className="text-sm">Add elements from the toolbar to begin designing</div>
                  </div>
                </div>
              )}
              
              {/* Render all elements */}
              {elements.map(element => (
                <ElementRenderer
                  key={element.id}
                  element={element}
                  isSelected={selectedElement === element.id}
                  isEditing={editingElement === element.id}
                  onSelect={() => {
                    setSelectedElement(element.id);
                    setContextMenu(null);
                  }}
                  onStartEdit={() => setEditingElement(element.id)}
                  onStopEdit={() => setEditingElement(null)}
                  onUpdate={(updates) => updateElement(element.id, updates)}
                  onDelete={() => deleteElement(element.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedElement(element.id);
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      elementId: element.id
                    });
                  }}
                  canvasZoom={canvasZoom}
                />
              ))}
              
              {/* Canvas Status Bar */}
              <div 
                className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2 text-xs text-white flex items-center gap-3 pointer-events-none"
              >
                <span>📏 {Math.round(canvasZoom * 100)}%</span>
                <span className="text-gray-400">|</span>
                <span>📦 {elements.length} elements</span>
                {selectedElement && (
                  <>
                    <span className="text-gray-400">|</span>
                    <span>🎯 {elements.find(el => el.id === selectedElement)?.type}</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50 min-w-[150px]"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-2">
            <button
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-600/30 flex items-center gap-2"
              onClick={() => {
                const elementToCopy = elements.find(el => el.id === contextMenu.elementId);
                if (elementToCopy) {
                  localStorage.setItem('copiedElement', JSON.stringify(elementToCopy));
                }
                setContextMenu(null);
              }}
            >
              📋 Copy
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-green-600/30 flex items-center gap-2"
              onClick={() => {
                const elementToDuplicate = elements.find(el => el.id === contextMenu.elementId);
                if (elementToDuplicate) {
                  const newElement = {
                    ...elementToDuplicate,
                    id: `element-${Date.now()}`,
                    x: elementToDuplicate.x + 20,
                    y: elementToDuplicate.y + 20
                  };
                  setElements([...elements, newElement]);
                  setSelectedElement(newElement.id);
                }
                setContextMenu(null);
              }}
            >
              📄 Duplicate
            </button>
            <hr className="my-1 border-gray-600" />
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600/30 flex items-center gap-2"
              onClick={() => {
                setElements(elements.filter(el => el.id !== contextMenu.elementId));
                if (selectedElement === contextMenu.elementId) {
                  setSelectedElement(null);
                }
                setContextMenu(null);
              }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Element Renderer Component
interface ElementRendererProps {
  element: Element;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onUpdate: (updates: Partial<Element>) => void;
  onDelete: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  canvasZoom: number;
}

const ElementRenderer = ({
  element,
  isSelected,
  isEditing,
  onSelect,
  onStartEdit,
  onStopEdit,
  onUpdate,
  onDelete,
  onContextMenu,
  canvasZoom
}: ElementRendererProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    e.preventDefault();
    e.stopPropagation();
    onSelect();

    const startX = e.clientX;
    const startY = e.clientY;
    const startElementX = element.x;
    const startElementY = element.y;

    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / canvasZoom;
      const deltaY = (e.clientY - startY) / canvasZoom;
      
      const newX = Math.max(0, startElementX + deltaX);
      const newY = Math.max(0, startElementY + deltaY);
      
      onUpdate({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === 'text' || element.type === 'button') {
      onStartEdit();
    }
  };

  const handleContentChange = (newContent: string) => {
    onUpdate({ content: newContent });
  };

  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    cursor: isDragging ? 'grabbing' : isSelected ? 'move' : 'pointer',
    border: isSelected ? '2px solid #3b82f6' : `${element.borderWidth || 0}px solid ${element.borderColor || 'transparent'}`,
    borderRadius: `${element.borderRadius || 0}px`,
    backgroundColor: element.backgroundColor || 'transparent',
    fontSize: element.fontSize || 16,
    fontFamily: element.fontFamily || 'Arial',
    fontWeight: element.fontWeight || 'normal',
    fontStyle: element.fontStyle || 'normal',
    textDecoration: element.textDecoration || 'none',
    color: element.color || '#000',
    lineHeight: element.lineHeight || 1.5,
    letterSpacing: `${element.letterSpacing || 0}px`,
    opacity: element.opacity || 1,
    transform: `rotate(${element.rotation || 0}deg)`,
    boxShadow: element.shadowBlur ? 
      `${element.shadowX || 0}px ${element.shadowY || 0}px ${element.shadowBlur}px ${element.shadowColor || '#000'}` : 
      isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
    zIndex: isSelected ? 100 : 1,
    transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    userSelect: isEditing ? 'text' : 'none'
  };

  return (
    <div
      style={elementStyle}
      onClick={onSelect}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onContextMenu={onContextMenu}
    >
      {/* Element Content */}
      {element.type === 'text' && (
        <div
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            padding: '8px',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            cursor: isEditing ? 'text' : 'inherit'
          }}
          onBlur={() => {
            handleContentChange((document.activeElement as HTMLElement)?.textContent || '');
            onStopEdit();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              (e.target as HTMLElement).blur();
            }
            if (e.key === 'Escape') {
              (e.target as HTMLElement).blur();
            }
          }}
        >
          {element.content || 'Text'}
        </div>
      )}
      
      {element.type === 'button' && (
        <div
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            cursor: isEditing ? 'text' : 'inherit'
          }}
          onBlur={() => {
            handleContentChange((document.activeElement as HTMLElement)?.textContent || '');
            onStopEdit();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              (e.target as HTMLElement).blur();
            }
            if (e.key === 'Escape') {
              (e.target as HTMLElement).blur();
            }
          }}
        >
          {element.content || 'Button'}
        </div>
      )}
      
      {element.type === 'image' && element.content && (
        <img 
          src={element.content} 
          alt="Element" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            borderRadius: 'inherit'
          }}
          draggable={false}
        />
      )}
      
      {element.type === 'shape' && (
        <div style={{ width: '100%', height: '100%' }} />
      )}
      
      {element.type === 'icon' && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: element.fontSize || 24
        }}>
          {element.content || '★'}
        </div>
      )}
      
      {element.type === 'divider' && (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: element.backgroundColor || '#e5e7eb'
        }} />
      )}
      
      {element.type === 'video' && (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '14px'
        }}>
          {element.content || 'Video Placeholder'}
        </div>
      )}
      
      {/* Resize Handles */}
      {isSelected && !isEditing && (
        <ResizeHandles 
          element={element} 
          onUpdate={onUpdate} 
          canvasZoom={canvasZoom}
        />
      )}
    </div>
  );
};

// Resize Handles Component
interface ResizeHandlesProps {
  element: Element;
  onUpdate: (updates: Partial<Element>) => void;
  canvasZoom: number;
}

const ResizeHandles = ({ element, onUpdate, canvasZoom }: ResizeHandlesProps) => {
  const handleResize = (direction: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    const startLeft = element.x;
    const startTop = element.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / canvasZoom;
      const deltaY = (e.clientY - startY) / canvasZoom;
      
      let updates: Partial<Element> = {};

      switch (direction) {
        case 'se': // Bottom-right
          updates = {
            width: Math.max(20, startWidth + deltaX),
            height: Math.max(20, startHeight + deltaY)
          };
          break;
        case 'sw': // Bottom-left
          updates = {
            width: Math.max(20, startWidth - deltaX),
            height: Math.max(20, startHeight + deltaY),
            x: startLeft + (startWidth - Math.max(20, startWidth - deltaX))
          };
          break;
        case 'ne': // Top-right
          updates = {
            width: Math.max(20, startWidth + deltaX),
            height: Math.max(20, startHeight - deltaY),
            y: startTop + (startHeight - Math.max(20, startHeight - deltaY))
          };
          break;
        case 'nw': // Top-left
          updates = {
            width: Math.max(20, startWidth - deltaX),
            height: Math.max(20, startHeight - deltaY),
            x: startLeft + (startWidth - Math.max(20, startWidth - deltaX)),
            y: startTop + (startHeight - Math.max(20, startHeight - deltaY))
          };
          break;
        case 'n': // Top
          updates = {
            height: Math.max(20, startHeight - deltaY),
            y: startTop + (startHeight - Math.max(20, startHeight - deltaY))
          };
          break;
        case 's': // Bottom
          updates = {
            height: Math.max(20, startHeight + deltaY)
          };
          break;
        case 'e': // Right
          updates = {
            width: Math.max(20, startWidth + deltaX)
          };
          break;
        case 'w': // Left
          updates = {
            width: Math.max(20, startWidth - deltaX),
            x: startLeft + (startWidth - Math.max(20, startWidth - deltaX))
          };
          break;
      }

      onUpdate(updates);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleStyle = {
    position: 'absolute' as const,
    backgroundColor: '#3b82f6',
    border: '2px solid white',
    borderRadius: '3px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  };

  const cornerSize = 8;
  const edgeSize = 6;

  return (
    <>
      {/* Corner handles */}
      <div
        style={{
          ...handleStyle,
          top: -cornerSize/2,
          left: -cornerSize/2,
          width: cornerSize,
          height: cornerSize,
          cursor: 'nw-resize'
        }}
        onMouseDown={(e) => handleResize('nw', e)}
      />
      <div
        style={{
          ...handleStyle,
          top: -cornerSize/2,
          right: -cornerSize/2,
          width: cornerSize,
          height: cornerSize,
          cursor: 'ne-resize'
        }}
        onMouseDown={(e) => handleResize('ne', e)}
      />
      <div
        style={{
          ...handleStyle,
          bottom: -cornerSize/2,
          left: -cornerSize/2,
          width: cornerSize,
          height: cornerSize,
          cursor: 'sw-resize'
        }}
        onMouseDown={(e) => handleResize('sw', e)}
      />
      <div
        style={{
          ...handleStyle,
          bottom: -cornerSize/2,
          right: -cornerSize/2,
          width: cornerSize,
          height: cornerSize,
          cursor: 'se-resize'
        }}
        onMouseDown={(e) => handleResize('se', e)}
      />
      
      {/* Edge handles */}
      <div
        style={{
          ...handleStyle,
          top: -edgeSize/2,
          left: '50%',
          transform: 'translateX(-50%)',
          width: edgeSize,
          height: edgeSize,
          cursor: 'n-resize'
        }}
        onMouseDown={(e) => handleResize('n', e)}
      />
      <div
        style={{
          ...handleStyle,
          bottom: -edgeSize/2,
          left: '50%',
          transform: 'translateX(-50%)',
          width: edgeSize,
          height: edgeSize,
          cursor: 's-resize'
        }}
        onMouseDown={(e) => handleResize('s', e)}
      />
      <div
        style={{
          ...handleStyle,
          top: '50%',
          left: -edgeSize/2,
          transform: 'translateY(-50%)',
          width: edgeSize,
          height: edgeSize,
          cursor: 'w-resize'
        }}
        onMouseDown={(e) => handleResize('w', e)}
      />
      <div
        style={{
          ...handleStyle,
          top: '50%',
          right: -edgeSize/2,
          transform: 'translateY(-50%)',
          width: edgeSize,
          height: edgeSize,
          cursor: 'e-resize'
        }}
        onMouseDown={(e) => handleResize('e', e)}
      />
    </>
  );
};

export default ManualDesignPage;
