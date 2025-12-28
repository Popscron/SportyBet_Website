import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { backend_URL } from "../config/config";
import { Link } from "react-router-dom";
import EditUserModal from "./EditUserModal";

const Users = () => {
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
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
        const response = await axios.get(`${backend_URL}/admin/getAllUsers`);
        setUsers(response.data.allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleDeleteModel = (userId) => {
    setUserID(userId);
    setDeleteModelOpen(true);
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(
        `${backend_URL}/admin/deleteUser/${id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert(response.data.message);
      setUsers(users.filter((user) => user._id !== id));
      setDeleteModelOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Hold" : "Active";
    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this user?"
        : "Are you sure you want to activate this user again?";

    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await axios.patch(
        `${backend_URL}/update-status/${id}`,
        { status: newStatus },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert(response.data.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, accountStatus: newStatus } : user
        )
      );
    } catch (error) {
      alert(error.response?.data?.error || "Error updating user status");
    }
  };

  return (
    <React.Fragment>
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col gap-4 sm:gap-5 md:flex-row md:justify-between md:items-center mb-6 sm:mb-8 animate-fadeIn">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] mb-2">
            Registered Users
          </h2>
              <p className="text-gray-400 mt-2 text-sm sm:text-base font-medium">Manage all registered users</p>
            </div>
          <Link
            to="/adduser"
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] hover:bg-[length:100%_auto] text-white text-sm sm:text-base rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto relative overflow-hidden group"
            >
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="relative z-10">Add User</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </Link>
        </header>

        {loading ? (
            <div className="flex items-center justify-center py-20 animate-fadeIn">
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-12 w-12 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                    <thead className="bg-gradient-to-r from-purple-600/80 via-indigo-600/80 to-purple-600/80 backdrop-blur-sm">
                      <tr>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">Username</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">Number</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden lg:table-cell">Email</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Subscription</th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Addons</th>
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
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">{user.mobileNumber}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">{user.email}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <span className="text-blue-300">
                      {user.subscription} : {user?.expiryPeriod}
                            </span>
                    </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/user-addons/${user._id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500/80 to-purple-500/80 backdrop-blur-sm text-white rounded-lg text-xs font-semibold hover:from-indigo-400 hover:to-purple-400 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-purple-500/25 border border-white/20"
                        title="Manage Addons"
                      >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                              </svg>
                              <span className="hidden sm:inline">Addons</span>
                      </Link>
                    </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">{formatDataTime(user.createdAt)}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">{formatDataTime(user.expiry)}</td>
                          <td className="px-8 sm:px-10 py-4 whitespace-nowrap">
                      <button
                              onClick={() => toggleUserStatus(user._id, user.accountStatus)}
                              className={`text-xs font-semibold transition-all duration-300 ${
                          user.accountStatus === "Active"
                                  ? "text-green-300 hover:text-green-200"
                                  : "text-red-300 hover:text-red-200"
                        }`}
                      >
                              {user.accountStatus === "Active" ? "Active" : "Deactive"}
                      </button>
                    </td>
                          <td className="px-8 sm:px-10 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <FaEdit
                          title="Edit User"
                          className="text-blue-400 cursor-pointer hover:text-blue-300 hover:scale-125 transition-all duration-300 w-4 h-4 sm:w-5 sm:h-5"
                          onClick={() => {
                            setSelectedUserId(user._id);
                            setEditModalOpen(true);
                          }}
                        />
                        <FaRegTrashAlt
                          title="Delete User"
                          className="text-red-400 cursor-pointer hover:text-red-300 hover:scale-125 transition-all duration-300 w-4 h-4 sm:w-5 sm:h-5"
                          onClick={() => handleDeleteModel(user._id)}
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
              <h3 className="text-2xl font-bold text-gray-100 mb-2">No Users Found</h3>
              <p className="text-gray-400">No registered users found in the library.</p>
            </div>
          )}
        </div>
      </main>

      {deleteModelOpen && (
        <div className="fixed inset-0 p-4 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md mx-4 p-6 sm:p-8 transform transition-all duration-300 scale-100 border border-white/10 animate-slideUp">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full border border-red-500/30">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-100 mb-2">
              Delete User?
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setDeleteModelOpen(false)}
                className="px-6 py-3 bg-gray-700/50 backdrop-blur-sm text-gray-200 rounded-xl font-semibold hover:bg-gray-700/70 border border-white/10 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(userID)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Delete</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
        onUpdateSuccess={() => {
          // Refresh users list after successful update
          const getUsers = async () => {
            setLoading(true);
            try {
              const response = await axios.get(`${backend_URL}/admin/getAllUsers`);
              setUsers(response.data.allUsers);
            } catch (error) {
              console.error("Error fetching users:", error);
            } finally {
              setLoading(false);
            }
          };
          getUsers();
        }}
      />
    </React.Fragment>
  );
};

export default Users;
