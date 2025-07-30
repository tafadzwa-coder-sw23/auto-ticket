
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, RefreshCw, Bot, User, Clock } from "lucide-react";
import { useCurrentTicket } from "../lib/CurrentTicketContext";
import { Ticket } from '../pages/Index';
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

interface TicketManagerProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const TicketManager: React.FC<TicketManagerProps> = ({ tickets, setTickets }) => {
  // Remove internal ticket state, use props
  const [searchTerm, setSearchTerm] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [priorityFilter, setPriorityFilter] = React.useState('all');
  const { currentTicket, setCurrentTicket } = useCurrentTicket();
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [deleteTicket, setDeleteTicket] = useState<Ticket | null>(null);
  const [editForm, setEditForm] = useState<Ticket | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<Ticket | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAssignAgent, setBulkAssignAgent] = useState('');
  const masterCheckbox = useRef<HTMLInputElement>(null);

  // Filtered tickets must be declared before use
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || ticket.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority;
  });

  // Bulk select logic
  const allVisibleIds = filteredTickets.map(t => t.id);
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedIds.includes(id));
  const someSelected = allVisibleIds.some(id => selectedIds.includes(id));

  // When opening the edit modal, copy the ticket to editForm
  React.useEffect(() => {
    if (editTicket) setEditForm(editTicket);
  }, [editTicket]);

  // Initialize createForm with default values when opening modal
  useEffect(() => {
    if (createModalOpen) {
      setCreateForm({
        id: `T-2024-${(tickets.length + 1).toString().padStart(3, '0')}`,
        subject: '',
        department: 'Technical',
        priority: 'Low',
        status: 'Open',
        created: new Date().toLocaleString(),
        customer: '',
        agent: '',
        confidence: 90,
        isAutoClassified: true,
      });
    }
  }, [createModalOpen, tickets.length]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Technical': return 'bg-blue-100 text-blue-800';
      case 'Billing': return 'bg-green-100 text-green-800';
      case 'Sales': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Ticket Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setCreateModalOpen(true)}>Create Ticket</Button>
          {selectedIds.length > 0 && (
            <>
              <Button variant="destructive" onClick={() => {
                setTickets(prev => prev.filter(t => !selectedIds.includes(t.id)));
                setSelectedIds([]);
              }}>Delete Selected</Button>
              <form onSubmit={e => { e.preventDefault(); setTickets(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, agent: bulkAssignAgent } : t)); setSelectedIds([]); setBulkAssignAgent(''); }} className="flex gap-2 items-center">
                <Input placeholder="Assign agent" value={bulkAssignAgent} onChange={e => setBulkAssignAgent(e.target.value)} style={{width:120}} />
                <Button type="submit" disabled={!bulkAssignAgent}>Assign Agent</Button>
              </form>
            </>
          )}
        </div>
      </div>
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Ticket Filters & Search
          </CardTitle>
          <CardDescription>Use AI-powered search and advanced filters to find tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search Tickets</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by subject, customer, or ticket ID..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Management</CardTitle>
          <CardDescription>AI-classified tickets with confidence scores and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    ref={masterCheckbox}
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected ? 'indeterminate' : undefined}
                    onChange={e => {
                      if (e.target.checked) setSelectedIds(allVisibleIds);
                      else setSelectedIds([]);
                    }}
                  />
                </TableHead>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>AI Confidence</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className={`hover:bg-gray-50 ${currentTicket?.id === ticket.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setCurrentTicket(ticket)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(ticket.id)}
                      onChange={e => {
                        e.stopPropagation();
                        setSelectedIds(ids => e.target.checked ? [...ids, ticket.id] : ids.filter(id => id !== ticket.id));
                      }}
                      onClick={e => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getDepartmentColor(ticket.department)}>
                      {ticket.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{ticket.customer}</TableCell>
                  <TableCell className="text-sm">
                    {ticket.agent ? (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {ticket.agent}
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ticket.isAutoClassified && <Bot className="w-4 h-4 text-blue-600" />}
                      <span className="font-medium text-sm">{ticket.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {ticket.created}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); setEditTicket(ticket); }}>Edit</Button>
                    <Button size="sm" variant="destructive" className="ml-2" onClick={e => { e.stopPropagation(); setDeleteTicket(ticket); }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Edit Modal */}
          <Dialog open={!!editTicket} onOpenChange={open => { if (!open) { setEditTicket(null); setEditForm(null); } }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Ticket</DialogTitle>
              </DialogHeader>
              {editForm && (
                <form onSubmit={e => {
                  e.preventDefault();
                  setTickets(prev => prev.map(t => t.id === editForm.id ? editForm : t));
                  setEditTicket(null);
                  setEditForm(null);
                }} className="space-y-4">
                  <div>
                    <Label>Subject</Label>
                    <Input value={editForm.subject} onChange={e => setEditForm({ ...editForm, subject: e.target.value })} />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select value={editForm.department} onValueChange={val => setEditForm({ ...editForm, department: val })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={editForm.priority} onValueChange={val => setEditForm({ ...editForm, priority: val as Ticket["priority"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={editForm.status} onValueChange={val => setEditForm({ ...editForm, status: val as Ticket["status"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Customer</Label>
                    <Input value={editForm.customer} onChange={e => setEditForm({ ...editForm, customer: e.target.value })} />
                  </div>
                  <div>
                    <Label>Agent</Label>
                    <Input value={editForm.agent || ''} onChange={e => setEditForm({ ...editForm, agent: e.target.value })} />
                  </div>
                  <div>
                    <Label>AI Confidence</Label>
                    <Input type="number" value={editForm.confidence} onChange={e => setEditForm({ ...editForm, confidence: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Created</Label>
                    <Input value={editForm.created} onChange={e => setEditForm({ ...editForm, created: e.target.value })} />
                  </div>
                  <div>
                    <Label>Auto-Classified</Label>
                    <Select value={editForm.isAutoClassified ? 'true' : 'false'} onValueChange={val => setEditForm({ ...editForm, isAutoClassified: val === 'true' })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => { setEditTicket(null); setEditForm(null); }}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
          {/* Delete Confirmation */}
          <AlertDialog open={!!deleteTicket} onOpenChange={open => !open && setDeleteTicket(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Ticket?</AlertDialogTitle>
              </AlertDialogHeader>
              <p>Are you sure you want to delete ticket {deleteTicket?.id}?</p>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteTicket(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  setTickets(prev => prev.filter(t => t.id !== deleteTicket?.id));
                  setDeleteTicket(null);
                }}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* Create Ticket Modal */}
          <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Ticket</DialogTitle>
              </DialogHeader>
              {createForm && (
                <form onSubmit={e => {
                  e.preventDefault();
                  setTickets(prev => [{ ...createForm }, ...prev]);
                  setCreateModalOpen(false);
                  setCreateForm(null);
                }} className="space-y-4">
                  <div>
                    <Label>Ticket ID</Label>
                    <Input value={createForm.id} onChange={e => setCreateForm({ ...createForm, id: e.target.value })} />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input value={createForm.subject} onChange={e => setCreateForm({ ...createForm, subject: e.target.value })} />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select value={createForm.department} onValueChange={val => setCreateForm({ ...createForm, department: val })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={createForm.priority} onValueChange={val => setCreateForm({ ...createForm, priority: val as Ticket["priority"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={createForm.status} onValueChange={val => setCreateForm({ ...createForm, status: val as Ticket["status"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Customer</Label>
                    <Input value={createForm.customer} onChange={e => setCreateForm({ ...createForm, customer: e.target.value })} />
                  </div>
                  <div>
                    <Label>Agent</Label>
                    <Input value={createForm.agent || ''} onChange={e => setCreateForm({ ...createForm, agent: e.target.value })} />
                  </div>
                  <div>
                    <Label>AI Confidence</Label>
                    <Input type="number" value={createForm.confidence} onChange={e => setCreateForm({ ...createForm, confidence: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Created</Label>
                    <Input value={createForm.created} onChange={e => setCreateForm({ ...createForm, created: e.target.value })} />
                  </div>
                  <div>
                    <Label>Auto-Classified</Label>
                    <Select value={createForm.isAutoClassified ? 'true' : 'false'} onValueChange={val => setCreateForm({ ...createForm, isAutoClassified: val === 'true' })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                    <Button type="submit">Create</Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketManager;
