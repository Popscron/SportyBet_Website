import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import { backend_URL } from "../config/config";
import { Link } from "react-router-dom";
import EditUserModal from "./EditUserModal";
import { toast } from "react-toastify";

const PendingRegistrations = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const formatDateTime = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backend_URL}/admin/getAllUsersByStatus`);
      // Get users with "Hold" status (pending approval)
      setPendingUsers(response.data.allDisableUsers || []);
    } catch (error) {
      console.error("Error fetching pending users:", error);
      toast.error("Failed to load pending registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm("Are you sure you want to approve this user? They will be able to log in immediately.")) {
      return;
    }

    setApprovingId(userId);
    try {
      const response = await axios.put(
        `${backend_URL}/admin/activeUserAccountStatus/${userId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success("User approved successfully!");
        // Remove from pending list
        setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
      } else {
        toast.error(response.data.message || "Failed to approve user");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error(error.response?.data?.message || "Failed to approve user");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Are you sure you want to reject this registration? This action cannot be undone.")) {
      return;
    }

    setRejectingId(userId);
    try {
      const response = await axios.delete(
        `${backend_URL}/admin/deleteUser/${userId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(response.data.message || "Registration rejected");
      // Remove from pending list
      setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error(error.response?.data?.message || "Failed to reject registration");
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <React.Fragment>
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col gap-4 sm:gap-5 md:flex-row md:justify-between md:items-center mb-6 sm:mb-8 animate-fadeIn">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent bg-[length:200%_auto] mb-2">
                Pending Registrations
              </h2>
              <p className="text-gray-400 mt-2 text-sm sm:text-base font-medium">
                Review and approve user registrations from the app
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-xl font-semibold text-sm border border-orange-500/30">
                {pendingUsers.length} Pending
              </span>
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-20 animate-fadeIn">
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-12 w-12 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-semibold text-gray-300">Loading pending registrations...</p>
              </div>
            </div>
          ) : pendingUsers.length > 0 ? (
            <div className="mt-6 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 shadow-2xl border border-white/10 animate-slideUp">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-gradient-to-r from-orange-600/80 via-red-600/80 to-orange-600/80 backdrop-blur-sm">
                      <tr>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">Username</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">Mobile</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden lg:table-cell">Email</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">Registered</th>
                        <th className="px-8 sm:px-10 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-white/10">
                      {pendingUsers.map((user, index) => (
                        <tr
                          key={user._id}
                          className={`hover:bg-white/5 transition-all duration-300 ${index % 2 === 0 ? "bg-transparent" : "bg-white/5"}`}
                        >
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-100">{index + 1}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-medium">{user.name}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">{user.username || "N/A"}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">{user.mobileNumber || "N/A"}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">{user.email || "N/A"}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">{formatDateTime(user.createdAt)}</td>
                          <td className="px-8 sm:px-10 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setSelectedUserId(user._id);
                                  setEditModalOpen(true);
                                }}
                                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-300"
                                title="View Details"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleApprove(user._id)}
                                disabled={approvingId === user._id || rejectingId === user._id}
                                className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Approve"
                              >
                                {approvingId === user._id ? (
                                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <FaCheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(user._id)}
                                disabled={approvingId === user._id || rejectingId === user._id}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reject"
                              >
                                {rejectingId === user._id ? (
                                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <FaTimesCircle className="w-4 h-4" />
                                )}
                              </button>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-100 mb-2">All Clear!</h3>
              <p className="text-gray-400">No pending registrations at the moment.</p>
            </div>
          )}
        </div>
      </main>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
        onUpdateSuccess={() => {
          // Refresh pending users list after successful update
          fetchPendingUsers();
        }}
      />
    </React.Fragment>
  );
};

export default PendingRegistrations;

