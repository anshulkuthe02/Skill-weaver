import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ManualDesignProps {
  customCSS: string;
  onChange: (css: string) => void;
}

const ManualDesign = ({ customCSS, onChange }: ManualDesignProps) => {
  return (
    <Card className="border-border/50 shadow-elegant">
      <CardHeader>
        <CardTitle>Manual Design</CardTitle>
        <CardDescription>
          Add your own CSS styles to customize your portfolio layout and appearance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="custom-css">Custom CSS</Label>
        <Textarea
          id="custom-css"
          value={customCSS}
          onChange={e => onChange(e.target.value)}
          placeholder="Type your custom CSS here..."
          rows={8}
        />
      </CardContent>
    </Card>
  );
};

export default ManualDesign;
