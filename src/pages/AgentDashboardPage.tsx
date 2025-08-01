import React, { useEffect, useState } from 'react';
import { useUser } from "../lib/UserContext";
import { fetchTickets, updateTicket } from "../lib/supabaseTickets";
import { AgentDashboard } from "./Index";

const AgentDashboardPage = () => {
  const { user, loading: userLoading } = useUser();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const loadTickets = async () => {
      const data = await fetchTickets();
      setTickets(data || []);
    };
    if (user) loadTickets();
  }, [user]);

  // Assign unassigned tickets to this agent in DB
  useEffect(() => {
    if (user && user.user_metadata?.role === 'agent') {
      tickets.forEach(t => {
        if (!t.agent) updateTicket(t.id, { agent: user.email });
      });
    }
  }, [user, tickets]);

  if (userLoading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in as an agent.</div>;

  return (
    <AgentDashboard
      tickets={tickets.filter(t => t.agent && (t.agent === user.email || t.agent === user.email?.split('@')[0]))}
      setTickets={setTickets}
    />
  );
};

export default AgentDashboardPage;
