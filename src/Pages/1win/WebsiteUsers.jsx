import React, { useEffect, useState } from 'react';
import api from '../../utils/1win/axios';
import { toast } from 'react-toastify';
import { FaGlobe, FaEnvelope, FaUser, FaPhone, FaCalendar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const WebsiteUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, expired, disabled

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users/website');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching website users:', error);
      toast.error('Failed to fetch website users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const now = new Date();
    if (filter === 'active') {
      return user.isActive && (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) > now);
    } else if (filter === 'expired') {
      return user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) <= now;
    } else if (filter === 'disabled') {
      return !user.isActive;
    }
    return true;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive && (!u.subscriptionExpiresAt || new Date(u.subscriptionExpiresAt) > new Date())).length,
    expired: users.filter(u => u.subscriptionExpiresAt && new Date(u.subscriptionExpiresAt) <= new Date()).length,
    disabled: users.filter(u => !u.isActive).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-xl">
              <FaGlobe className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Website Users
              </h1>
              <p className="text-gray-400 text-lg font-medium">Users who registered through the website</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Total Website Users</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-green-600/30">
            <div className="text-green-400 text-sm mb-1">Active</div>
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-yellow-600/30">
            <div className="text-yellow-400 text-sm mb-1">Expired</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.expired}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-red-600/30">
            <div className="text-red-400 text-sm mb-1">Disabled</div>
            <div className="text-2xl font-bold text-red-400">{stats.disabled}</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'active'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'expired'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Expired ({stats.expired})
          </button>
          <button
            onClick={() => setFilter('disabled')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'disabled'
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Disabled ({stats.disabled})
          </button>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
            <FaGlobe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No website users found</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                    <th className="text-left py-3 px-4 text-sm font-semibold">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Registered</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Subscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-800 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-2 rounded-lg">
                            <FaUser className="text-white text-sm" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">{user.name || 'No Name'}</div>
                            {user.accountId && (
                              <div className="text-xs text-gray-400 font-mono">ID: {user.accountId}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {user.email && (
                            <div className="text-sm text-gray-300 flex items-center gap-2">
                              <FaEnvelope className="text-xs" />
                              {user.email}
                            </div>
                          )}
                          {user.phone && (
                            <div className="text-sm text-gray-300 flex items-center gap-2">
                              <FaPhone className="text-xs" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' || user.isAdmin
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {user.role === 'admin' || user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-xs" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-600/30">
                            <FaCheckCircle /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-xs font-semibold border border-red-600/30">
                            <FaTimesCircle /> Disabled
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {user.subscriptionType ? (
                          <div>
                            <div className="capitalize font-semibold text-white">{user.subscriptionType}</div>
                            {user.subscriptionExpiresAt && (
                              <div className="text-xs text-gray-400">
                                {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No subscription</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteUsers;

