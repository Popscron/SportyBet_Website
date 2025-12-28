import React, { useEffect, useState } from 'react';
import api from '../../utils/1win/axios';
import { toast } from 'react-toastify';
import { FaCopy, FaPlus, FaUserShield, FaUser, FaDollarSign, FaUsers } from 'react-icons/fa';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    name: '',
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/admins');
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/admins', newAdmin);
      toast.success('Admin created successfully');
      setShowAddModal(false);
      setNewAdmin({ email: '', password: '', name: '' });
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleGenerateInviteCode = async (adminId) => {
    try {
      const response = await api.post(`/admin/admins/${adminId}/invite-code`);
      toast.success('Invite code generated successfully');
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate invite code');
    }
  };


  const handleRoleChange = async (adminId, newRole) => {
    try {
      await api.put(`/admin/admins/${adminId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getInviteLink = (inviteCode) => {
    const frontendUrl = window.location.origin;
    return `${frontendUrl}/${inviteCode}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Management</h1>
            <p className="text-gray-400 mt-2">1Win Control Panel - Manage admin users, invite codes, and view payment statistics</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FaPlus /> Add Admin
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-purple-500 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{admin.name || admin.email}</h3>
                  <p className="text-gray-400 text-sm">{admin.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {admin.role === 'super_admin' ? (
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaUserShield /> Super Admin
                    </span>
                  ) : (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaUser /> Admin
                    </span>
                  )}
                </div>
              </div>

              {admin.inviteCode && (
                <div className="mb-4">
                  <label className="text-gray-400 text-sm mb-1 block">Invite Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={getInviteLink(admin.inviteCode)}
                      readOnly
                      className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(getInviteLink(admin.inviteCode))}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Total Payments</div>
                  <div className="text-white font-bold">{admin.totalPayments || 0}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Total Amount</div>
                  <div className="text-white font-bold">{admin.totalAmount?.toFixed(2) || '0.00'}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 col-span-2">
                  <div className="text-gray-400 text-xs mb-1">Total Earnings</div>
                  <div className="text-green-400 font-bold">{admin.totalEarnings?.toFixed(2) || '0.00'}</div>
                </div>
              </div>

              <div className="flex gap-2">
                {admin.role !== 'super_admin' && (
                  <>
                    {!admin.inviteCode && (
                      <button
                        onClick={() => handleGenerateInviteCode(admin._id)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Generate Invite Code
                      </button>
                    )}
                    <select
                      value={admin.role}
                      onChange={(e) => handleRoleChange(admin._id, e.target.value)}
                      className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm border border-gray-700"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">Add New Admin</h2>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="text-gray-300 mb-2 block">Name</label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300 mb-2 block">Email</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300 mb-2 block">Password</label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                    required
                    minLength={8}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Create Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;

