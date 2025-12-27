import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backend_URL } from '../config/config';
import { toast } from 'react-toastify';

const EditUserModal = ({ isOpen, onClose, userId, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobileNumber: '',
    subscription: 'Basic',
    expiry: '',
    accountStatus: 'Active',
  });

  useEffect(() => {
    if (isOpen && userId) {
      fetchUser();
    }
  }, [isOpen, userId]);

  const fetchUser = async () => {
    try {
      setFetching(true);
      const response = await axios.get(`${backend_URL}/user/${userId}`);
      const user = response.data.user;
      
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
        subscription: user.subscription || 'Basic',
        expiry: user.expiry ? new Date(user.expiry).toISOString().split('T')[0] : '',
        accountStatus: user.accountStatus || 'Active',
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to fetch user data');
      onClose();
    } finally {
      setFetching(false);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name.trim(),
        username: formData.username.trim() || undefined,
        email: formData.email.trim() || undefined,
        mobileNumber: formData.mobileNumber.trim() || undefined,
        subscription: formData.subscription,
        expiry: formData.expiry || undefined,
        accountStatus: formData.accountStatus,
      };

      // Update basic profile info
      await axios.post(
        `${backend_URL}/update-profile`,
        {
          userId: userId,
          name: updateData.name,
          phone: updateData.mobileNumber,
          email: updateData.email,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // Update username, subscription, expiry, and account status using direct MongoDB update
      // We'll need to create a custom endpoint or use existing ones
      // For now, let's update what we can with existing endpoints
      
      // Update account status if changed
      if (updateData.accountStatus) {
        await axios.patch(
          `${backend_URL}/update-status/${userId}`,
          { status: updateData.accountStatus },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Update subscription, expiry, and username
      const additionalUpdates = {};
      if (updateData.username !== undefined) additionalUpdates.username = updateData.username || '';
      if (updateData.subscription !== undefined) additionalUpdates.subscription = updateData.subscription;
      if (updateData.expiry !== undefined) {
        additionalUpdates.expiry = updateData.expiry ? new Date(updateData.expiry).toISOString() : null;
      }
      
      if (Object.keys(additionalUpdates).length > 0) {
        await axios.put(
          `${backend_URL}/admin/updateUserFields`,
          { userId, ...additionalUpdates },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const response = { data: { message: 'User updated successfully!' } };

      toast.success(response.data.message || 'User updated successfully!');
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 p-4 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl mx-4 p-6 sm:p-8 transform transition-all duration-300 scale-100 border border-white/10 animate-slideUp max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Edit User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-12 w-12 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg font-semibold text-gray-300">Loading user data...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Subscription</label>
                <select
                  name="subscription"
                  value={formData.subscription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  disabled={loading}
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Account Status</label>
                <select
                  name="accountStatus"
                  value={formData.accountStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  disabled={loading}
                >
                  <option value="Active">Active</option>
                  <option value="Hold">Hold</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Subscription Expiry</label>
              <input
                type="date"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                disabled={loading}
              />
            </div>

            {/* User Devices Section */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-300">User Devices</label>
              </div>
              
              <p className="text-gray-400 text-center py-4">No devices found.</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-700/50 backdrop-blur-sm text-gray-200 rounded-xl font-semibold hover:bg-gray-700/70 border border-white/10 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group disabled:opacity-50"
              >
                <span className="relative z-10">{loading ? 'Saving...' : 'Save Changes'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUserModal;

