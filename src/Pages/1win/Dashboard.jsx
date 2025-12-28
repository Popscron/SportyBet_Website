import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../../utils/1win/axios';
import { useAuth } from '../../Context/1win/AuthContext';
import { FaUsers, FaUserCheck, FaUserTimes, FaUserClock, FaUserShield } from 'react-icons/fa';
import OwnerDashboard from './OwnerDashboard';
import AdminManagement from './AdminManagement';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    disabled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all users and calculate stats
      const response = await api.get('/admin/users');
      const users = response.data.data || [];
      
      const now = new Date();
      const total = users.length;
      const active = users.filter(u => u.isActive && (!u.subscriptionExpiry || new Date(u.subscriptionExpiry) > now)).length;
      const expired = users.filter(u => u.subscriptionExpiry && new Date(u.subscriptionExpiry) <= now).length;
      const disabled = users.filter(u => !u.isActive).length;

      setStats({ total, active, expired, disabled });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total,
      icon: FaUsers,
      gradient: 'from-blue-500 to-cyan-500',
      link: '/1win/users',
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: FaUserCheck,
      gradient: 'from-green-500 to-emerald-500',
      link: '/1win/users',
    },
    {
      title: 'Expired Users',
      value: stats.expired,
      icon: FaUserClock,
      gradient: 'from-orange-500 to-amber-500',
      link: '/1win/expired',
    },
    {
      title: 'Disabled Users',
      value: stats.disabled,
      icon: FaUserTimes,
      gradient: 'from-red-500 to-rose-500',
      link: '/1win/disabled',
    },
  ];

  // Show different dashboard based on role
  // Main admin (without invite code) sees admin management page
  // Regular admins (with invite code) see Owner Dashboard with management cards
  if (user?.role === 'admin' && user?.isAdmin) {
    // Main admin has no invite code - show AdminManagement
    // Regular admins (owners) have invite code - show OwnerDashboard
    if (!user.inviteCode) {
      return <AdminManagement />;
    } else {
      return <OwnerDashboard />;
    }
  }

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
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
            Dashboard
          </h1>
          <p className="text-gray-400 text-lg font-medium">1Win Control Panel - Manage your users and subscriptions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.link}
                className="group relative backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/30 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} bg-opacity-20`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-extrabold text-gray-100 mb-1">{card.value}</h3>
                  <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link
            to="/1win/users"
            className="group relative backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/30 p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-100 mb-2">All Users</h3>
                <p className="text-gray-400">View and manage all registered users</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Link>

          <Link
            to="/1win/users/add"
            className="group relative backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/30 p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-100 mb-2">Add New User</h3>
                <p className="text-gray-400">Create a new user account</p>
              </div>
              <div className="text-4xl">➕</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





