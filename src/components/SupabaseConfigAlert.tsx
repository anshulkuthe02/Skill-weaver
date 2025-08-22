import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";

const SupabaseConfigAlert = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  const isConfigured = supabaseUrl && 
                      supabaseKey && 
                      !supabaseUrl.includes('your-project') && 
                      !supabaseKey.includes('your-anon-key');

  if (isConfigured) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-3">
        <div>
          <strong>Supabase Configuration Required</strong>
          <p className="text-sm mt-1">
            Please configure your Supabase credentials in the .env file to enable authentication and data storage.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://app.supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Setup Supabase
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a 
              href="/SUPABASE_SETUP.md" 
              target="_blank"
              className="flex items-center gap-1"
            >
              Setup Guide
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SupabaseConfigAlert;
