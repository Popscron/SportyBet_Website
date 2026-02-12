import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useAppToggle } from "../Context/AppToggleContext";
import axios from "axios";
import { backend_URL } from "../config/config";
import { ADMIN_TOKEN_KEY } from "../config/axiosInterceptors";

const Header = () => {
  const { setAuthUser, authUser } = useAuth();
  const { activeApp, switchToApp } = useAppToggle();
  const navigate = useNavigate();

  // Check if user is logged into 1Win
  const oneWinToken = localStorage.getItem('admin_token');
  const isOneWinAuthenticated = Boolean(oneWinToken);
  
  // Show toggle if logged into either SportyBet or 1Win
  const showToggle = authUser || isOneWinAuthenticated;

  const handleAppSwitch = (app) => {
    switchToApp(app);
    // Navigate to the appropriate route when switching apps
    if (app === 'sportybet') {
      navigate('/');
    } else if (app === '1win') {
      // Check if user has 1win token, if not go to login
      if (oneWinToken) {
        navigate('/1win');
      } else {
        navigate('/1win/login');
      }
    }
  };

  const handleLogout = async () => {
    try {
      // If logged into SportyBet, call SportyBet logout
      if (authUser) {
        await axios.post(
          `${backend_URL}/auth/logout`,
          {},
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setAuthUser(null);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        navigate("/login");
      } 
      // If logged into 1Win, just remove token and navigate
      else if (isOneWinAuthenticated) {
        localStorage.removeItem('admin_token');
        navigate("/1win/login");
      }
    } catch (err) {
      console.error("Logout error:", err.message);
      // Even if logout fails, clear local state
      if (authUser) {
        setAuthUser(null);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        navigate("/login");
      } else if (isOneWinAuthenticated) {
        localStorage.removeItem('admin_token');
        navigate("/1win/login");
      }
    }
  };

  return (
    <header className="flex items-center justify-between w-full p-4 sm:p-5 md:px-8 lg:px-12 backdrop-blur-xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 shadow-lg border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
      <Link 
        to="/" 
        className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] hover:bg-[length:100%_auto] transition-all duration-500 hover:scale-105"
      >
        {activeApp === 'sportybet' ? 'SportyBet' : '1Win Control Panel'}
      </Link>
      
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Toggle Button */}
        {showToggle && (
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => handleAppSwitch('sportybet')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeApp === 'sportybet'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              SportyBet
            </button>
            <button
              onClick={() => handleAppSwitch('1win')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeApp === '1win'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              1Win
            </button>
          </div>
        )}
        
        {/* Logout Button */}
        {showToggle && (
          <button
            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm sm:text-base font-semibold shadow-lg hover:shadow-red-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
            onClick={() => handleLogout()}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline relative z-10">Logout</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
