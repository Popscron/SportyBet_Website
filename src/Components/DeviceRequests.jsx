import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backend_URL } from "../config/config";

const StatusBadge = ({ status }) => {
  const color =
    status === "approved"
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : status === "rejected"
      ? "bg-red-500/20 text-red-300 border-red-500/30"
      : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${color} shadow-sm`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const SubscriptionBadge = ({ type }) => {
  const color = type === "Premium" 
    ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
    : "bg-blue-500/20 text-blue-300 border-blue-500/30";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${color} shadow-sm`}>
      {type || "Basic"}
    </span>
  );
};

const DeviceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectReasons, setRejectReasons] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [activeDevices, setActiveDevices] = useState([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  const fetchRequests = async (status) => {
    setLoading(true);
    setError("");
    try {
      const url = `${backend_URL}/admin/device-requests${status ? `?status=${status}` : ""}`;
      console.log("Fetching device requests from:", url);
      const res = await axios.get(
        url,
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      console.log("Device requests response:", res.data);
      setRequests(res.data?.data || []);
    } catch (e) {
      console.error("Error fetching device requests:", e);
      console.error("Response:", e.response);
      setError(e.response?.data?.message || e.message || "Failed to load device requests");
      // If 404, provide more helpful error message
      if (e.response?.status === 404) {
        setError("Device requests endpoint not found. Please ensure the server is running and routes are registered.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchActiveDevices = async (requestId) => {
    setLoadingDevices(true);
    try {
      const res = await axios.get(
        `${backend_URL}/admin/device-requests/${requestId}/devices`,
        { withCredentials: true }
      );
      setActiveDevices(res.data?.data || []);
      setShowDeviceModal(true);
    } catch (e) {
      console.error("Error fetching active devices:", e);
      alert(e.response?.data?.message || e.message || "Failed to load devices");
    } finally {
      setLoadingDevices(false);
    }
  };

  const approveRequest = async (id, deviceIdsToLogout = null) => {
    try {
      setActionLoadingId(id);
      const body = deviceIdsToLogout && deviceIdsToLogout.length > 0 ? { deviceIdsToLogout } : {};
      await axios.put(
        `${backend_URL}/admin/device-requests/${id}/approve`,
        body,
        { withCredentials: true }
      );
      await fetchRequests(filter);
      setShowDeviceModal(false);
      setSelectedDeviceIds([]);
      setActiveDevices([]);
      alert("Device request approved successfully!");
    } catch (e) {
      alert(e.response?.data?.message || e.message || "Failed to approve request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApproveWithDevice = () => {
    if (!selectedDeviceIds || selectedDeviceIds.length === 0) {
      alert("Please select at least one device to logout");
      return;
    }
    const requestId = selectedRequest?._id;
    if (requestId) {
      approveRequest(requestId, selectedDeviceIds);
    }
  };

  const handleDeviceToggle = (deviceId) => {
    setSelectedDeviceIds((prev) => {
      if (prev.includes(deviceId)) {
        return prev.filter((id) => id !== deviceId);
      } else {
        return [...prev, deviceId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedDeviceIds.length === activeDevices.length) {
      setSelectedDeviceIds([]);
    } else {
      setSelectedDeviceIds(activeDevices.map((device) => device.deviceId));
    }
  };

  const rejectRequest = async (id) => {
    try {
      setActionLoadingId(id);
      const reason = rejectReasons[id] || "No reason provided";
      await axios.put(
        `${backend_URL}/admin/device-requests/${id}/reject`,
        { rejectionReason: reason },
        { withCredentials: true }
      );
      await fetchRequests(filter);
      setRejectReasons((prev) => ({ ...prev, [id]: "" }));
      alert("Device request rejected successfully!");
    } catch (e) {
      alert(e.response?.data?.message || e.message || "Failed to reject request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const tableRows = useMemo(() => requests, [requests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-5 animate-fadeIn">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-400 via-slate-400 to-gray-400 bg-clip-text text-transparent bg-[length:200%_auto] mb-2">
              Device Requests
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base font-medium">Manage user device registration requests</p>
          </div>
          <select
            className="px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-700/50 rounded-xl focus:border-gray-500/50 focus:ring-2 focus:ring-gray-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-sm sm:text-base font-semibold text-gray-100 shadow-md w-full md:w-auto hover:bg-gray-800/70"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {error ? (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium backdrop-blur-sm animate-slideUp">
            {error}
          </div>
        ) : null}

        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 shadow-2xl border border-white/10 overflow-hidden animate-slideUp">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-gradient-to-r from-gray-600/80 via-slate-600/80 to-gray-600/80 backdrop-blur-sm">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">User</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden lg:table-cell">Device Info</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Subscription</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden xl:table-cell">Requested At</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-white/10">
                  {loading ? (
                    <tr>
                      <td className="p-8 text-center" colSpan={6}>
                        <div className="flex flex-col items-center gap-4">
                          <svg className="animate-spin h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-gray-300 font-semibold">Loading...</p>
                        </div>
                      </td>
                    </tr>
                  ) : tableRows.length === 0 ? (
                    <tr>
                      <td className="p-8 text-center" colSpan={6}>
                        <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-100 text-lg font-semibold">No device requests found</p>
                      </td>
                    </tr>
                  ) : (
                    tableRows.map((r) => (
                      <tr key={r._id} className="hover:bg-white/5 transition-all duration-300">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-100">
                            {r.userId?.name || r.userId?.email || r.userId?.username || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {r.userId?.email || r.userId?.mobileNumber || ""}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-sm text-gray-100 font-medium">
                            {r.deviceInfo?.deviceName || "Unknown Device"}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {r.deviceInfo?.platform || "Unknown"} • {r.deviceInfo?.deviceType || "unknown"}
                          </div>
                          {r.deviceInfo?.modelName && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {r.deviceInfo.modelName}
                            </div>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <SubscriptionBadge type={r.subscriptionType} />
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden xl:table-cell">
                          {new Date(r.requestedAt || r.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            {r.status === "pending" && (
                              <>
                                <button
                                  disabled={loadingDevices || actionLoadingId === r._id}
                                  className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
                                  onClick={() => {
                                    setSelectedRequest(r);
                                    fetchActiveDevices(r._id);
                                  }}
                                >
                                  <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loadingDevices && selectedRequest?._id === r._id ? (
                                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    ) : (
                                      "View Devices"
                                    )}
                                  </span>
                                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                </button>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Rejection reason"
                                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-700/50 rounded-xl focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all duration-300 bg-gray-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-500 text-xs sm:text-sm hover:bg-gray-800/70 focus:bg-gray-800/70"
                                    value={rejectReasons[r._id] || ""}
                                    onChange={(e) =>
                                      setRejectReasons((prev) => ({ ...prev, [r._id]: e.target.value }))
                                    }
                                  />
                                  <button
                                    disabled={actionLoadingId === r._id}
                                    className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-red-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
                                    onClick={() => rejectRequest(r._id)}
                                  >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                      {actionLoadingId === r._id ? (
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                      ) : (
                                        "Reject"
                                      )}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                  </button>
                                </div>
                              </>
                            )}
                            {r.status === "rejected" && r.rejectionReason && (
                              <div className="text-xs text-red-400 italic">
                                Reason: {r.rejectionReason}
                              </div>
                            )}
                            {r.status === "approved" && (
                              <div className="text-xs text-green-400">
                                Approved {r.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString() : ""}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Device Selection Modal */}
      {showDeviceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Select Devices to Logout</h3>
                <button
                  onClick={() => {
                    setShowDeviceModal(false);
                    setSelectedDeviceIds([]);
                    setActiveDevices([]);
                    setSelectedRequest(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {activeDevices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No active devices found</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      {selectedDeviceIds.length === activeDevices.length ? "Deselect All" : "Select All"}
                    </button>
                    <span className="text-sm text-gray-400">
                      {selectedDeviceIds.length} of {activeDevices.length} selected
                    </span>
                  </div>
                  <div className="space-y-3 mb-6">
                    {activeDevices.map((device) => (
                      <label
                        key={device._id}
                        className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedDeviceIds.includes(device.deviceId)
                            ? "border-green-500 bg-green-500/10"
                            : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDeviceIds.includes(device.deviceId)}
                          onChange={() => handleDeviceToggle(device.deviceId)}
                          className="mt-1 mr-3 w-5 h-5 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <div className="flex-1">
                          <div className="text-white font-semibold mb-1">
                            {device.deviceName || "Unknown Device"}
                          </div>
                          <div className="text-sm text-gray-400 space-y-1">
                            {device.modelName && (
                              <div className="text-xs text-gray-500 mb-1">
                                {device.modelName}
                              </div>
                            )}
                            <div>Platform: {device.platform || "Unknown"}</div>
                            <div>Device ID: {device.deviceId}</div>
                            {device.lastLoginAt && (
                              <div>Last Login: {new Date(device.lastLoginAt).toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeviceModal(false);
                        setSelectedDeviceIds([]);
                        setActiveDevices([]);
                        setSelectedRequest(null);
                      }}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApproveWithDevice}
                      disabled={!selectedDeviceIds || selectedDeviceIds.length === 0 || actionLoadingId === selectedRequest?._id}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-green-500/25 transition-all"
                    >
                      {actionLoadingId === selectedRequest?._id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Approving...
                        </span>
                      ) : (
                        "Approve & Logout"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceRequests;

