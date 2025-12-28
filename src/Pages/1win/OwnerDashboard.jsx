import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/1win/axios';
import { toast } from 'react-toastify';
import { FaUsers, FaUserCheck, FaUserTimes, FaUserPlus, FaUserClock, FaDollarSign, FaLink, FaChartLine, FaUserShield, FaGlobe } from 'react-icons/fa';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    disabled: 0,
    admins: 0,
    websiteUsers: 0,
  });
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResponse, adminsResponse, websiteUsersResponse] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/admins-list').catch((err) => {
          console.error('Error fetching admins:', err);
          console.error('Response:', err.response?.data);
          return { data: { data: [] } };
        }),
        api.get('/admin/users/website').catch(() => ({ data: { data: [] } })),
      ]);
      
      const users = usersResponse.data.data || [];
      const adminsData = adminsResponse.data.data || [];
      const websiteUsers = websiteUsersResponse.data.data || [];
      
      console.log('📊 Stats fetched:', {
        totalUsers: users.length,
        admins: adminsData.length,
        websiteUsers: websiteUsers.length,
      });
      
      const now = new Date();
      const total = users.length;
      const active = users.filter(u => u.isActive && (!u.subscriptionExpiry || new Date(u.subscriptionExpiry) > now)).length;
      const expired = users.filter(u => u.subscriptionExpiry && new Date(u.subscriptionExpiry) <= now).length;
      const disabled = users.filter(u => !u.isActive).length;

      setStats({ total, active, expired, disabled, admins: adminsData.length, websiteUsers: websiteUsers.length });
      setAdmins(adminsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };


  const dashboardCards = [
    { 
      to: "/1win/users", 
      title: "Users", 
      icon: FaUsers, 
      gradient: "from-blue-500 to-cyan-500", 
      delay: "0",
      value: stats.total
    },
    { 
      to: "/1win/users", 
      title: "Active Users", 
      icon: FaUserCheck, 
      gradient: "from-green-500 to-emerald-500", 
      delay: "100",
      value: stats.active
    },
    { 
      to: "/1win/disabled", 
      title: "Disable Users", 
      icon: FaUserTimes, 
      gradient: "from-red-500 to-rose-500", 
      delay: "200",
      value: stats.disabled
    },
    { 
      to: "/1win/users/add", 
      title: "Add User", 
      icon: FaUserPlus, 
      gradient: "from-purple-500 to-pink-500", 
      delay: "300"
    },
    { 
      to: "/1win/expired", 
      title: "Expired User", 
      icon: FaUserClock, 
      gradient: "from-orange-500 to-amber-500", 
      delay: "400",
      value: stats.expired
    },
    { 
      to: "/1win/admins", 
      title: "Admins", 
      icon: FaUserShield, 
      gradient: "from-indigo-500 to-purple-500", 
      delay: "500",
      value: stats.admins
    },
    { 
      to: "/1win/users/website", 
      title: "Website Users", 
      icon: FaGlobe, 
      gradient: "from-teal-500 to-cyan-500", 
      delay: "600",
      value: stats.websiteUsers
    },
    { 
      to: "/1win/users", 
      title: "Payments", 
      icon: FaDollarSign, 
      gradient: "from-amber-500 to-orange-500", 
      delay: "700"
    },
    { 
      to: "/1win/users", 
      title: "Referrals", 
      icon: FaLink, 
      gradient: "from-pink-500 to-rose-500", 
      delay: "800"
    },
    { 
      to: "/1win", 
      title: "Analytics", 
      icon: FaChartLine, 
      gradient: "from-gray-500 to-slate-500", 
      delay: "900"
    },
  ];

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
        <div className="mb-8 sm:mb-10 md:mb-12 animate-fadeIn">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] mb-3 sm:mb-4">
              Owner Dashboard
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl font-medium">Manage your 1Win administration</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-7">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className="group relative backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transform hover:scale-[1.05] transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/30 animate-slideUp"
                style={{ animationDelay: `${parseInt(card.delay)}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                <div className="relative p-8 sm:p-9 md:p-10 text-center flex flex-col items-center justify-center min-h-[200px]">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.gradient} bg-opacity-20 mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white filter drop-shadow-lg" />
                  </div>
                  {card.value !== undefined && (
                    <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                      {card.value}
                    </div>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-100 group-hover:text-white transition-colors duration-300 mb-4">
                    {card.title}
                  </h3>
                  <div className="flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                    <span className="text-sm sm:text-base font-semibold">View Details</span>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-2 transform group-hover:translate-x-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;

