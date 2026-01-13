import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_URL } from "../config/config";
import { TiTick } from "react-icons/ti";

const DisableUsers = () => {
  const [activeModelOpen, setActiveModelOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");

  const formatDataTime = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
  };

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backend_URL}/admin/getAllUsersByStatus`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setUsers(response.data.allDisableUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleActiveModel = (userId) => {
    setActiveModelOpen(true);
    setUserID(userId);
  };

  const handleActiveUser = async (id) => {
    try {
      const response = await axios.put(
        `${backend_URL}/admin/activeUserAccountStatus/${id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert(response.data.message);
      setUsers(users.filter((user) => user._id !== id));
      setActiveModelOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Error in activating user");
      console.log(error);
    }
  };

  const clearUserDevices = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to clear all devices for ${username}? This will log them out from all devices.`)) {
      return;
    }

    try {
      const response = await axios.post(
        `${backend_URL}/admin/users/${userId}/clear-devices`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        alert(`Successfully cleared ${response.data.data.devicesDeleted} device(s) for ${username}`);
      } else {
        alert(response.data.message || "Failed to clear devices");
      }
    } catch (error) {
      console.error("Error clearing devices:", error);
      alert(error.response?.data?.message || error.message || "Failed to clear devices");
    }
  };

  return (
    <React.Fragment>
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6 sm:mb-8 animate-fadeIn">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-red-400 via-rose-400 to-red-400 bg-clip-text text-transparent bg-[length:200%_auto] mb-2">
              Disabled Users
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base font-medium">View and reactivate disabled users</p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-20 animate-fadeIn">
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-semibold text-gray-300">Loading users...</p>
              </div>
            </div>
          ) : users.length > 0 ? (
            <div className="mt-6 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 shadow-2xl border border-white/10 animate-slideUp">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-gradient-to-r from-red-600/80 via-rose-600/80 to-red-600/80 backdrop-blur-sm">
                      <tr>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">Username</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden lg:table-cell">Email</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Subscription</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">Registered</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden lg:table-cell">Expiry</th>
                        <th className="px-8 sm:px-10 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                        <th className="px-8 sm:px-10 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-white/10">
                      {users.map((user, index) => (
                        <tr
                          key={user._id}
                          className={`hover:bg-white/5 transition-all duration-300 ${index % 2 === 0 ? "bg-transparent" : "bg-white/5"}`}
                        >
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-100">{index + 1}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-medium">{user.name}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">{user.username}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">{user.email}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <span className="text-blue-300">
                              {user.subscription} : {user?.expiryPeriod || "2 Weeks"}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">{formatDataTime(user.createdAt)}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">{formatDataTime(user.expiry)}</td>
                          <td className="px-8 sm:px-10 py-4 whitespace-nowrap">
                            <span className={`text-xs font-semibold ${
                              user.accountStatus === "Active"
                                ? "text-green-300"
                                : "text-red-300"
                            }`}>
                              {user.accountStatus}
                            </span>
                          </td>
                          <td className="px-8 sm:px-10 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <button
                                title="Clear All Devices"
                                onClick={() => clearUserDevices(user._id, user.username)}
                                className="text-orange-400 hover:text-orange-300 hover:scale-125 transition-all duration-300"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </button>
                              <TiTick
                                size={24}
                                className="text-green-400 cursor-pointer hover:text-green-300 hover:scale-125 transition-all duration-300 w-4 h-4 sm:w-6 sm:h-6"
                                onClick={() => handleActiveModel(user._id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-2xl sm:rounded-3xl shadow-2xl p-12 text-center border border-white/10 animate-slideUp">
              <svg className="mx-auto h-20 w-20 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-100 mb-2">No Disabled Users</h3>
              <p className="text-gray-400">No disabled users found in the library.</p>
            </div>
          )}
        </div>
      </main>

      {activeModelOpen && (
        <div className="fixed inset-0 p-4 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-2xl sm:rounded-3xl shadow-2xl md:w-1/3 p-6 sm:p-8 border border-white/10 animate-slideUp">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full border border-green-500/30">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-100 mb-2">
              Activate User?
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Are you sure you want to activate this user account?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setActiveModelOpen(false)}
                className="px-6 py-3 bg-gray-700/50 backdrop-blur-sm text-gray-200 rounded-xl font-semibold hover:bg-gray-700/70 border border-white/10 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleActiveUser(userID)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Activate</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default DisableUsers;
