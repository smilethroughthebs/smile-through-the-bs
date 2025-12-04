'use client';

/**
 * ==============================================
 * VARLIXO - ADMIN USER MANAGEMENT
 * ==============================================
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    kycStatus: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Mock data
      setUsers([
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          status: 'active',
          kycStatus: 'verified',
          mainBalance: 15000,
          totalDeposits: 25000,
          totalWithdrawals: 10000,
          totalEarnings: 5000,
          referralCode: 'JOHN123',
          referrals: 8,
          createdAt: '2024-01-15',
          lastLogin: '2024-02-01T10:30:00',
          twoFactorEnabled: true,
        },
        {
          _id: '2',
          firstName: 'Sarah',
          lastName: 'Miller',
          email: 'sarah.m@email.com',
          status: 'active',
          kycStatus: 'pending',
          mainBalance: 5000,
          totalDeposits: 7500,
          totalWithdrawals: 2500,
          totalEarnings: 1200,
          referralCode: 'SARAH456',
          referrals: 3,
          createdAt: '2024-01-20',
          lastLogin: '2024-02-01T08:15:00',
          twoFactorEnabled: false,
        },
        {
          _id: '3',
          firstName: 'Mike',
          lastName: 'Roberts',
          email: 'mike.r@email.com',
          status: 'suspended',
          kycStatus: 'rejected',
          mainBalance: 0,
          totalDeposits: 1000,
          totalWithdrawals: 1000,
          totalEarnings: 0,
          referralCode: 'MIKE789',
          referrals: 0,
          createdAt: '2024-01-25',
          lastLogin: '2024-01-30T14:00:00',
          twoFactorEnabled: false,
        },
      ]);
      setPagination(prev => ({ ...prev, total: 3, pages: 1 }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleBalanceAdjust = async (userId: string, amount: number, type: 'add' | 'subtract') => {
    try {
      toast.success(`Balance ${type === 'add' ? 'added' : 'subtracted'} successfully`);
      setShowUserModal(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to adjust balance');
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      active: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
      suspended: { color: 'bg-red-500/20 text-red-400', icon: Ban },
      pending: { color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  const getKycBadge = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      verified: { color: 'bg-green-500/20 text-green-400', icon: Shield },
      pending: { color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
      rejected: { color: 'bg-red-500/20 text-red-400', icon: XCircle },
      not_submitted: { color: 'bg-gray-500/20 text-gray-400', icon: Shield },
    };
    const config = configs[status] || configs.not_submitted;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
        <Icon size={12} />
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage all registered users</p>
        </div>
        <Button variant="secondary" leftIcon={<Download size={18} />}>
          Export Users
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp}>
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={filters.kycStatus}
              onChange={(e) => setFilters({ ...filters, kycStatus: e.target.value })}
              className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">All KYC</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} className="text-primary-500" />
              All Users
            </CardTitle>
            <span className="text-sm text-gray-500">{pagination.total} users</span>
          </CardHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b border-dark-600">
                      <th className="pb-4 pr-4">User</th>
                      <th className="pb-4 pr-4">Status</th>
                      <th className="pb-4 pr-4">KYC</th>
                      <th className="pb-4 pr-4">Balance</th>
                      <th className="pb-4 pr-4">Joined</th>
                      <th className="pb-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-dark-700/30 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                              {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4">{getStatusBadge(user.status)}</td>
                        <td className="py-4 pr-4">{getKycBadge(user.kycStatus)}</td>
                        <td className="py-4 pr-4">
                          <p className="text-white font-medium">${user.mainBalance.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">+${user.totalEarnings.toLocaleString()} earned</p>
                        </td>
                        <td className="py-4 pr-4 text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
                              className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(user._id, user.status === 'active' ? 'suspended' : 'active')}
                              className={`p-2 rounded-lg ${user.status === 'active' ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                            >
                              {user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-dark-600">
                  <p className="text-sm text-gray-500">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg border border-dark-600 text-gray-400 hover:bg-dark-700 disabled:opacity-50"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 rounded-lg border border-dark-600 text-gray-400 hover:bg-dark-700 disabled:opacity-50"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </motion.div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-dark-800 rounded-2xl p-6 border border-dark-600 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">User Details</h3>
                <button onClick={() => setShowUserModal(false)} className="p-2 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{selectedUser.firstName} {selectedUser.lastName}</h4>
                    <p className="text-gray-400">{selectedUser.email}</p>
                    <div className="flex gap-2 mt-2">
                      {getStatusBadge(selectedUser.status)}
                      {getKycBadge(selectedUser.kycStatus)}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-dark-700 rounded-xl">
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-xl font-bold text-white">${selectedUser.mainBalance.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-dark-700 rounded-xl">
                    <p className="text-sm text-gray-400">Deposits</p>
                    <p className="text-xl font-bold text-green-400">${selectedUser.totalDeposits.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-dark-700 rounded-xl">
                    <p className="text-sm text-gray-400">Withdrawals</p>
                    <p className="text-xl font-bold text-red-400">${selectedUser.totalWithdrawals.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-dark-700 rounded-xl">
                    <p className="text-sm text-gray-400">Earnings</p>
                    <p className="text-xl font-bold text-primary-400">${selectedUser.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-dark-600">
                    <span className="text-gray-400">Referral Code</span>
                    <span className="text-white font-mono">{selectedUser.referralCode}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-dark-600">
                    <span className="text-gray-400">Referrals</span>
                    <span className="text-white">{selectedUser.referrals}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-dark-600">
                    <span className="text-gray-400">2FA Enabled</span>
                    <span className={selectedUser.twoFactorEnabled ? 'text-green-400' : 'text-gray-500'}>
                      {selectedUser.twoFactorEnabled ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-dark-600">
                    <span className="text-gray-400">Joined</span>
                    <span className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Last Login</span>
                    <span className="text-white">{new Date(selectedUser.lastLogin).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Mail size={16} />}
                  >
                    Send Email
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<DollarSign size={16} />}
                    onClick={() => handleBalanceAdjust(selectedUser._id, 100, 'add')}
                  >
                    Adjust Balance
                  </Button>
                  <Button
                    variant={selectedUser.status === 'active' ? 'danger' : 'primary'}
                    size="sm"
                    leftIcon={selectedUser.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                    onClick={() => handleStatusChange(selectedUser._id, selectedUser.status === 'active' ? 'suspended' : 'active')}
                  >
                    {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


