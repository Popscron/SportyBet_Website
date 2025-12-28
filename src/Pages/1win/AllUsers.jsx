import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/1win/axios';
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u._id !== userId));
      setDeleteModal({ open: false, userId: null });
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.patch(`/admin/users/${userId}/status`, {
        isActive: newStatus,
      });
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'}`);
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: newStatus } : u));
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              All Users
            </h1>
            <p className="text-gray-400">Manage all registered users</p>
          </div>
          <Link
            to="/1win/users/add"
            className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            + Add User
          </Link>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600/80 via-indigo-600/80 to-purple-600/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Currency</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Balance</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Subscription</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Expiry</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-200 font-medium">{user.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{user.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{user.phone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' || user.isAdmin
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.role === 'admin' || user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{user.currency || 'GHS'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{user.balance?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {user.subscriptionType ? `${user.subscriptionType}` : 'None'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{formatDate(user.subscriptionExpiry)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user._id, user.isActive)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                          user.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {user.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        {user.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/1win/users/edit/${user._id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, userId: user._id })}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {deleteModal.open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-white/10">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Delete User?</h2>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteModal({ open: false, userId: null })}
                  className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.userId)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;





