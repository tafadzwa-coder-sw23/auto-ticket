
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Brain, Activity, AlertTriangle, CheckCircle, Zap, RefreshCw } from "lucide-react";
import { useCurrentTicket } from "../lib/CurrentTicketContext";

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  throughput: number;
  latency: number;
  status: 'active' | 'training' | 'error';
  lastUpdated: string;
}

interface RealtimeData {
  timestamp: string;
  accuracy: number;
  throughput: number;
  latency: number;
}

const MLMonitoring = () => {
  const { currentTicket } = useCurrentTicket();
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>({
    accuracy: 94.7,
    precision: 92.3,
    recall: 95.1,
    f1Score: 93.7,
    throughput: 847,
    latency: 23,
    status: 'active',
    lastUpdated: new Date().toLocaleString()
  });

  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([
    { timestamp: '10:00', accuracy: 94.2, throughput: 820, latency: 25 },
    { timestamp: '10:05', accuracy: 94.5, throughput: 835, latency: 24 },
    { timestamp: '10:10', accuracy: 94.8, throughput: 847, latency: 23 },
    { timestamp: '10:15', accuracy: 94.7, throughput: 852, latency: 22 },
    { timestamp: '10:20', accuracy: 95.1, throughput: 863, latency: 21 },
    { timestamp: '10:25', accuracy: 94.9, throughput: 847, latency: 23 },
  ]);

  const [isLiveUpdating, setIsLiveUpdating] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newAccuracy = 94 + Math.random() * 2;
      const newThroughput = 800 + Math.random() * 100;
      const newLatency = 20 + Math.random() * 10;

      setRealtimeData(prev => {
        const newData = [...prev.slice(-5), {
          timestamp,
          accuracy: Number(newAccuracy.toFixed(1)),
          throughput: Number(newThroughput.toFixed(0)),
          latency: Number(newLatency.toFixed(1))
        }];
        return newData;
      });

      setModelMetrics(prev => ({
        ...prev,
        accuracy: Number(newAccuracy.toFixed(1)),
        throughput: Number(newThroughput.toFixed(0)),
        latency: Number(newLatency.toFixed(1)),
        lastUpdated: now.toLocaleString()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  const getStatusBadge = (status: ModelMetrics['status']) => {
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
              {getStatusBadge(modelMetrics.status)}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsLiveUpdating(!isLiveUpdating)}
              >
                {isLiveUpdating ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-pulse" />
                    Live
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Paused
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Last updated: {modelMetrics.lastUpdated}</p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{modelMetrics.accuracy.toFixed(1)}%</p>
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
                <p className="text-2xl font-bold text-gray-900">{modelMetrics.precision.toFixed(1)}%</p>
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
                <p className="text-2xl font-bold text-gray-900">{Math.round(modelMetrics.throughput)}</p>
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
                <p className="text-2xl font-bold text-gray-900">{Math.round(modelMetrics.latency)}ms</p>
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
            <ChartContainer 
              config={{
                accuracy: { label: "Accuracy %", color: "#3b82f6" }
              }}
              className="h-[250px]"
            >
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[90, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Throughput and latency over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                throughput: { label: "Throughput (tickets/hr)", color: "#10b981" },
                latency: { label: "Latency (ms)", color: "#f59e0b" }
              }}
              className="h-[250px]"
            >
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis yAxisId="throughput" orientation="left" />
                <YAxis yAxisId="latency" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  yAxisId="throughput"
                  type="monotone" 
                  dataKey="throughput" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  yAxisId="latency"
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ChartContainer>
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
              <p className="text-lg font-semibold">{modelMetrics.f1Score.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Recall</p>
              <p className="text-lg font-semibold">{modelMetrics.recall.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Model Version</p>
              <p className="text-lg font-semibold">v2.1.3</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Training Data</p>
              <p className="text-lg font-semibold">45K tickets</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLMonitoring;
