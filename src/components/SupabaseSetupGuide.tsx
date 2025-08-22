import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink, Database, Key } from "lucide-react";

const SupabaseSetupGuide = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Supabase Setup Required
          </CardTitle>
          <CardDescription>
            Please configure Supabase to use SkillWeave
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Supabase is not properly configured. Please follow the setup steps below.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 1: Create Supabase Project</h3>
                <p className="text-sm text-muted-foreground">
                  Sign up and create a new project at Supabase
                </p>
                <Button variant="outline" className="w-fit" asChild>
                  <a 
                    href="https://app.supabase.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Go to Supabase Dashboard
                  </a>
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 2: Get Your Credentials</h3>
                <p className="text-sm text-muted-foreground">
                  From your project dashboard, go to Settings → API and copy:
                </p>
                <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                  <li>• <strong>Project URL</strong> (https://your-project.supabase.co)</li>
                  <li>• <strong>anon/public key</strong> (starts with eyJ...)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 3: Update Environment Variables</h3>
                <p className="text-sm text-muted-foreground">
                  Open your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file and update:
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  <div>VITE_SUPABASE_URL=https://your-project-ref.supabase.co</div>
                  <div>VITE_SUPABASE_ANON_KEY=your-anon-key-here</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 4: Set Up Database</h3>
                <p className="text-sm text-muted-foreground">
                  In Supabase SQL Editor, run the schema.sql file from your project to create the required tables.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 5: Restart Development Server</h3>
                <p className="text-sm text-muted-foreground">
                  Stop and restart your development server for changes to take effect.
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  npm run dev
                </div>
              </div>
            </div>
          </div>

          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> The anon key is safe to use in frontend applications. 
              Never use your service role key in frontend code.
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <Button variant="outline" asChild>
              <a 
                href="/SUPABASE_SETUP.md" 
                target="_blank"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Detailed Setup Guide
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseSetupGuide;
