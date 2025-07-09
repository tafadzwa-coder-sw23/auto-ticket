import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, Users, Settings, BarChart3, Ticket, Brain, Zap, Activity, Filter } from "lucide-react";
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import TicketManager from '../components/TicketManager';
import MLMonitoring from '../components/MLMonitoring';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'agent' | 'customer' | null>(null);
  const [credentials, setCredentials] = useState({ email: '', password: '', role: '' });
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.email && credentials.password && credentials.role) {
      setUserRole(credentials.role as 'admin' | 'agent' | 'customer');
      setIsLoggedIn(true);
      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting to ${credentials.role} dashboard.`,
      });
    } else {
      toast({
        title: "Login Failed", 
        description: "Please fill in all fields.",
        variant: "destructive"
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">TicketScribe AI</h1>
            <p className="text-gray-600">Intelligent Support Ticket Classification</p>
          </div>

          {/* Login Form */}
          <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-9 h-11"
                      value={credentials.email}
                      onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-9 h-11"
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                  <Select onValueChange={(value) => setCredentials({...credentials, role: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="agent">Support Agent</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Demo credentials: admin@demo.com / agent@demo.com / customer@demo.com
                </p>
                <p className="text-xs text-gray-400 mt-1">Password: demo123</p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Zap className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-xs text-gray-600">AI-Powered</span>
            </div>
            <div className="flex flex-col items-center">
              <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-xs text-gray-600">Analytics</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-xs text-gray-600">Multi-Role</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard based on user role
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900">TicketScribe AI</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="capitalize">
                {userRole}
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsLoggedIn(false);
                  setUserRole(null);
                  setCredentials({ email: '', password: '', role: '' });
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'admin' && <AdminDashboard />}
        {userRole === 'agent' && <AgentDashboard />}
        {userRole === 'customer' && <CustomerDashboard />}
      </main>
    </div>
  );
};

// Enhanced Admin Dashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'monitoring' | 'tickets'>('overview');

  const stats = [
    { title: 'Total Tickets', value: '2,847', change: '+12%', icon: Ticket },
    { title: 'ML Accuracy', value: '94.7%', change: '+2.1%', icon: Brain },
    { title: 'Avg Resolution Time', value: '4.2h', change: '-8%', icon: BarChart3 },
    { title: 'Auto-Classified', value: '89.3%', change: '+5%', icon: Zap },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>
        
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'monitoring'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                ML Monitoring
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tickets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                Ticket Management
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change}</p>
                      </div>
                      <stat.icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Department Management */}
            <Card>
              <CardHeader>
                <CardTitle>AI Classification Settings</CardTitle>
                <CardDescription>Manage machine learning model configuration and department rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Support</h4>
                    <p className="text-sm text-gray-600 mb-3">Bug reports, system issues, API problems</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      <Badge variant="outline">94.2% accuracy</Badge>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Billing</h4>
                    <p className="text-sm text-gray-600 mb-3">Payment issues, subscription queries</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <Badge variant="outline">96.8% accuracy</Badge>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Sales</h4>
                    <p className="text-sm text-gray-600 mb-3">Product inquiries, demos, pricing</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                      <Badge variant="outline">91.3% accuracy</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'monitoring' && <MLMonitoring />}
        {activeTab === 'tickets' && <TicketManager />}
      </div>
    </div>
  );
};

// Agent Dashboard Component
const AgentDashboard = () => {
  const [activeView, setActiveView] = useState<'queue' | 'analytics'>('queue');
  
  const tickets = [
    { 
      id: '#T-2024-001', 
      subject: 'Login issues with mobile app', 
      department: 'Technical', 
      priority: 'High', 
      status: 'Open',
      confidence: 94.2,
      created: '2 hours ago',
      customer: 'john.doe@email.com'
    },
    { 
      id: '#T-2024-002', 
      subject: 'Billing question about subscription', 
      department: 'Billing', 
      priority: 'Medium', 
      status: 'In Progress',
      confidence: 96.8,
      created: '1 hour ago',
      customer: 'jane.smith@email.com'
    },
    { 
      id: '#T-2024-003', 
      subject: 'Feature request for dashboard', 
      department: 'Product', 
      priority: 'Low', 
      status: 'Open',
      confidence: 89.3,
      created: '30 min ago',
      customer: 'mike.johnson@company.com'
    },
  ];

  const myStats = [
    { label: 'Assigned Tickets', value: '12', trend: 'up' },
    { label: 'Resolved Today', value: '8', trend: 'up' },
    { label: 'Avg Resolution', value: '3.2h', trend: 'down' },
    { label: 'Customer Rating', value: '4.8', trend: 'up' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Dashboard</h2>
        
        {/* View Toggle */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveView('queue')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'queue'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Ticket className="w-4 h-4 inline mr-2" />
                My Queue
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                My Performance
              </button>
            </nav>
          </div>
        </div>

        {activeView === 'queue' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {myStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI-Powered Ticket Queue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  AI-Classified Ticket Queue
                </CardTitle>
                <CardDescription>Tickets automatically assigned based on ML classification confidence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium text-gray-900">{ticket.id}</span>
                            <Badge variant="outline">{ticket.department}</Badge>
                            <Badge variant={ticket.priority === 'High' ? 'destructive' : ticket.priority === 'Medium' ? 'default' : 'secondary'}>
                              {ticket.priority}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Brain className="w-3 h-3 text-blue-600" />
                              <span className="text-xs text-gray-500">{ticket.confidence}% confidence</span>
                            </div>
                          </div>
                          <p className="text-gray-900 font-medium mb-1">{ticket.subject}</p>
                          <p className="text-sm text-gray-600">From: {ticket.customer} • {ticket.created}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={ticket.status === 'Open' ? 'destructive' : 'default'}>
                            {ticket.status}
                          </Badge>
                          <Button size="sm">View</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeView === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Performance This Week</CardTitle>
                <CardDescription>Resolution rate and customer satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tickets Resolved</span>
                    <span className="font-semibold">34/38</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89.5%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer Rating</span>
                    <span className="font-semibold">4.8/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Response Time</span>
                    <span className="font-semibold">12 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Expertise</CardTitle>
                <CardDescription>Your classification accuracy by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Technical Support</span>
                    <Badge className="bg-blue-100 text-blue-800">Expert - 96.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Billing</span>
                    <Badge className="bg-green-100 text-green-800">Expert - 94.8%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Product</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Good - 87.3%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Customer Dashboard Component
const CustomerDashboard = () => {
  const [newTicket, setNewTicket] = useState({ subject: '', description: '', priority: '' });
  const [predictedDepartment, setPredictedDepartment] = useState<string | null>(null);
  const [predictionConfidence, setPredictionConfidence] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSubjectChange = (value: string) => {
    setNewTicket({ ...newTicket, subject: value });
    
    // Simulate AI prediction based on subject
    if (value.length > 10) {
      setTimeout(() => {
        if (value.toLowerCase().includes('login') || value.toLowerCase().includes('bug') || value.toLowerCase().includes('error')) {
          setPredictedDepartment('Technical Support');
          setPredictionConfidence(94.2);
        } else if (value.toLowerCase().includes('billing') || value.toLowerCase().includes('payment') || value.toLowerCase().includes('charge')) {
          setPredictedDepartment('Billing');
          setPredictionConfidence(96.8);
        } else if (value.toLowerCase().includes('demo') || value.toLowerCase().includes('sales') || value.toLowerCase().includes('pricing')) {
          setPredictedDepartment('Sales');
          setPredictionConfidence(91.3);
        } else {
          setPredictedDepartment('General Support');
          setPredictionConfidence(87.5);
        }
      }, 500);
    } else {
      setPredictedDepartment(null);
      setPredictionConfidence(null);
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTicket.subject && newTicket.description) {
      toast({
        title: "Ticket Submitted Successfully",
        description: `Your ticket will be automatically routed to ${predictedDepartment || 'the appropriate department'} with ${predictionConfidence?.toFixed(1) || 'high'}% confidence.`,
      });
      setNewTicket({ subject: '', description: '', priority: '' });
      setPredictedDepartment(null);
      setPredictionConfidence(null);
    }
  };

  const myTickets = [
    {
      id: '#T-2024-005',
      subject: 'Unable to access dashboard',
      department: 'Technical',
      status: 'In Progress',
      created: '2 hours ago',
      confidence: 95.3,
      agent: 'Alex Chen'
    },
    {
      id: '#T-2024-004',
      subject: 'Subscription renewal question',
      department: 'Billing',
      status: 'Resolved',
      created: '1 day ago',
      confidence: 97.1,
      agent: 'Sarah Wilson'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Portal</h2>
        
        {/* AI-Powered Ticket Submission */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Submit New Ticket
            </CardTitle>
            <CardDescription>Our AI will automatically classify and route your ticket to the right department</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newTicket.subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  placeholder="Brief description of your issue"
                />
                {predictedDepartment && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">AI Prediction:</span>
                    </div>
                    <p className="text-sm text-blue-800 mt-1">
                      This ticket will be routed to <strong>{predictedDepartment}</strong> with {predictionConfidence?.toFixed(1)}% confidence
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full p-3 border rounded-md h-32 resize-none"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  placeholder="Detailed description of your issue or question..."
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={(value) => setNewTicket({...newTicket, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Ticket className="w-4 h-4 mr-2" />
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Tickets with AI Information */}
        <Card>
          <CardHeader>
            <CardTitle>My Tickets</CardTitle>
            <CardDescription>Track your tickets and see how AI has classified them</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myTickets.map((ticket, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium">{ticket.id}</span>
                        <Badge variant="outline">{ticket.department}</Badge>
                        <div className="flex items-center gap-1">
                          <Brain className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-gray-500">{ticket.confidence}% AI confidence</span>
                        </div>
                      </div>
                      <p className="text-gray-900 font-medium mb-1">{ticket.subject}</p>
                      <p className="text-sm text-gray-600">
                        Agent: {ticket.agent} • Created: {ticket.created}
                      </p>
                    </div>
                    <Badge className={ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
