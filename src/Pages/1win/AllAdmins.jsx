import React, { useEffect, useState } from 'react';
import api from '../../utils/1win/axios';
import { toast } from 'react-toastify';
import { FaUserShield, FaEnvelope, FaUser, FaLink, FaCopy } from 'react-icons/fa';

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/admins-list');
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getInviteLink = (inviteCode) => {
    const frontendUrl = 'http://localhost:5177'; // 1Win User Platform URL
    return `${frontendUrl}/${inviteCode}`;
  };

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
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
            All Admins
          </h1>
          <p className="text-gray-400 text-lg font-medium">View all admin users in the system</p>
        </div>

        {admins.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
            <FaUserShield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No admins found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-purple-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-3 rounded-lg">
                      <FaUserShield className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {admin.name || 'Admin User'}
                      </h3>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <FaEnvelope className="text-xs" />
                        {admin.email}
                      </p>
                    </div>
                  </div>
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Admin
                  </span>
                </div>

                {admin.inviteCode && (
                  <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                    <label className="text-gray-400 text-xs mb-1 block">Invite Code</label>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono font-semibold">{admin.inviteCode}</span>
                      <button
                        onClick={() => copyToClipboard(admin.inviteCode)}
                        className="ml-auto text-gray-400 hover:text-white transition-colors"
                      >
                        <FaCopy className="text-sm" />
                      </button>
                    </div>
                  </div>
                )}

                {admin.inviteCode && (
                  <div className="mb-4">
                    <label className="text-gray-400 text-xs mb-1 block">Invite Link</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={getInviteLink(admin.inviteCode)}
                        readOnly
                        className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(getInviteLink(admin.inviteCode))}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Role</div>
                    <div className="text-white font-semibold capitalize">{admin.role || 'admin'}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Status</div>
                    <div className={`font-semibold ${admin.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>

                {admin.createdAt && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-gray-500 text-xs">
                      Created: {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAdmins;

