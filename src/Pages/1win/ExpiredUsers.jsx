import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/1win/axios';
import { toast } from 'react-toastify';

const ExpiredUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpiredUsers();
  }, []);

  const fetchExpiredUsers = async () => {
    try {
      const response = await api.get('/admin/users/expired');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching expired users:', error);
      toast.error('Failed to fetch expired users');
    } finally {
      setLoading(false);
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
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Expired Users
          </h1>
          <p className="text-gray-400">Users with expired subscriptions</p>
        </div>

        {users.length > 0 ? (
          <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-600/80 via-amber-600/80 to-orange-600/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Subscription</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Expired On</th>
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
                      <td className="px-6 py-4 text-sm text-gray-300">{user.subscriptionType || 'None'}</td>
                      <td className="px-6 py-4 text-sm text-orange-400 font-semibold">
                        {formatDate(user.subscriptionExpiry)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/1win/users/edit/${user._id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                          Renew Subscription
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-3xl shadow-2xl p-12 text-center border border-white/10">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-2xl font-bold text-gray-100 mb-2">No Expired Users</h3>
            <p className="text-gray-400">All users have active subscriptions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpiredUsers;





