'use client';

/**
 * ==============================================
 * VARLIXO - ADMIN DASHBOARD OVERVIEW
 * ==============================================
 * Main admin dashboard with stats, charts, and recent activity
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Shield,
  Eye,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeUsers: 890,
    newUsersToday: 45,
    totalDeposits: 2500000,
    pendingDeposits: 125000,
    totalWithdrawals: 1800000,
    pendingWithdrawals: 85000,
    totalInvestments: 5600000,
    activeInvestments: 450,
    pendingKYC: 28,
    revenue: 450000,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'deposit', user: 'John D.', amount: 5000, status: 'pending', time: '2 min ago' },
    { id: 2, type: 'withdrawal', user: 'Sarah M.', amount: 2500, status: 'pending', time: '5 min ago' },
    { id: 3, type: 'kyc', user: 'Mike R.', status: 'pending', time: '10 min ago' },
    { id: 4, type: 'deposit', user: 'Emily K.', amount: 10000, status: 'approved', time: '15 min ago' },
    { id: 5, type: 'investment', user: 'David L.', amount: 25000, plan: 'Gold', time: '20 min ago' },
  ]);

  const [pendingActions, setPendingActions] = useState({
    deposits: 12,
    withdrawals: 8,
    kyc: 28,
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="text-green-500" size={18} />;
      case 'withdrawal':
        return <ArrowUpRight className="text-red-500" size={18} />;
      case 'kyc':
        return <Shield className="text-blue-500" size={18} />;
      case 'investment':
        return <TrendingUp className="text-purple-500" size={18} />;
      default:
        return <Activity className="text-gray-500" size={18} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
            <Clock size={12} /> Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-400">
          Welcome back! Here's an overview of your platform.
        </p>
      </motion.div>

      {/* Pending Actions Alert */}
      {(pendingActions.deposits > 0 || pendingActions.withdrawals > 0 || pendingActions.kyc > 0) && (
        <motion.div variants={fadeInUp}>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-yellow-500" size={24} />
              <div>
                <p className="text-yellow-400 font-medium">Pending Actions Required</p>
                <p className="text-sm text-gray-400">
                  {pendingActions.deposits} deposits • {pendingActions.withdrawals} withdrawals • {pendingActions.kyc} KYC requests
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/dashboard/deposits?status=pending">
                <Button size="sm" variant="ghost">Review Deposits</Button>
              </Link>
              <Link href="/admin/dashboard/withdrawals?status=pending">
                <Button size="sm" variant="ghost">Review Withdrawals</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <ArrowUpRight size={12} />
                +{stats.newUsersToday} today
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="text-blue-500" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold text-white mt-1">${(stats.totalDeposits / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                <Clock size={12} />
                ${(stats.pendingDeposits / 1000).toFixed(0)}K pending
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <ArrowDownRight className="text-green-500" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Withdrawals</p>
              <p className="text-2xl font-bold text-white mt-1">${(stats.totalWithdrawals / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                <Clock size={12} />
                ${(stats.pendingWithdrawals / 1000).toFixed(0)}K pending
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <ArrowUpRight className="text-red-500" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Platform Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">${(stats.revenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <TrendingUp size={12} />
                +12.5% this month
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <DollarSign className="text-purple-500" size={20} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Secondary Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <TrendingUp className="text-primary-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Investments</p>
              <p className="text-xl font-bold text-white">{stats.activeInvestments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Users className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <p className="text-xl font-bold text-white">{stats.activeUsers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Shield className="text-yellow-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending KYC</p>
              <p className="text-xl font-bold text-white">{stats.pendingKYC}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Wallet className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Invested</p>
              <p className="text-xl font-bold text-white">${(stats.totalInvestments / 1000000).toFixed(2)}M</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <Link href="/admin/dashboard/activity" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </CardHeader>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium capitalize">{activity.type}</p>
                        {activity.status && getStatusBadge(activity.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {activity.user}
                        {activity.amount && ` • $${activity.amount.toLocaleString()}`}
                        {activity.plan && ` • ${activity.plan} Plan`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{activity.time}</span>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>

            <div className="space-y-3">
              <Link href="/admin/dashboard/deposits?status=pending">
                <div className="p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <ArrowDownRight className="text-green-500" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium">Pending Deposits</p>
                      <p className="text-sm text-gray-500">{pendingActions.deposits} awaiting approval</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-500" size={20} />
                </div>
              </Link>

              <Link href="/admin/dashboard/withdrawals?status=pending">
                <div className="p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <ArrowUpRight className="text-red-500" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium">Pending Withdrawals</p>
                      <p className="text-sm text-gray-500">{pendingActions.withdrawals} awaiting approval</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-500" size={20} />
                </div>
              </Link>

              <Link href="/admin/dashboard/kyc?status=pending">
                <div className="p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Shield className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium">KYC Requests</p>
                      <p className="text-sm text-gray-500">{pendingActions.kyc} awaiting verification</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-500" size={20} />
                </div>
              </Link>

              <Link href="/admin/dashboard/users">
                <div className="p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Users className="text-purple-500" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium">Manage Users</p>
                      <p className="text-sm text-gray-500">{stats.totalUsers} total users</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-500" size={20} />
                </div>
              </Link>
            </div>
          </Card>

          {/* System Status */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">API Server</span>
                <span className="flex items-center gap-2 text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Database</span>
                <span className="flex items-center gap-2 text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email Service</span>
                <span className="flex items-center gap-2 text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Payment Gateway</span>
                <span className="flex items-center gap-2 text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Operational
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}



