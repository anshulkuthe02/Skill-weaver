import { useState } from "react";
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

const ManualDesignPageWrapper = () => {
  const [customCSS, setCustomCSS] = useState("");
  const [theme, setTheme] = useState("Light");
  const [color, setColor] = useState("#000000");
  const [gradient, setGradient] = useState("");
  const [footer, setFooter] = useState("");
  const [siteLength, setSiteLength] = useState(1200);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  return (
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
  );
};

export default ManualDesignPageWrapper;
