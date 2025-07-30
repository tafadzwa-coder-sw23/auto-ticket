import { supabase } from '../supabaseClient';
import { Ticket } from '../pages/Index';

export async function fetchTickets() {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created', { ascending: false });
  if (error) throw error;
  return data as Ticket[];
}

export async function createTicket(ticket: Ticket) {
  const { error } = await supabase.from('tickets').insert([ticket]);
  if (error) throw error;
}

export async function updateTicket(id: string, updates: Partial<Ticket>) {
  const { error } = await supabase.from('tickets').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteTicket(id: string) {
  const { error } = await supabase.from('tickets').delete().eq('id', id);
  if (error) throw error;
}
