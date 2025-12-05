'use client';

/**
 * VARLIXO - WALLET PAGE
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Sparkles,
  Gift,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useAuthStore } from '@/app/lib/store';
import { walletAPI } from '@/app/lib/api';

const depositOptions = [
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Bitcoin, Ethereum, USDT & more',
    icon: Sparkles,
    color: 'from-orange-500 to-yellow-500',
    href: '/dashboard/wallet/deposit/crypto',
  },
  {
    id: 'giftcard',
    name: 'Gift Cards',
    description: 'Apple, Steam, Amazon & more',
    icon: Gift,
    color: 'from-pink-500 to-purple-500',
    href: '/dashboard/wallet/deposit/giftcard',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    description: 'Wire transfer & bank deposit',
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    href: '/dashboard/wallet/deposit/bank',
  },
];

export default function WalletPage() {
  const { wallet } = useAuthStore();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const [depositsRes, withdrawalsRes] = await Promise.all([
        walletAPI.getDeposits({ limit: 5 }),
        walletAPI.getWithdrawals({ limit: 5 }),
      ]);
      setDeposits(depositsRes.data.data?.data || []);
      setWithdrawals(withdrawalsRes.data.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; Icon: any }> = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', Icon: Clock },
      processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', Icon: Clock },
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', Icon: CheckCircle },
      approved: { bg: 'bg-green-500/20', text: 'text-green-400', Icon: CheckCircle },
      failed: { bg: 'bg-red-500/20', text: 'text-red-400', Icon: XCircle },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-400', Icon: XCircle },
    };
    const style = styles[status] || styles.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <style.Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-gray-400">Manage your funds, deposits, and withdrawals</p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-primary-500/20 to-primary-600/5 border-primary-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center">
              <Wallet className="text-primary-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-2xl lg:text-3xl font-bold text-white">
                ${(wallet?.mainBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
              <Clock className="text-yellow-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">
                ${(wallet?.pendingBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-green-400">
                +${(wallet?.totalEarnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Locked (Investing)</p>
              <p className="text-2xl font-bold text-white">
                ${(wallet?.lockedBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/dashboard/wallet/deposit">
          <Button size="lg" leftIcon={<ArrowDownLeft size={20} />}>
            Deposit Funds
          </Button>
        </Link>
        <Link href="/dashboard/wallet/withdraw">
          <Button variant="secondary" size="lg" leftIcon={<ArrowUpRight size={20} />}>
            Withdraw
          </Button>
        </Link>
      </div>

      {/* Deposit Options */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Deposit</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {depositOptions.map((option) => (
            <Link key={option.id} href={option.href}>
              <Card className="group hover:border-primary-500/50 transition-all cursor-pointer h-full">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <option.icon className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-lg">{option.name}</p>
                    <p className="text-gray-400 text-sm">{option.description}</p>
                  </div>
                  <ChevronRight className="text-gray-600 group-hover:text-primary-500 transition-colors" size={24} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownLeft size={18} className="text-green-500" />
              Recent Deposits
            </CardTitle>
          </CardHeader>
          
          {deposits.length > 0 ? (
            <div className="space-y-3">
              {deposits.map((deposit) => (
                <div key={deposit._id} className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <ArrowDownLeft className="text-green-500" size={18} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">${deposit.amount?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-gray-500">{new Date(deposit.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {getStatusBadge(deposit.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-3">
                <ArrowDownLeft className="text-gray-600" size={24} />
              </div>
              <p className="text-gray-400">No deposits yet</p>
              <Link href="/dashboard/wallet/deposit">
                <Button variant="ghost" size="sm" className="mt-3">Make a Deposit</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight size={18} className="text-red-500" />
              Recent Withdrawals
            </CardTitle>
          </CardHeader>
          
          {withdrawals.length > 0 ? (
            <div className="space-y-3">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal._id} className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <ArrowUpRight className="text-red-500" size={18} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">${withdrawal.amount?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-gray-500">{new Date(withdrawal.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {getStatusBadge(withdrawal.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-3">
                <ArrowUpRight className="text-gray-600" size={24} />
              </div>
              <p className="text-gray-400">No withdrawals yet</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
