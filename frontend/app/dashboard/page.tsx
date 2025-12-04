'use client';

/**
 * ==============================================
 * VARLIXO - DASHBOARD HOME PAGE
 * ==============================================
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useAuthStore } from '@/app/lib/store';
import { walletAPI, investmentAPI, marketAPI } from '@/app/lib/api';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function DashboardPage() {
  const { user, wallet } = useAuthStore();
  const [investmentSummary, setInvestmentSummary] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [cryptoPrices, setCryptoPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, transactionsRes, cryptoRes] = await Promise.all([
        investmentAPI.getSummary(),
        walletAPI.getTransactions({ limit: 5 }),
        marketAPI.getCryptos(5),
      ]);

      setInvestmentSummary(summaryRes.data.data?.summary || summaryRes.data.data);
      setRecentTransactions(transactionsRes.data.data?.data || transactionsRes.data.data || []);
      // Handle nested response structure
      const cryptoData = cryptoRes.data.data?.data || cryptoRes.data.data || [];
      setCryptoPrices(Array.isArray(cryptoData) ? cryptoData : []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'failed':
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight size={20} className="text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight size={20} className="text-red-500" />;
      case 'profit':
        return <TrendingUp size={20} className="text-primary-500" />;
      default:
        return <Wallet size={20} className="text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-400">
          Here's an overview of your investment portfolio
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Main Balance */}
        <Card className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 border-primary-500/20">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Wallet className="text-primary-500" size={24} />
            </div>
            <span className="text-xs text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full">
              Available
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Main Balance</p>
          <p className="text-2xl font-bold text-white">
            ${(wallet?.mainBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </Card>

        {/* Total Earnings */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <span className="text-xs text-green-400 flex items-center gap-1">
              <ArrowUpRight size={14} />
              +12.5%
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-white">
            ${(wallet?.totalEarnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </Card>

        {/* Active Investments */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="text-purple-500" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Active Investments</p>
          <p className="text-2xl font-bold text-white">
            {investmentSummary?.activeInvestments || 0}
          </p>
        </Card>

        {/* Referral Earnings */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Wallet className="text-yellow-500" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Referral Earnings</p>
          <p className="text-2xl font-bold text-white">
            ${(wallet?.referralEarnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
        <Link href="/dashboard/wallet?action=deposit">
          <Button leftIcon={<Plus size={18} />}>Deposit Funds</Button>
        </Link>
        <Link href="/dashboard/investments">
          <Button variant="secondary" leftIcon={<TrendingUp size={18} />}>
            New Investment
          </Button>
        </Link>
        <Link href="/dashboard/wallet?action=withdraw">
          <Button variant="ghost" leftIcon={<ArrowUpRight size={18} />}>
            Withdraw
          </Button>
        </Link>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <Link
                href="/dashboard/transactions"
                className="text-primary-500 hover:text-primary-400 text-sm flex items-center gap-1"
              >
                View All <ArrowRight size={16} />
              </Link>
            </CardHeader>

            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((tx: any) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-4 bg-dark-800 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">
                          {tx.type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          tx.type === 'deposit' || tx.type === 'profit'
                            ? 'text-green-500'
                            : 'text-white'
                        }`}
                      >
                        {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}$
                        {tx.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        {getStatusIcon(tx.status)}
                        <span className="text-xs text-gray-500 capitalize">{tx.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wallet size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No transactions yet</p>
                <Link href="/dashboard/wallet?action=deposit">
                  <Button variant="ghost" size="sm" className="mt-4">
                    Make Your First Deposit
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Market Overview */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>

            <div className="space-y-4">
              {Array.isArray(cryptoPrices) && cryptoPrices.map((crypto: any) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-3 bg-dark-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium">{crypto.symbol.toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{crypto.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">
                      ${crypto.current_price.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs ${
                        crypto.price_change_percentage_24h >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                      {crypto.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Active Investments */}
      {investmentSummary?.activeInvestmentsList?.length > 0 && (
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Active Investments</CardTitle>
              <Link
                href="/dashboard/investments"
                className="text-primary-500 hover:text-primary-400 text-sm flex items-center gap-1"
              >
                View All <ArrowRight size={16} />
              </Link>
            </CardHeader>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investmentSummary.activeInvestmentsList.map((inv: any) => (
                <div
                  key={inv.id}
                  className="p-4 bg-dark-800 rounded-xl border border-dark-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{inv.planName}</h4>
                    <span className="text-xs text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-3">
                    ${inv.amount.toLocaleString()}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Daily Profit</span>
                      <span className="text-green-500">+${inv.dailyProfit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-white">{inv.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                        style={{ width: `${inv.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
