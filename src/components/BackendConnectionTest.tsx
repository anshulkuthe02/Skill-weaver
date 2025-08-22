import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { testBackendConnection, templateService } from '@/services';
import { AlertCircle, CheckCircle, Loader2, Server } from 'lucide-react';

const BackendConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean;
    status?: string;
    error?: string;
    loading: boolean;
  }>({ isConnected: false, loading: false });

  const [templatesTest, setTemplatesTest] = useState<{
    success: boolean;
    count?: number;
    error?: string;
    loading: boolean;
  }>({ success: false, loading: false });

  const testConnection = async () => {
    setConnectionStatus({ isConnected: false, loading: true });
    
    try {
      const result = await testBackendConnection();
      setConnectionStatus({
        ...result,
        loading: false,
      });
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
    }
  };

  const testTemplateService = async () => {
    setTemplatesTest({ success: false, loading: true });
    
    try {
      const result = await templateService.getTemplates({ limit: 5 });
      setTemplatesTest({
        success: true,
        count: result.data?.templates?.length || 0,
        loading: false,
      });
    } catch (error) {
      setTemplatesTest({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
        loading: false,
      });
    }
  };

  const runAllTests = async () => {
    await testConnection();
    if (connectionStatus.isConnected) {
      await testTemplateService();
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Backend Connection Test
        </CardTitle>
        <CardDescription>
          Test the connection to the SkillWeave backend API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            {connectionStatus.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : connectionStatus.isConnected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium">Backend Server</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={connectionStatus.isConnected ? "default" : "destructive"}
            >
              {connectionStatus.loading ? 'Testing...' : 
               connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>

        {connectionStatus.status && (
          <div className="text-sm text-gray-600">
            Server Status: {connectionStatus.status}
          </div>
        )}

        {connectionStatus.error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            Error: {connectionStatus.error}
          </div>
        )}

        {/* Template Service Test */}
        {connectionStatus.isConnected && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              {templatesTest.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : templatesTest.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              )}
              <span className="font-medium">Template Service</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={templatesTest.success ? "default" : "secondary"}
              >
                {templatesTest.loading ? 'Testing...' : 
                 templatesTest.success ? `${templatesTest.count} templates` : 'Not tested'}
              </Badge>
            </div>
          </div>
        )}

        {templatesTest.error && (
          <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
            Template Service Error: {templatesTest.error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={testConnection}
            disabled={connectionStatus.loading}
            variant="outline"
            size="sm"
          >
            {connectionStatus.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Test Connection
          </Button>
          
          {connectionStatus.isConnected && (
            <Button 
              onClick={testTemplateService}
              disabled={templatesTest.loading}
              variant="outline"
              size="sm"
            >
              {templatesTest.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Test Templates
            </Button>
          )}
          
          <Button 
            onClick={runAllTests}
            disabled={connectionStatus.loading || templatesTest.loading}
            size="sm"
          >
            Run All Tests
          </Button>
        </div>

        {/* API Endpoints */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Available Endpoints:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• Backend API: http://localhost:3001/api</div>
            <div>• Health Check: http://localhost:3001/api/health</div>
            <div>• Documentation: http://localhost:3001/api/docs/interactive</div>
            <div>• Templates: http://localhost:3001/api/templates</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendConnectionTest;
