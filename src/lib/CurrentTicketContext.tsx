import React, { createContext, useContext, useState } from 'react';

export interface Ticket {
  id: string;
  subject: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  created: string;
  customer: string;
  agent?: string;
  confidence: number;
  isAutoClassified: boolean;
}

interface CurrentTicketContextType {
  currentTicket: Ticket | null;
  setCurrentTicket: (ticket: Ticket | null) => void;
}

const CurrentTicketContext = createContext<CurrentTicketContextType | undefined>(undefined);

export const useCurrentTicket = () => {
  const context = useContext(CurrentTicketContext);
  if (!context) {
    throw new Error('useCurrentTicket must be used within a CurrentTicketProvider');
  }
  return context;
};

export const CurrentTicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  return (
    <CurrentTicketContext.Provider value={{ currentTicket, setCurrentTicket }}>
      {children}
    </CurrentTicketContext.Provider>
  );
}; 