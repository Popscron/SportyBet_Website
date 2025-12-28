import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/1win/axios';
import { toast } from 'react-toastify';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
    currency: 'GHS',
    subscriptionType: '',
    subscriptionExpiry: '',
    isActive: true,
    role: 'user',
  });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      const user = response.data.data;
      
      // Determine subscription type from expiry (support both field names)
      let subscriptionType = '';
      const expiryDate = user.subscriptionExpiresAt || user.subscriptionExpiry;
      if (expiryDate) {
        const expiry = new Date(expiryDate);
        const now = new Date();
        const monthsDiff = (expiry.getFullYear() - now.getFullYear()) * 12 + (expiry.getMonth() - now.getMonth());
        if (monthsDiff <= 1) subscriptionType = '1month';
        else if (monthsDiff <= 3) subscriptionType = '3months';
      }

      setFormData({
        email: user.email || '',
        phone: user.phone || '',
        name: user.name || '',
        currency: user.currency || 'GHS',
        subscriptionType,
        subscriptionExpiry: expiryDate || '', // Keep for form state, will be converted to subscriptionExpiresAt on submit
        isActive: user.isActive !== false,
        role: user.role || (user.isAdmin ? 'admin' : 'user'),
      });
    } catch (error) {
      toast.error('Failed to fetch user');
      navigate('/1win/users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateExpiry = (subscriptionType) => {
    if (!subscriptionType) return null;
    const expiry = new Date();
    if (subscriptionType === '1month') {
      expiry.setMonth(expiry.getMonth() + 1);
    } else if (subscriptionType === '3months') {
      expiry.setMonth(expiry.getMonth() + 3);
    }
    return expiry.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userData = {
        ...formData,
        subscriptionExpiresAt: formData.subscriptionType ? calculateExpiry(formData.subscriptionType) : null,
      };
      
      // Remove subscriptionExpiry from data (use subscriptionExpiresAt instead)
      delete userData.subscriptionExpiry;
      
      // Convert empty strings to null for optional fields
      if (userData.phone === '') userData.phone = null;
      if (userData.email === '') userData.email = null;

      await api.put(`/admin/users/${id}`, userData);
      toast.success('User updated successfully!');
      navigate('/1win/users');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Edit User
          </h1>
          <p className="text-gray-400">Update user information</p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="GHS">GHS</option>
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="NGN">NGN</option>
                  <option value="INR">INR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">User Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Only admin users can login to 1Win mobile app
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Subscription Type</label>
              <select
                name="subscriptionType"
                value={formData.subscriptionType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="">No Subscription</option>
                <option value="1month">1 Month</option>
                <option value="3months">3 Months</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-white/10 bg-gray-800 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-semibold text-gray-300">Active User</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/1win/users')}
                className="flex-1 px-6 py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;





