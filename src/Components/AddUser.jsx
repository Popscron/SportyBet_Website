import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backend_URL } from "../config/config";

const AddUser = () => {
  const navigate = useNavigate();
  const [addUserSuccessMessage, setAddUserSuccessMessage] = useState(null);
  const [addUserErrorMessage, setAddUserErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    mobileNumber: "",
    expiryDate: "",
    expiryPeriod: "",
    subscription: "Basic",
    role: "user",
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setAddUserErrorMessage(null);
      setAddUserSuccessMessage(null);
      setLoading(true);

      const now = new Date();
      const daysToAdd = parseInt(formData.expiryDate);
      const expiryDateISO = new Date(now.setDate(now.getDate() + daysToAdd)).toISOString();

      const payload = {
        ...formData,
        expiryDate: expiryDateISO,
        expiryPeriod: formData.expiryDate
      };

      const res = await axios.post(`${backend_URL}/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setAddUserSuccessMessage(res.data.message);
      setLoading(false);
      setTimeout(() => navigate("/users"), 1000);
    } catch (error) {
      setAddUserSuccessMessage(null);
      setAddUserErrorMessage(
        error.response?.data?.message || "Unknown error occurred."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8 animate-fadeIn px-2 sm:px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] mb-2">
            Add New User
          </h2>
          <p className="text-gray-400 mt-2 text-sm sm:text-base font-medium">Create a new user account</p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 md:p-10 lg:p-12 animate-slideUp">
          {addUserErrorMessage && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium backdrop-blur-sm animate-slideUp">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {addUserErrorMessage}
              </div>
            </div>
          )}
          {addUserSuccessMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm font-medium backdrop-blur-sm animate-slideUp">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {addUserSuccessMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleAddUser} className="space-y-6 sm:space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChangeInput}
                  placeholder="Name *"
                  className="w-full px-5 py-4 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-500 hover:bg-gray-800/70 focus:bg-gray-800/70 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChangeInput}
                  placeholder="Username *"
                  className="w-full px-5 py-4 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-500 hover:bg-gray-800/70 focus:bg-gray-800/70 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChangeInput}
                  placeholder="Email *"
                  className="w-full px-5 py-4 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-500 hover:bg-gray-800/70 focus:bg-gray-800/70 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChangeInput}
                  placeholder="Mobile Number *"
                  className="w-full px-5 py-4 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-500 hover:bg-gray-800/70 focus:bg-gray-800/70 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChangeInput}
                placeholder="Password *"
                className="w-full px-5 py-4 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-500 hover:bg-gray-800/70 focus:bg-gray-800/70 text-sm sm:text-base"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7">
              <div>
                <select
                  name="subscription"
                  value={formData.subscription}
                  onChange={handleChangeInput}
                  className="w-full px-5 py-4 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 hover:bg-gray-800/70 focus:bg-gray-800/70 text-sm sm:text-base"
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChangeInput}
                  className="w-full px-5 py-4 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 hover:bg-gray-800/70 focus:bg-gray-800/70 text-sm sm:text-base"
                >
                  <option value="user">Role: User</option>
                  <option value="admin">Role: Admin</option>
                </select>
              </div>

              <div>
                <select
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChangeInput}
                  className="w-full px-5 py-4 border border-gray-700/50 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 hover:bg-gray-800/70 focus:bg-gray-800/70 text-sm sm:text-base"
                  required
                >
                  <option value="">Expiry Period *</option>
                  <option value={14}>2 Weeks</option>
                  <option value={30}>1 Month</option>
                  <option value={60}>2 Months</option>
                  <option value={90}>3 Months</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-purple-400 hover:text-purple-300 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding User...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
