import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dashboardCards = [
    { to: "/users", title: "Users", icon: "👥", gradient: "from-blue-500 to-cyan-500", delay: "0" },
    { to: "/pending-registrations", title: "Pending Registrations", icon: "⏳", gradient: "from-orange-500 to-red-500", delay: "50" },
    { to: "/activeUsers", title: "Active Users", icon: "✅", gradient: "from-green-500 to-emerald-500", delay: "100" },
    { to: "/disableUsers", title: "Disable Users", icon: "🚫", gradient: "from-red-500 to-rose-500", delay: "200" },
    { to: "/adduser", title: "Add User", icon: "➕", gradient: "from-purple-500 to-pink-500", delay: "300" },
    { to: "/expiredUsers", title: "Expired User", icon: "⏰", gradient: "from-orange-500 to-amber-500", delay: "400" },
    { to: "/IOSHomeScreen", title: "Banners", icon: "📱", gradient: "from-indigo-500 to-purple-500", delay: "500" },
    { to: "/match-uploaded", title: "Match Uploaded", icon: "⚽", gradient: "from-teal-500 to-cyan-500", delay: "600" },
    { to: "/instant-football-matches", title: "Instant Football Matches", icon: "🎮", gradient: "from-green-500 to-emerald-600", delay: "650" },
    { to: "/password-change-requests", title: "Password Change Requests", icon: "🔐", gradient: "from-gray-500 to-slate-500", delay: "700" },
    { to: "/device-requests", title: "Device Requests", icon: "📱", gradient: "from-cyan-500 to-blue-500", delay: "800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10 md:mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] mb-3 sm:mb-4">
            Dashboard
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl font-medium">Manage your SportyBet administration</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-7">
          {dashboardCards.map((card, index) => (
            <Link
              key={card.to}
              to={card.to}
              className="group relative backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transform hover:scale-[1.05] transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/30 animate-slideUp"
              style={{ animationDelay: `${parseInt(card.delay)}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
              <div className="relative p-8 sm:p-9 md:p-10 text-center flex flex-col items-center justify-center min-h-[200px]">
                <div className="text-6xl sm:text-7xl mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 filter drop-shadow-lg">{card.icon}</div>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
