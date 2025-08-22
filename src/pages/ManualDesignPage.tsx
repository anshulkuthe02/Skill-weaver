import { useState } from "react";
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

  const addElement = (type: 'text' | 'shape' | 'image' | 'button' | 'divider' | 'icon' | 'video') => {
    const baseElement = {
      id: Date.now().toString(),
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
      backgroundColor: type === 'shape' || type === 'button' ? '#cccccc' : 'transparent',
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
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

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
          <div className="grid grid-cols-4 gap-2">
            <Button variant="ghost" size="sm" title="Insert Text" className="text-white hover:bg-blue-600/30 border border-[#444] bg-[#2a2a2a]" onClick={() => addElement('text')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="8" width="16" height="8" rx="2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </Button>
            <Button variant="ghost" size="sm" title="Insert Shape" className="text-white hover:bg-purple-600/30 border border-[#444] bg-[#2a2a2a]" onClick={() => addElement('shape')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="4"/></svg>
            </Button>
            <Button variant="ghost" size="sm" title="Insert Button" className="text-white hover:bg-green-600/30 border border-[#444] bg-[#2a2a2a]" onClick={() => addElement('button')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="6" width="16" height="8" rx="4"/><circle cx="12" cy="10" r="1"/></svg>
            </Button>
            <Button variant="ghost" size="sm" title="Insert Icon" className="text-white hover:bg-yellow-600/30 border border-[#444] bg-[#2a2a2a]" onClick={() => addElement('icon')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26"/></svg>
            </Button>
            <Button variant="ghost" size="sm" title="Insert Divider" className="text-white hover:bg-orange-600/30 border border-[#444] bg-[#2a2a2a]" onClick={() => addElement('divider')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/></svg>
            </Button>
            <Button variant="ghost" size="sm" title="Insert Video" className="text-white hover:bg-red-600/30 border border-[#444] bg-[#2a2a2a]" onClick={() => addElement('video')}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="12" rx="2"/><polygon points="10,8 16,12 10,16"/></svg>
            </Button>
            <label className="cursor-pointer">
              <Button variant="ghost" size="sm" title="Upload Image" className="text-white hover:bg-cyan-600/30 border border-[#444] bg-[#2a2a2a] w-full">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
              </Button>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const imageUrl = event.target?.result as string;
                    const newElement: Element = {
                      id: Date.now().toString(),
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
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            </label>
            <Button variant="ghost" size="sm" title="Clear All" className="text-white hover:bg-red-600/30 border border-[#444] bg-[#2a2a2a]" onClick={() => {
              setElements([]);
              setSelectedElement(null);
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/></svg>
            </Button>
          </div>
        </div>
        
        {/* Editing Panels */}
        <div className="p-6 space-y-6">
          {/* Text Editing Section - Only show when text element is selected */}
          {selectedEl && selectedEl.type === 'text' && (
            <Card className="bg-[#2a2a2a] border-[#444] text-white">
              <CardHeader>
                <CardTitle className="text-pink-400">Text Editing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-pink-300">Content</Label>
                  <Input value={selectedEl.content} onChange={e => updateElement(selectedEl.id, { content: e.target.value })} 
                    className="bg-[#1a1a1a] border-[#555] text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-pink-300">Font Size</Label>
                    <Input type="number" value={selectedEl.fontSize || 16} onChange={e => updateElement(selectedEl.id, { fontSize: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                  <div>
                    <Label className="text-pink-300">Font Family</Label>
                    <Select value={selectedEl.fontFamily || 'Arial'} onValueChange={v => updateElement(selectedEl.id, { fontFamily: v })}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#555] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={selectedEl.fontWeight === 'bold' ? 'default' : 'outline'} 
                    onClick={() => updateElement(selectedEl.id, { fontWeight: selectedEl.fontWeight === 'bold' ? 'normal' : 'bold' })}
                    className="bg-[#333] text-white border-[#555]">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4h2a4 4 0 0 1 0 8H6V4zM6 12h3a4 4 0 0 1 0 8H6v-8z"/></svg>
                  </Button>
                  <Button size="sm" variant={selectedEl.fontStyle === 'italic' ? 'default' : 'outline'} 
                    onClick={() => updateElement(selectedEl.id, { fontStyle: selectedEl.fontStyle === 'italic' ? 'normal' : 'italic' })}
                    className="bg-[#333] text-white border-[#555]">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                  </Button>
                  <Button size="sm" variant={selectedEl.textDecoration === 'underline' ? 'default' : 'outline'} 
                    onClick={() => updateElement(selectedEl.id, { textDecoration: selectedEl.textDecoration === 'underline' ? 'none' : 'underline' })}
                    className="bg-[#333] text-white border-[#555]">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16"/></svg>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-pink-300">Line Height</Label>
                    <Input type="number" step="0.1" value={selectedEl.lineHeight || 1.5} onChange={e => updateElement(selectedEl.id, { lineHeight: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                  <div>
                    <Label className="text-pink-300">Letter Spacing</Label>
                    <Input type="number" step="0.1" value={selectedEl.letterSpacing || 0} onChange={e => updateElement(selectedEl.id, { letterSpacing: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                </div>
                <div>
                  <Label className="text-pink-300">Text Color</Label>
                  <Input type="color" value={selectedEl.color || '#000000'} onChange={e => updateElement(selectedEl.id, { color: e.target.value })} 
                    className="bg-[#1a1a1a] border-[#555] text-white h-10" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Element Properties Section */}
          {selectedEl && (
            <Card className="bg-[#2a2a2a] border-[#444] text-white">
              <CardHeader>
                <CardTitle className="text-yellow-400">Element Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-yellow-300">Width</Label>
                    <Input type="number" value={selectedEl.width} onChange={e => updateElement(selectedEl.id, { width: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                  <div>
                    <Label className="text-yellow-300">Height</Label>
                    <Input type="number" value={selectedEl.height} onChange={e => updateElement(selectedEl.id, { height: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-yellow-300">X Position</Label>
                    <Input type="number" value={selectedEl.x} onChange={e => updateElement(selectedEl.id, { x: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                  <div>
                    <Label className="text-yellow-300">Y Position</Label>
                    <Input type="number" value={selectedEl.y} onChange={e => updateElement(selectedEl.id, { y: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                </div>
                
                {/* Background and Border Properties */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-yellow-300">Background Color</Label>
                    <Input type="color" value={selectedEl.backgroundColor || '#ffffff'} 
                      onChange={e => updateElement(selectedEl.id, { backgroundColor: e.target.value })} 
                      className="bg-[#1a1a1a] border-[#555] text-white h-10" />
                  </div>
                  <div>
                    <Label className="text-yellow-300">Border Color</Label>
                    <Input type="color" value={selectedEl.borderColor || '#000000'} 
                      onChange={e => updateElement(selectedEl.id, { borderColor: e.target.value })} 
                      className="bg-[#1a1a1a] border-[#555] text-white h-10" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-yellow-300">Border Width</Label>
                    <Input type="number" min="0" value={selectedEl.borderWidth || 0} 
                      onChange={e => updateElement(selectedEl.id, { borderWidth: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                  <div>
                    <Label className="text-yellow-300">Border Radius</Label>
                    <Input type="number" min="0" value={selectedEl.borderRadius || 0} 
                      onChange={e => updateElement(selectedEl.id, { borderRadius: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-yellow-300">Opacity</Label>
                    <Input type="number" min="0" max="1" step="0.1" value={selectedEl.opacity || 1} 
                      onChange={e => updateElement(selectedEl.id, { opacity: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                  <div>
                    <Label className="text-yellow-300">Rotation (deg)</Label>
                    <Input type="number" value={selectedEl.rotation || 0} 
                      onChange={e => updateElement(selectedEl.id, { rotation: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                  </div>
                </div>
                
                {/* Shadow Properties */}
                <div>
                  <Label className="text-yellow-300">Shadow</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input type="number" placeholder="X" value={selectedEl.shadowX || 0} 
                      onChange={e => updateElement(selectedEl.id, { shadowX: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                    <Input type="number" placeholder="Y" value={selectedEl.shadowY || 0} 
                      onChange={e => updateElement(selectedEl.id, { shadowY: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                    <Input type="number" placeholder="Blur" value={selectedEl.shadowBlur || 0} 
                      onChange={e => updateElement(selectedEl.id, { shadowBlur: Number(e.target.value) })} 
                      className="bg-[#1a1a1a] border-[#555] text-white" />
                    <Input type="color" value={selectedEl.shadowColor || '#000000'} 
                      onChange={e => updateElement(selectedEl.id, { shadowColor: e.target.value })} 
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

          {/* Text Editing Section */}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-cyan-300">Line Height</Label>
                    <Input 
                      type="number" 
                      step="0.1"
                      value={selectedEl.lineHeight || 1.5} 
                      onChange={(e) => updateElement(selectedEl.id, { lineHeight: Number(e.target.value) })}
                      className="bg-[#1a1a1a] border-[#555] text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-cyan-300">Letter Spacing</Label>
                    <Input 
                      type="number" 
                      step="0.1"
                      value={selectedEl.letterSpacing || 0} 
                      onChange={(e) => updateElement(selectedEl.id, { letterSpacing: Number(e.target.value) })}
                      className="bg-[#1a1a1a] border-[#555] text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                          fontFamily: 'inherit'
                        },
                        saturation: {
                          borderRadius: '4px'
                        },
                        hue: {
                          borderRadius: '4px'
                        },
                        alpha: {
                          borderRadius: '4px'
                        }
                      }
                    }}
                  />
                </div>
                <div>
                  <Label className="text-blue-300">Gradient (CSS)</Label>
                  <Input value={gradient} onChange={e => setGradient(e.target.value)} 
                    placeholder="e.g. linear-gradient(90deg, #e66465, #9198e5)" 
                    className="bg-[#1a1a1a] border-[#555] text-white placeholder:text-gray-500 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#2a2a2a] border-[#444] text-white">
            <CardHeader>
              <CardTitle className="text-green-400">Site Length</CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="number" value={siteLength} onChange={e => setSiteLength(Number(e.target.value))} 
                min={500} max={5000} 
                className="bg-[#1a1a1a] border-[#555] text-white" />
            </CardContent>
          </Card>
          <Card className="bg-[#2a2a2a] border-[#444] text-white">
            <CardHeader>
              <CardTitle className="text-orange-400">Footer</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={footer} onChange={e => setFooter(e.target.value)} rows={3} 
                placeholder="Footer text or HTML" 
                className="bg-[#1a1a1a] border-[#555] text-white placeholder:text-gray-500" />
            </CardContent>
          </Card>
          
          {/* Layers Panel */}
          <Card className="bg-[#2a2a2a] border-[#444] text-white">
            <CardHeader>
              <CardTitle className="text-indigo-400">Layers ({elements.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-48 overflow-y-auto">
              {elements.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No elements yet</p>
              ) : (
                elements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedElement === element.id 
                        ? 'bg-indigo-600/30 border border-indigo-400' 
                        : 'bg-[#1a1a1a] border border-[#444] hover:bg-[#333]'
                    }`}
                    onClick={() => setSelectedElement(element.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">#{elements.length - index}</span>
                        <span className="text-sm capitalize">{element.type}</span>
                        {element.content && (
                          <span className="text-xs text-gray-500 truncate max-w-20">
                            {element.content.length > 15 ? element.content.substring(0, 15) + '...' : element.content}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            const duplicated = { ...element, id: Date.now().toString(), x: element.x + 20, y: element.y + 20 };
                            setElements([...elements, duplicated]);
                          }}
                          title="Duplicate"
                        >
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="14" height="14" rx="2" ry="2"/>
                            <path d="M7,3V1a2,2 0 0,1,2-2h8a2,2 0 0,1,2,2v8a2,2 0 0,1-2,2H15"/>
                          </svg>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(element.id);
                          }}
                          title="Delete"
                        >
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          
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

      {/* Main Canvas/Preview */}
      <div className="flex-1 p-12 bg-[#0f0f0f]">
        <Card className="bg-[#1a1a1a] border-[#333] text-white">
          <CardHeader>
            <CardTitle className="text-cyan-400">Editable Canvas</CardTitle>
            <CardDescription className="text-gray-400">Click to select and edit elements</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              style={{
                background: gradient || color,
                minHeight: siteLength,
                color: theme === "Dark" ? "#fff" : "#222",
                padding: 32,
                borderRadius: 16,
                transition: "all 0.3s",
                position: "relative",
                overflow: "hidden"
              }}
              onClick={() => setSelectedElement(null)}
            >
              {/* Render all elements */}
              {elements.map(element => (
                <div
                  key={element.id}
                  style={{
                    position: "absolute",
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    cursor: "move",
                    border: selectedElement === element.id ? "2px solid #00bcd4" : `${element.borderWidth || 0}px solid ${element.borderColor || 'transparent'}`,
                    borderRadius: `${element.borderRadius || 0}px`,
                    backgroundColor: element.backgroundColor || 'transparent',
                    display: "flex",
                    alignItems: element.type === 'divider' ? 'flex-start' : 'center',
                    justifyContent: "center",
                    fontSize: element.fontSize || 16,
                    fontFamily: element.fontFamily || 'Arial',
                    fontWeight: element.fontWeight || 'normal',
                    fontStyle: element.fontStyle || 'normal',
                    textDecoration: element.textDecoration || 'none',
                    color: element.color || '#000',
                    lineHeight: element.lineHeight || 1.5,
                    letterSpacing: `${element.letterSpacing || 0}px`,
                    padding: ['text', 'button'].includes(element.type) ? '8px' : '0',
                    wordWrap: 'break-word',
                    overflow: 'hidden',
                    opacity: element.opacity || 1,
                    transform: `rotate(${element.rotation || 0}deg)`,
                    boxShadow: element.shadowBlur ? `${element.shadowX || 0}px ${element.shadowY || 0}px ${element.shadowBlur}px ${element.shadowColor || '#000'}` : 'none',
                    userSelect: 'none'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement(element.id);
                  }}
                  onMouseDown={(e) => {
                    if (e.target !== e.currentTarget) return; // Prevent drag when clicking on content
                    e.preventDefault();
                    const startX = e.clientX - element.x;
                    const startY = e.clientY - element.y;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      updateElement(element.id, {
                        x: Math.max(0, e.clientX - startX),
                        y: Math.max(0, e.clientY - startY)
                      });
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                >
                  {/* Element Content */}
                  {element.type === 'text' && (
                    <div
                      contentEditable
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        updateElement(element.id, { content: e.target.textContent || '' });
                      }}
                      style={{
                        outline: 'none',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'text'
                      }}
                    >
                      {element.content}
                    </div>
                  )}
                  
                  {element.type === 'button' && (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      {element.content}
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
                        borderRadius: `${element.borderRadius || 0}px`
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
                  
                  {/* Resize Handles - Only show when selected */}
                  {selectedElement === element.id && (
                    <>
                      {/* Corner resize handles */}
                      <div
                        style={{
                          position: 'absolute',
                          top: -4,
                          left: -4,
                          width: 8,
                          height: 8,
                          backgroundColor: '#00bcd4',
                          cursor: 'nw-resize',
                          border: '1px solid #fff'
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const startWidth = element.width;
                          const startHeight = element.height;
                          const startLeft = element.x;
                          const startTop = element.y;
                          
                          const handleMouseMove = (e: MouseEvent) => {
                            const deltaX = e.clientX - startX;
                            const deltaY = e.clientY - startY;
                            const newWidth = Math.max(20, startWidth - deltaX);
                            const newHeight = Math.max(20, startHeight - deltaY);
                            const newX = startLeft + (startWidth - newWidth);
                            const newY = startTop + (startHeight - newHeight);
                            
                            updateElement(element.id, {
                              width: newWidth,
                              height: newHeight,
                              x: newX,
                              y: newY
                            });
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 8,
                          height: 8,
                          backgroundColor: '#00bcd4',
                          cursor: 'ne-resize',
                          border: '1px solid #fff'
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const startWidth = element.width;
                          const startHeight = element.height;
                          const startTop = element.y;
                          
                          const handleMouseMove = (e: MouseEvent) => {
                            const deltaX = e.clientX - startX;
                            const deltaY = e.clientY - startY;
                            const newWidth = Math.max(20, startWidth + deltaX);
                            const newHeight = Math.max(20, startHeight - deltaY);
                            const newY = startTop + (startHeight - newHeight);
                            
                            updateElement(element.id, {
                              width: newWidth,
                              height: newHeight,
                              y: newY
                            });
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: -4,
                          left: -4,
                          width: 8,
                          height: 8,
                          backgroundColor: '#00bcd4',
                          cursor: 'sw-resize',
                          border: '1px solid #fff'
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const startWidth = element.width;
                          const startHeight = element.height;
                          const startLeft = element.x;
                          
                          const handleMouseMove = (e: MouseEvent) => {
                            const deltaX = e.clientX - startX;
                            const deltaY = e.clientY - startY;
                            const newWidth = Math.max(20, startWidth - deltaX);
                            const newHeight = Math.max(20, startHeight + deltaY);
                            const newX = startLeft + (startWidth - newWidth);
                            
                            updateElement(element.id, {
                              width: newWidth,
                              height: newHeight,
                              x: newX
                            });
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: -4,
                          right: -4,
                          width: 8,
                          height: 8,
                          backgroundColor: '#00bcd4',
                          cursor: 'se-resize',
                          border: '1px solid #fff'
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const startWidth = element.width;
                          const startHeight = element.height;
                          
                          const handleMouseMove = (e: MouseEvent) => {
                            const deltaX = e.clientX - startX;
                            const deltaY = e.clientY - startY;
                            const newWidth = Math.max(20, startWidth + deltaX);
                            const newHeight = Math.max(20, startHeight + deltaY);
                            
                            updateElement(element.id, {
                              width: newWidth,
                              height: newHeight
                            });
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      />
                    </>
                  )}
                </div>
              ))}
              
              {/* Default content when no elements */}
              {elements.length === 0 && (
                <div className="text-center opacity-50 mt-20">
                  <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
                    Welcome to Your Canvas
                  </h2>
                  <p style={{ fontSize: 18, marginBottom: 24 }}>
                    Start adding elements using the toolbar on the left
                  </p>
                  <p style={{ fontSize: 14 }}>
                    Theme: {theme} | Color: {color}
                  </p>
                </div>
              )}
              
              {customCSS && <style>{customCSS}</style>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManualDesignPage;
