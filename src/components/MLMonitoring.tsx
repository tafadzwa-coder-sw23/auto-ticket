import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Brain, Activity, AlertTriangle, CheckCircle, Zap, RefreshCw } from "lucide-react";
import { useCurrentTicket } from "../lib/CurrentTicketContext";

const MLMonitoring = () => {
  const { currentTicket } = useCurrentTicket();
  // No real model metrics available, so show placeholders
  const modelMetrics = null;
  const realtimeData = [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'training':
        return <Badge className="bg-blue-100 text-blue-800"><Activity className="w-3 h-3 mr-1" />Training</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {currentTicket && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
          <strong>Current Ticket:</strong> {currentTicket.id} - {currentTicket.subject} ({currentTicket.status})
        </div>
      )}
      {/* Model Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-600" />
                ML Model Performance
              </CardTitle>
              <CardDescription>Real-time monitoring of the ticket classification model</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge('unknown')}
              <Button variant="outline" size="sm" disabled>
                <RefreshCw className="w-4 h-4 mr-2" />
                No Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No model metrics available.</p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">No data</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Precision</p>
                <p className="text-2xl font-bold text-gray-900">No data</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Throughput</p>
                <p className="text-2xl font-bold text-gray-900">No data</p>
                <p className="text-xs text-gray-500">tickets/hour</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Latency</p>
                <p className="text-2xl font-bold text-gray-900">No data</p>
                <p className="text-xs text-gray-500">avg response</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Accuracy</CardTitle>
            <CardDescription>Model accuracy over the last 30 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500">No data</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Throughput and latency over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500">No data</div>
          </CardContent>
        </Card>
      </div>

      {/* Model Details */}
      <Card>
        <CardHeader>
          <CardTitle>Model Information</CardTitle>
          <CardDescription>Technical details and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">F1 Score</p>
              <p className="text-lg font-semibold">No data</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Recall</p>
              <p className="text-lg font-semibold">No data</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Model Version</p>
              <p className="text-lg font-semibold">No data</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Training Data</p>
              <p className="text-lg font-semibold">No data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLMonitoring;
