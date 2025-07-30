
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, Target, Brain } from "lucide-react";
import { useCurrentTicket } from "../lib/CurrentTicketContext";

const ticketVolumeData = [
  { month: 'Jan', tickets: 245, resolved: 220 },
  { month: 'Feb', tickets: 289, resolved: 265 },
  { month: 'Mar', tickets: 312, resolved: 298 },
  { month: 'Apr', tickets: 356, resolved: 340 },
  { month: 'May', tickets: 398, resolved: 385 },
  { month: 'Jun', tickets: 445, resolved: 432 },
];

const departmentData = [
  { name: 'Technical', value: 45, color: '#3b82f6' },
  { name: 'Billing', value: 25, color: '#10b981' },
  { name: 'Sales', value: 20, color: '#8b5cf6' },
  { name: 'General', value: 10, color: '#f59e0b' },
];

const classificationAccuracy = [
  { day: 'Mon', accuracy: 94.2 },
  { day: 'Tue', accuracy: 95.1 },
  { day: 'Wed', accuracy: 93.8 },
  { day: 'Thu', accuracy: 96.3 },
  { day: 'Fri', accuracy: 94.7 },
  { day: 'Sat', accuracy: 95.9 },
  { day: 'Sun', accuracy: 94.1 },
];

const AnalyticsDashboard = () => {
  const { currentTicket } = useCurrentTicket();
  return (
    <div className="space-y-6">
      {currentTicket && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
          <strong>Current Ticket:</strong> {currentTicket.id} - {currentTicket.subject} ({currentTicket.status})
        </div>
      )}
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ML Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">94.7%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.1% from last week
                </p>
              </div>
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-bold text-gray-900">4.2h</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -12% faster
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto-Classified</p>
                <p className="text-2xl font-bold text-gray-900">89.3%</p>
                <p className="text-sm text-blue-600 flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  High confidence
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-500">12 online now</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Volume Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Volume & Resolution Trend</CardTitle>
            <CardDescription>Monthly ticket volume and resolution rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                tickets: { label: "Total Tickets", color: "#3b82f6" },
                resolved: { label: "Resolved", color: "#10b981" }
              }}
              className="h-[300px]"
            >
              <BarChart data={ticketVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="tickets" fill="#3b82f6" name="Total Tickets" />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Classification Distribution</CardTitle>
            <CardDescription>AI-powered department classification breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                technical: { label: "Technical", color: "#3b82f6" },
                billing: { label: "Billing", color: "#10b981" },
                sales: { label: "Sales", color: "#8b5cf6" },
                general: { label: "General", color: "#f59e0b" }
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ML Accuracy Trend */}
      <Card>
        <CardHeader>
          <CardTitle>ML Classification Accuracy</CardTitle>
          <CardDescription>Daily accuracy performance of the machine learning model</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer 
            config={{
              accuracy: { label: "Accuracy %", color: "#8b5cf6" }
            }}
            className="h-[250px]"
          >
            <LineChart data={classificationAccuracy}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[90, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
