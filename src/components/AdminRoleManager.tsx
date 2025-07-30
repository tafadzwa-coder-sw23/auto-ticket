import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminRoleManager = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async () => {
    setMessage('');
    setLoading(true);
    // Find user by email
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) {
      setMessage('Error fetching users');
      setLoading(false);
      return;
    }
    const user = users?.users.find(u => u.email === email);
    if (!user) {
      setMessage('User not found');
      setLoading(false);
      return;
    }
    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { role }
    });
    if (updateError) {
      setMessage('Error updating role');
    } else {
      setMessage('Role updated successfully!');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto mt-8">
      <h3 className="text-lg font-bold mb-2">Promote User to Admin</h3>
      <input
        className="border p-2 rounded w-full mb-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="User email"
        type="email"
      />
      <select
        className="border p-2 rounded w-full mb-2"
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="agent">Agent</option>
        <option value="customer">Customer</option>
      </select>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={handleRoleChange}
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Role'}
      </button>
      {message && <div className="mt-2 text-center">{message}</div>}
    </div>
  );
};

export default AdminRoleManager;
