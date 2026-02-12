import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { backend_URL } from "../config/config.js";
import { useAuth } from "../Context/AuthContext.jsx";
import { ADMIN_TOKEN_KEY } from "../config/axiosInterceptors.js";

const Login = () => {
  const navigate = useNavigate();

  const { setAuthUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [signinLoading, setSigninLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.email || !formData.password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setSigninLoading(true);
      const response = await axios.post(
        `${backend_URL}/admin/login`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      setError(null);
      setSuccessMessage(response.data.message);
      setAuthUser(response.data?.user);
      if (response.data?.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, response.data.token);
      }
      navigate("/");
    } catch (error) {
      setSuccessMessage(null);
      setError(
        error.response?.data?.message || "An error occurred during signin."
      );
    } finally {
      setSigninLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen flex flex-col gap-6 sm:gap-8 justify-center items-center relative overflow-hidden px-4 py-8">
      {/* Modern animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <Link to="/" className="flex items-center justify-center gap-2 relative z-10 px-4 animate-fadeIn">
        <div className="text-center">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient bg-clip-text drop-shadow-2xl">
            SportyBet
          </p>
          <p className="text-sm sm:text-base text-gray-400 mt-2 font-medium">Admin Dashboard</p>
        </div>
      </Link>
      
      <form
        className="backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 p-6 sm:p-8 md:p-10 w-full max-w-md rounded-3xl shadow-2xl relative z-10 border border-white/10 mx-4 animate-slideUp"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto]">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-2 text-sm sm:text-base font-medium">Sign in to continue to your dashboard</p>
        </div>

        <div className="flex flex-col gap-5 mb-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              onChange={handleFormChange}
              value={formData.email}
              className="w-full px-4 py-3.5 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-500 hover:bg-gray-800/70 focus:bg-gray-800/70 text-sm sm:text-base"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              onChange={handleFormChange}
              value={formData.password}
              className="w-full px-4 py-3.5 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-500 hover:bg-gray-800/70 focus:bg-gray-800/70 text-sm sm:text-base"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={signinLoading}
          className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] hover:bg-[length:100%_auto] text-white py-3.5 px-6 rounded-xl font-semibold text-base shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {signinLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>

        {error && (
          <div className="mt-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium animate-slideUp backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="mt-5 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm font-medium animate-slideUp backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
