import React, { useEffect, useState } from 'react';
import api from '../../utils/1win/axios';
import { toast } from 'react-toastify';
import { FaToggleOn } from 'react-icons/fa';

const DisabledUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisabledUsers();
  }, []);

  const fetchDisabledUsers = async () => {
    try {
      const response = await api.get('/admin/users/disabled');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching disabled users:', error);
      toast.error('Failed to fetch disabled users');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, {
        isActive: true,
      });
      toast.success('User activated successfully');
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      toast.error('Failed to activate user');
    }
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
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Disabled Users
          </h1>
          <p className="text-gray-400">Users that have been deactivated</p>
        </div>

        {users.length > 0 ? (
          <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-600/80 via-rose-600/80 to-red-600/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Currency</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Balance</th>
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
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleActivate(user._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-semibold text-sm"
                        >
                          <FaToggleOn />
                          Activate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-3xl shadow-2xl p-12 text-center border border-white/10">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-2xl font-bold text-gray-100 mb-2">No Disabled Users</h3>
            <p className="text-gray-400">All users are currently active.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisabledUsers;





