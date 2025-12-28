import React, { useEffect, useState } from 'react';
import api from '../../utils/1win/axios';
import { toast } from 'react-toastify';
import { FaCopy, FaDollarSign, FaLink, FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const AdminUserDashboard = () => {
  const [inviteLink, setInviteLink] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [referredUsers, setReferredUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch each endpoint separately so one failure doesn't block others
      const results = await Promise.allSettled([
        api.get('/admin/my-invite-link'),
        api.get('/admin/my-earnings'),
        api.get('/admin/my-referred-users'),
      ]);

      // Handle invite link response
      if (results[0].status === 'fulfilled') {
        setInviteLink(results[0].value.data.data);
      } else {
        console.error('Error fetching invite link:', results[0].reason);
        if (results[0].reason.response?.status === 404) {
          toast.info('Invite code not found. Please contact main admin.');
        }
      }

      // Handle earnings response
      if (results[1].status === 'fulfilled') {
        setEarnings(results[1].value.data.data);
      } else {
        console.error('Error fetching earnings:', results[1].reason);
      }

      // Handle referred users response
      if (results[2].status === 'fulfilled') {
        setReferredUsers(results[2].value.data.data);
      } else {
        console.error('Error fetching referred users:', results[2].reason);
      }
    } catch (error) {
      console.error('Unexpected error fetching admin data:', error);
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Owner Dashboard</h1>
          <p className="text-gray-400">1Win Control Panel - Manage your referrals, earnings, and client registration</p>
        </div>

        {/* Stats Cards */}
        {referredUsers && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-800">
              <div className="text-gray-400 text-sm mb-1">Total Referred</div>
              <div className="text-2xl font-bold text-white">{referredUsers.totalReferredUsers}</div>
            </div>
            <div className="bg-gray-900 rounded-xl shadow-lg p-4 border border-green-600/30">
              <div className="text-green-400 text-sm mb-1">Paid Users</div>
              <div className="text-2xl font-bold text-green-400">{referredUsers.paidUsers}</div>
            </div>
            <div className="bg-gray-900 rounded-xl shadow-lg p-4 border border-yellow-600/30">
              <div className="text-yellow-400 text-sm mb-1">Expired</div>
              <div className="text-2xl font-bold text-yellow-400">{referredUsers.expiredUsers}</div>
            </div>
            <div className="bg-gray-900 rounded-xl shadow-lg p-4 border border-red-600/30">
              <div className="text-red-400 text-sm mb-1">Not Paid</div>
              <div className="text-2xl font-bold text-red-400">{referredUsers.unpaidUsers}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Client Registration Link Card */}
          <div className="bg-gray-900 rounded-xl p-6 border border-green-600/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-lg">
                <FaLink className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-bold text-white">Client Registration Link</h2>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Share this link with your clients to register on 1Win</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value="https://1wgcmt.com/?p=eonx"
                  readOnly
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg text-sm border border-gray-700"
                />
                <button
                  onClick={() => copyToClipboard("https://1wgcmt.com/?p=eonx")}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                >
                  <FaCopy /> Copy
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">This is the main registration link for 1Win</p>
            </div>
          </div>

          {/* My Referral Link Card */}
          <div className="bg-gray-900 rounded-xl p-6 border border-blue-600/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-lg">
                <FaLink className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-bold text-white">My Referral Link</h2>
            </div>

            {inviteLink ? (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Share this link to track referrals and earn commissions</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inviteLink.inviteLink}
                    readOnly
                    className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg text-sm border border-gray-700"
                  />
                  <button
                    onClick={() => copyToClipboard(inviteLink.inviteLink)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                  >
                    <FaCopy /> Copy
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-2">Invite Code: <span className="font-mono font-semibold">{inviteLink.inviteCode}</span></p>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                <p>No invite code assigned. Please contact main admin.</p>
              </div>
            )}
          </div>

          {/* Earnings Summary Card */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg">
                <FaDollarSign className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-bold text-white">My Earnings</h2>
            </div>

            {earnings ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Total Payments</div>
                    <div className="text-white text-2xl font-bold">{earnings.totalPayments}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Total Amount</div>
                    <div className="text-white text-2xl font-bold">{earnings.totalAmount?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4">
                  <div className="text-white text-sm mb-1">Your Earnings (50%)</div>
                  <div className="text-white text-3xl font-bold">{earnings.totalEarnings?.toFixed(2) || '0.00'}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                <p>No earnings yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Referred Users List */}
        {referredUsers && referredUsers.users && referredUsers.users.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaUsers /> Referred Users ({referredUsers.totalReferredUsers})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-gray-800 text-white">
                    <th className="text-left py-3 px-4 text-sm font-semibold">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Registered</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Payment Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Subscription</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Total Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {referredUsers.users.map((refUser) => (
                    <tr key={refUser.id} className="hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-semibold text-white">{refUser.name || refUser.email}</div>
                          <div className="text-sm text-gray-400">{refUser.email}</div>
                          {refUser.accountId && (
                            <div className="text-xs text-gray-500 font-mono">ID: {refUser.accountId}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">
                        {new Date(refUser.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {refUser.paymentStatus === 'paid' ? (
                          <span className="inline-flex items-center gap-1 bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-600/30">
                            <FaCheckCircle /> Paid
                          </span>
                        ) : refUser.paymentStatus === 'expired' ? (
                          <span className="inline-flex items-center gap-1 bg-yellow-900/50 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-600/30">
                            <FaClock /> Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-xs font-semibold border border-red-600/30">
                            <FaTimesCircle /> Not Paid
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {refUser.subscriptionType ? (
                          <div>
                            <div className="capitalize font-semibold text-white">{refUser.subscriptionType}</div>
                            {refUser.subscriptionExpiresAt && (
                              <div className="text-xs text-gray-400">
                                {new Date(refUser.subscriptionExpiresAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No subscription</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {refUser.totalPaid > 0 ? (
                          <div>
                            <div className="font-semibold text-white">{refUser.totalPaid.toFixed(2)} GHS</div>
                            <div className="text-xs text-gray-400">{refUser.totalPayments} payment(s)</div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment History */}
        {earnings && earnings.payments && earnings.payments.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaDollarSign /> Payment History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-gray-800 text-white">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Your Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {earnings.payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-800">
                      <td className="text-gray-300 py-3 px-4">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-white py-3 px-4 capitalize font-semibold">{payment.planType}</td>
                      <td className="text-white py-3 px-4">
                        {payment.amount.toFixed(2)} {payment.currency}
                      </td>
                      <td className="text-green-400 py-3 px-4 font-bold">
                        {payment.earnings.toFixed(2)} {payment.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDashboard;
