'use client';

/**
 * ==============================================
 * VARLIXO - ADMIN DASHBOARD OVERVIEW
 * ==============================================
 * Main admin dashboard with stats, charts, real-time monitoring
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
  RefreshCw,
  BarChart3,
  PieChart,
  Globe,
  Server,
  Database,
  Mail,
  CreditCard,
  AlertTriangle,
  Zap,
  Target,
  UserPlus,
  FileCheck,
  Ban,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { adminAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeUsers: 890,
    newUsersToday: 45,
    newUsersThisWeek: 312,
    totalDeposits: 2500000,
    pendingDeposits: 125000,
    depositsToday: 85000,
    totalWithdrawals: 1800000,
    pendingWithdrawals: 85000,
    withdrawalsToday: 45000,
    totalInvestments: 5600000,
    activeInvestments: 450,
    pendingKYC: 28,
    approvedKYC: 890,
    rejectedKYC: 15,
    revenue: 450000,
    revenueGrowth: 12.5,
    profitsPaid: 320000,
    referralsPaid: 45000,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'deposit', user: 'John D.', email: 'j***@email.com', amount: 5000, status: 'pending', time: '2 min ago' },
    { id: 2, type: 'withdrawal', user: 'Sarah M.', email: 's***@email.com', amount: 2500, status: 'pending', time: '5 min ago' },
    { id: 3, type: 'kyc', user: 'Mike R.', email: 'm***@email.com', status: 'pending', time: '10 min ago' },
    { id: 4, type: 'deposit', user: 'Emily K.', email: 'e***@email.com', amount: 10000, status: 'approved', time: '15 min ago' },
    { id: 5, type: 'investment', user: 'David L.', email: 'd***@email.com', amount: 25000, plan: 'Professional', time: '20 min ago' },
    { id: 6, type: 'registration', user: 'Anna T.', email: 'a***@email.com', referrer: 'John D.', time: '25 min ago' },
  ]);

  const [pendingActions, setPendingActions] = useState({
    deposits: 12,
    withdrawals: 8,
    kyc: 28,
  });

  const [systemStatus, setSystemStatus] = useState({
    api: 'operational',
    database: 'operational',
    email: 'operational',
    payments: 'operational',
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Chart data for revenue
  const revenueData = [35, 48, 42, 55, 62, 58, 72, 68, 80, 75, 85, 92];
  const usersData = [120, 145, 180, 195, 220, 280, 310, 345, 390, 420, 480, 520];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      if (response.data?.data) {
        // Update stats from API
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
    toast.success('Dashboard refreshed');
  };

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
      case 'registration':
        return <UserPlus className="text-primary-500" size={18} />;
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

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSystemStatusDot = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500 animate-pulse';
      case 'down':
        return 'bg-red-500 animate-pulse';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Real-time platform monitoring and management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-all disabled:opacity-50"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      {/* Pending Actions Alert */}
      {(pendingActions.deposits > 0 || pendingActions.withdrawals > 0 || pendingActions.kyc > 0) && (
        <motion.div variants={fadeInUp}>
          <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="text-yellow-500" size={24} />
              </div>
              <div>
                <p className="text-yellow-400 font-semibold">Action Required</p>
                <p className="text-sm text-gray-400">
                  <span className="text-yellow-400 font-medium">{pendingActions.deposits}</span> deposits • 
                  <span className="text-yellow-400 font-medium"> {pendingActions.withdrawals}</span> withdrawals • 
                  <span className="text-yellow-400 font-medium"> {pendingActions.kyc}</span> KYC requests pending
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/dashboard/deposits?status=pending">
                <Button size="sm" variant="secondary" className="border-yellow-500/30">
                  <FileCheck size={16} className="mr-2" />
                  Deposits
                </Button>
              </Link>
              <Link href="/admin/dashboard/withdrawals?status=pending">
                <Button size="sm" variant="secondary" className="border-yellow-500/30">
                  <ArrowUpRight size={16} className="mr-2" />
                  Withdrawals
                </Button>
              </Link>
              <Link href="/admin/dashboard/kyc?status=pending">
                <Button size="sm" variant="secondary" className="border-yellow-500/30">
                  <Shield size={16} className="mr-2" />
                  KYC
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Stats Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="text-blue-500" size={22} />
              </div>
              <span className="text-xs text-green-400 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} />
                +{stats.newUsersToday}
              </span>
            </div>
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.activeUsers} active now</p>
          </div>
        </Card>

        {/* Total Deposits */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-green-500/20 flex items-center justify-center">
                <ArrowDownRight className="text-green-500" size={22} />
              </div>
              <span className="text-xs text-yellow-400 flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                <Clock size={12} />
                {pendingActions.deposits}
              </span>
            </div>
            <p className="text-sm text-gray-400">Total Deposits</p>
            <p className="text-2xl font-bold text-white">${(stats.totalDeposits / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-green-400 mt-1">+${(stats.depositsToday / 1000).toFixed(0)}K today</p>
          </div>
        </Card>

        {/* Total Withdrawals */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-red-500/20 flex items-center justify-center">
                <ArrowUpRight className="text-red-500" size={22} />
              </div>
              <span className="text-xs text-yellow-400 flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                <Clock size={12} />
                {pendingActions.withdrawals}
              </span>
            </div>
            <p className="text-sm text-gray-400">Total Withdrawals</p>
            <p className="text-2xl font-bold text-white">${(stats.totalWithdrawals / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-red-400 mt-1">-${(stats.withdrawalsToday / 1000).toFixed(0)}K today</p>
          </div>
        </Card>

        {/* Platform Revenue */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <DollarSign className="text-purple-500" size={22} />
              </div>
              <span className="text-xs text-green-400 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                +{stats.revenueGrowth}%
              </span>
            </div>
            <p className="text-sm text-gray-400">Platform Revenue</p>
            <p className="text-2xl font-bold text-white">${(stats.revenue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={fadeInUp} className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-0">
          <div className="p-6 border-b border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                <p className="text-sm text-gray-500">Monthly revenue trend</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                  Revenue
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-48 flex items-end justify-between gap-2">
              {revenueData.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-primary-500/30 to-primary-500 rounded-t-sm hover:from-primary-500/50 hover:to-primary-400 transition-colors cursor-pointer group relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${(value * 5).toFixed(0)}K
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </Card>

        {/* User Growth Chart */}
        <Card className="p-0">
          <div className="p-6 border-b border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">User Growth</h3>
                <p className="text-sm text-gray-500">Monthly registrations</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{stats.newUsersThisWeek}</p>
                <p className="text-xs text-green-400">+24% this week</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-48 flex items-end justify-between gap-2">
              {usersData.map((value, index) => {
                const maxValue = Math.max(...usersData);
                const height = (value / maxValue) * 100;
                return (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-blue-500/30 to-blue-500 rounded-t-sm hover:from-blue-500/50 hover:to-blue-400 transition-colors cursor-pointer group relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Secondary Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <TrendingUp className="text-primary-500" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Investments</p>
              <p className="text-lg font-bold text-white">{stats.activeInvestments}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <DollarSign className="text-green-500" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Profits Paid</p>
              <p className="text-lg font-bold text-white">${(stats.profitsPaid / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Shield className="text-yellow-500" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending KYC</p>
              <p className="text-lg font-bold text-white">{stats.pendingKYC}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <FileCheck className="text-blue-500" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">KYC Approved</p>
              <p className="text-lg font-bold text-white">{stats.approvedKYC}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="text-purple-500" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Referrals Paid</p>
              <p className="text-lg font-bold text-white">${(stats.referralsPaid / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Ban className="text-red-500" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">KYC Rejected</p>
              <p className="text-lg font-bold text-white">{stats.rejectedKYC}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={18} className="text-primary-500" />
                Live Activity Feed
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-500">Real-time</span>
              </div>
            </CardHeader>

            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors"
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
                        {activity.user} • {activity.email}
                        {activity.amount && ` • $${activity.amount.toLocaleString()}`}
                        {activity.plan && ` • ${activity.plan}`}
                        {activity.referrer && ` • Ref: ${activity.referrer}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-dark-700">
              <Link href="/admin/dashboard/logs" className="text-primary-400 hover:text-primary-300 text-sm flex items-center justify-center gap-1">
                View All Activity <ChevronRight size={16} />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div variants={fadeInUp} className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={18} className="text-yellow-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>

            <div className="space-y-2">
              <Link href="/admin/dashboard/deposits?status=pending" className="block">
                <div className="p-3 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <ArrowDownRight className="text-green-500" size={18} />
                    </div>
                    <span className="text-white text-sm font-medium">Pending Deposits</span>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                    {pendingActions.deposits}
                  </span>
                </div>
              </Link>

              <Link href="/admin/dashboard/withdrawals?status=pending" className="block">
                <div className="p-3 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <ArrowUpRight className="text-red-500" size={18} />
                    </div>
                    <span className="text-white text-sm font-medium">Pending Withdrawals</span>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                    {pendingActions.withdrawals}
                  </span>
                </div>
              </Link>

              <Link href="/admin/dashboard/kyc?status=pending" className="block">
                <div className="p-3 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Shield className="text-blue-500" size={18} />
                    </div>
                    <span className="text-white text-sm font-medium">KYC Requests</span>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                    {pendingActions.kyc}
                  </span>
                </div>
              </Link>

              <Link href="/admin/dashboard/users" className="block">
                <div className="p-3 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Users className="text-purple-500" size={18} />
                    </div>
                    <span className="text-white text-sm font-medium">Manage Users</span>
                  </div>
                  <ChevronRight className="text-gray-500" size={16} />
                </div>
              </Link>
            </div>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server size={18} className="text-primary-500" />
                System Status
              </CardTitle>
              <span className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                All Systems Operational
              </span>
            </CardHeader>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <Server size={16} className="text-gray-400" />
                  <span className="text-gray-400 text-sm">API Server</span>
                </div>
                <span className={`flex items-center gap-2 text-sm ${getSystemStatusColor(systemStatus.api)}`}>
                  <span className={`w-2 h-2 rounded-full ${getSystemStatusDot(systemStatus.api)}`}></span>
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <Database size={16} className="text-gray-400" />
                  <span className="text-gray-400 text-sm">Database</span>
                </div>
                <span className={`flex items-center gap-2 text-sm ${getSystemStatusColor(systemStatus.database)}`}>
                  <span className={`w-2 h-2 rounded-full ${getSystemStatusDot(systemStatus.database)}`}></span>
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-400 text-sm">Email Service</span>
                </div>
                <span className={`flex items-center gap-2 text-sm ${getSystemStatusColor(systemStatus.email)}`}>
                  <span className={`w-2 h-2 rounded-full ${getSystemStatusDot(systemStatus.email)}`}></span>
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <CreditCard size={16} className="text-gray-400" />
                  <span className="text-gray-400 text-sm">Payment Gateway</span>
                </div>
                <span className={`flex items-center gap-2 text-sm ${getSystemStatusColor(systemStatus.payments)}`}>
                  <span className={`w-2 h-2 rounded-full ${getSystemStatusDot(systemStatus.payments)}`}></span>
                  Operational
                </span>
              </div>
            </div>
          </Card>

          {/* Server Info */}
          <Card className="bg-dark-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Globe className="text-primary-500" size={20} />
              </div>
              <div>
                <p className="text-white font-medium">Server Region</p>
                <p className="text-sm text-gray-500">US East (Virginia)</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Uptime</p>
                <p className="text-white font-medium">99.99%</p>
              </div>
              <div>
                <p className="text-gray-500">Response Time</p>
                <p className="text-white font-medium">45ms</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
