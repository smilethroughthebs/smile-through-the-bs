'use client';

/**
 * ==============================================
 * VARLIXO - WALLET PAGE
 * ==============================================
 * Beautiful wallet management with multiple payment options
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Clock,
  CheckCircle,
  XCircle,
  X,
  CreditCard,
  Building2,
  Gift,
  Gamepad2,
  Apple,
  Music,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Info,
  QrCode,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import { useAuthStore } from '@/app/lib/store';
import { walletAPI } from '@/app/lib/api';

// Animation variants - simplified to prevent shaking
const fadeInUp = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
};

// Payment method categories
const paymentCategories = [
  { id: 'crypto', name: 'Cryptocurrency', icon: Sparkles },
  { id: 'giftcard', name: 'Gift Cards', icon: Gift },
  { id: 'bank', name: 'Bank Transfer', icon: Building2 },
];

// All payment methods
const allPaymentMethods = [
  // Crypto
  { id: 'crypto_btc', name: 'Bitcoin', icon: '₿', category: 'crypto', color: 'from-orange-500 to-yellow-500', minDeposit: 50 },
  { id: 'crypto_eth', name: 'Ethereum', icon: 'Ξ', category: 'crypto', color: 'from-purple-500 to-blue-500', minDeposit: 50 },
  { id: 'crypto_usdt', name: 'USDT (TRC20)', icon: '₮', category: 'crypto', color: 'from-green-500 to-emerald-500', minDeposit: 50 },
  { id: 'crypto_usdc', name: 'USDC', icon: '◈', category: 'crypto', color: 'from-blue-500 to-cyan-500', minDeposit: 50 },
  { id: 'crypto_bnb', name: 'BNB', icon: '◆', category: 'crypto', color: 'from-yellow-500 to-orange-400', minDeposit: 50 },
  { id: 'crypto_sol', name: 'Solana', icon: '◎', category: 'crypto', color: 'from-purple-600 to-pink-500', minDeposit: 50 },
  
  // Gift Cards
  { id: 'giftcard_apple', name: 'Apple Gift Card', icon: '🍎', category: 'giftcard', color: 'from-gray-600 to-gray-800', minDeposit: 25, popular: true },
  { id: 'giftcard_google', name: 'Google Play', icon: '▶️', category: 'giftcard', color: 'from-green-600 to-blue-500', minDeposit: 25 },
  { id: 'giftcard_amazon', name: 'Amazon', icon: '📦', category: 'giftcard', color: 'from-orange-500 to-yellow-500', minDeposit: 25, popular: true },
  { id: 'giftcard_steam', name: 'Steam', icon: '🎮', category: 'giftcard', color: 'from-blue-800 to-blue-600', minDeposit: 20 },
  { id: 'giftcard_xbox', name: 'Xbox', icon: '🎯', category: 'giftcard', color: 'from-green-600 to-green-400', minDeposit: 25 },
  { id: 'giftcard_playstation', name: 'PlayStation', icon: '🎲', category: 'giftcard', color: 'from-blue-700 to-blue-500', minDeposit: 25 },
  { id: 'giftcard_roblox', name: 'Roblox', icon: '🟥', category: 'giftcard', color: 'from-red-600 to-red-400', minDeposit: 10 },
  { id: 'giftcard_spotify', name: 'Spotify', icon: '🎵', category: 'giftcard', color: 'from-green-500 to-green-400', minDeposit: 10 },
  { id: 'giftcard_netflix', name: 'Netflix', icon: '🎬', category: 'giftcard', color: 'from-red-700 to-red-500', minDeposit: 15 },
  { id: 'giftcard_itunes', name: 'iTunes', icon: '🎧', category: 'giftcard', color: 'from-pink-600 to-purple-500', minDeposit: 15 },
  { id: 'giftcard_ebay', name: 'eBay', icon: '🛒', category: 'giftcard', color: 'from-blue-600 to-yellow-500', minDeposit: 25 },
  { id: 'giftcard_walmart', name: 'Walmart', icon: '🏪', category: 'giftcard', color: 'from-blue-600 to-blue-400', minDeposit: 25 },
  { id: 'giftcard_target', name: 'Target', icon: '🎯', category: 'giftcard', color: 'from-red-600 to-red-500', minDeposit: 25 },
  { id: 'giftcard_visa', name: 'Visa Gift Card', icon: '💳', category: 'giftcard', color: 'from-blue-700 to-blue-500', minDeposit: 50, popular: true },
  { id: 'giftcard_mastercard', name: 'Mastercard Gift', icon: '💳', category: 'giftcard', color: 'from-orange-600 to-red-500', minDeposit: 50 },
  { id: 'giftcard_razer', name: 'Razer Gold', icon: '🐍', category: 'giftcard', color: 'from-green-500 to-green-300', minDeposit: 10 },
  
  // Bank
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', category: 'bank', color: 'from-blue-600 to-blue-400', minDeposit: 100 },
  { id: 'bank_wire', name: 'Wire Transfer', icon: '🔄', category: 'bank', color: 'from-gray-600 to-gray-500', minDeposit: 500 },
];

// Withdrawal methods (crypto + bank only)
const withdrawalMethods = allPaymentMethods.filter(m => m.category === 'crypto' || m.category === 'bank');

export default function WalletPage() {
  const searchParams = useSearchParams();
  const { wallet } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('crypto');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [depositInstructions, setDepositInstructions] = useState<any>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardPin, setGiftCardPin] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [step, setStep] = useState(1);

  // Withdrawal form
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    paymentMethod: '',
    walletAddress: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    routingNumber: '',
    swiftCode: '',
  });

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'deposit' || action === 'withdraw') {
      setActiveTab(action);
      setShowModal(true);
    }
    fetchTransactions();
  }, [searchParams]);

  const fetchTransactions = async () => {
    try {
      const [depositsRes, withdrawalsRes] = await Promise.all([
        walletAPI.getDeposits({ limit: 10 }),
        walletAPI.getWithdrawals({ limit: 10 }),
      ]);
      setDeposits(depositsRes.data.data?.data || []);
      setWithdrawals(withdrawalsRes.data.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Empty for new accounts
      setDeposits([]);
      setWithdrawals([]);
    }
  };

  const handleDeposit = async () => {
    if (!amount || !selectedMethod) {
      toast.error('Please enter amount and select payment method');
      return;
    }

    const method = allPaymentMethods.find(m => m.id === selectedMethod);
    if (method && parseFloat(amount) < method.minDeposit) {
      toast.error(`Minimum deposit for ${method.name} is $${method.minDeposit}`);
      return;
    }

    setIsLoading(true);
    try {
      const depositData: any = {
        amount: parseFloat(amount),
        paymentMethod: selectedMethod,
      };

      // Add gift card details if applicable
      if (selectedMethod?.startsWith('giftcard_')) {
        if (!giftCardCode) {
          toast.error('Please enter the gift card code');
          setIsLoading(false);
          return;
        }
        depositData.giftCardCode = giftCardCode;
        depositData.giftCardPin = giftCardPin;
      }

      const response = await walletAPI.createDeposit(depositData);
      setDepositInstructions(response.data.data);
      setStep(3);
      toast.success('Deposit request created!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create deposit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawalData.amount || !withdrawalData.paymentMethod) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(withdrawalData.amount) < 50) {
      toast.error('Minimum withdrawal is $50');
      return;
    }

    if (parseFloat(withdrawalData.amount) > (wallet?.mainBalance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    setIsLoading(true);
    try {
      await walletAPI.createWithdrawal({
        amount: parseFloat(withdrawalData.amount),
        paymentMethod: withdrawalData.paymentMethod,
        walletAddress: withdrawalData.walletAddress,
        bankName: withdrawalData.bankName,
        accountNumber: withdrawalData.accountNumber,
        accountName: withdrawalData.accountName,
        routingNumber: withdrawalData.routingNumber,
        swiftCode: withdrawalData.swiftCode,
      });

      toast.success('Withdrawal request submitted successfully!');
      closeModal();
      fetchTransactions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create withdrawal');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    toast.success('Address copied!');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setSelectedMethod(null);
    setAmount('');
    setDepositInstructions(null);
    setGiftCardCode('');
    setGiftCardPin('');
    setProofImage(null);
    setShowConfirmation(false);
    setIsLoading(false); // Reset loading state
    setWithdrawalData({
      amount: '',
      paymentMethod: '',
      walletAddress: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      routingNumber: '',
      swiftCode: '',
    });
  };

  // Reset loading when modal opens
  const openDepositModal = () => {
    setActiveTab('deposit');
    setShowModal(true);
    setStep(1);
    setIsLoading(false);
    setSelectedMethod(null);
    setAmount('');
    setDepositInstructions(null);
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; icon: any }> = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock },
      processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock },
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
      approved: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
      failed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle },
      cancelled: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: XCircle },
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredPaymentMethods = allPaymentMethods.filter(m => m.category === selectedCategory);
  const selectedMethodData = allPaymentMethods.find(m => m.id === selectedMethod);

  const getWithdrawalFee = () => {
    if (withdrawalData.paymentMethod?.startsWith('crypto_')) return 2.50;
    if (withdrawalData.paymentMethod?.startsWith('bank_')) return 5.00;
    return 0;
  };

  const getProcessingTime = () => {
    if (withdrawalData.paymentMethod?.startsWith('crypto_')) return '1-24 hours';
    if (withdrawalData.paymentMethod === 'bank_transfer') return '2-5 business days';
    if (withdrawalData.paymentMethod === 'bank_wire') return '1-3 business days';
    return 'Select method';
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
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-gray-400">Manage your funds, deposits, and withdrawals</p>
      </motion.div>

      {/* Balance Cards */}
      <motion.div variants={fadeInUp} className="grid md:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-primary-500/20 to-primary-600/5 border-primary-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
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
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
        <Button
          size="lg"
          className="flex-1 sm:flex-none min-w-[160px]"
          leftIcon={<ArrowDownLeft size={20} />}
          onClick={openDepositModal}
        >
          Deposit Funds
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 sm:flex-none min-w-[160px]"
          leftIcon={<ArrowUpRight size={20} />}
          onClick={() => {
            setActiveTab('withdraw');
            setShowModal(true);
            setStep(1);
          }}
        >
          Withdraw
        </Button>
      </motion.div>

      {/* Quick Deposit Options */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift size={20} className="text-primary-500" />
              Quick Deposit - Popular Methods
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {allPaymentMethods.filter(m => m.popular || m.category === 'crypto').slice(0, 6).map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  setActiveTab('deposit');
                  setSelectedCategory(method.category);
                  setSelectedMethod(method.id);
                  setShowModal(true);
                  setStep(2);
                  setIsLoading(false);
                  setAmount('');
                }}
                className="group p-4 rounded-xl border border-dark-600 bg-dark-800/50 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all text-center"
              >
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                  {method.icon}
                </div>
                <p className="text-sm font-medium text-white truncate">{method.name}</p>
                <p className="text-xs text-gray-500">Min ${method.minDeposit}</p>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Transaction History */}
      <motion.div variants={fadeInUp} className="grid lg:grid-cols-2 gap-6">
        {/* Recent Deposits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownLeft size={18} className="text-green-500" />
              Recent Deposits
            </CardTitle>
          </CardHeader>
          
          {deposits.length > 0 ? (
            <div className="space-y-3">
              {deposits.slice(0, 5).map((deposit) => (
                <div
                  key={deposit._id}
                  className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700/50 hover:border-dark-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <ArrowDownLeft className="text-green-500" size={18} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">${deposit.amount?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-gray-500">
                        {deposit.paymentMethod?.replace('_', ' ').replace('crypto ', '').replace('giftcard ', '')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(deposit.status)}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(deposit.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-4">
                <ArrowDownLeft className="text-gray-600" size={24} />
              </div>
              <p className="text-gray-400 font-medium">No deposits yet</p>
              <p className="text-gray-500 text-sm mt-1">Make your first deposit to get started</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={openDepositModal}
              >
                Make a Deposit
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Withdrawals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight size={18} className="text-red-500" />
              Recent Withdrawals
            </CardTitle>
          </CardHeader>
          
          {withdrawals.length > 0 ? (
            <div className="space-y-3">
              {withdrawals.slice(0, 5).map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700/50 hover:border-dark-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <ArrowUpRight className="text-red-500" size={18} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">${withdrawal.amount?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-gray-500">
                        {withdrawal.paymentMethod?.replace('_', ' ').replace('crypto ', '')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(withdrawal.status)}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-4">
                <ArrowUpRight className="text-gray-600" size={24} />
              </div>
              <p className="text-gray-400 font-medium">No withdrawals yet</p>
              <p className="text-gray-500 text-sm mt-1">Your withdrawal history will appear here</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Deposit/Withdraw Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 border border-dark-600 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark-700">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activeTab === 'deposit' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {activeTab === 'deposit' ? (
                      <ArrowDownLeft className="text-green-500" size={20} />
                    ) : (
                      <ArrowUpRight className="text-red-500" size={20} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {activeTab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {activeTab === 'deposit' 
                        ? 'Choose your preferred payment method' 
                        : 'Request a withdrawal to your account'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                {activeTab === 'deposit' ? (
                  <>
                    {step === 1 && (
                      <div className="space-y-6">
                        {/* Category Tabs */}
                        <div className="flex gap-2 p-1 bg-dark-700 rounded-xl">
                          {paymentCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                                selectedCategory === cat.id
                                  ? 'bg-primary-500 text-white'
                                  : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              <cat.icon size={18} />
                              {cat.name}
                            </button>
                          ))}
                        </div>

                        {/* Payment Methods Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {filteredPaymentMethods.map((method) => (
                            <button
                              key={method.id}
                              onClick={() => {
                                setSelectedMethod(method.id);
                                setStep(2);
                              }}
                              className="group p-4 rounded-xl border border-dark-600 bg-dark-700/50 hover:border-primary-500 hover:bg-primary-500/5 transition-all text-left relative overflow-hidden"
                            >
                              {method.popular && (
                                <span className="absolute top-2 right-2 px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                                  Popular
                                </span>
                              )}
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-105 transition-transform`}>
                                {method.icon}
                              </div>
                              <p className="text-white font-medium">{method.name}</p>
                              <p className="text-xs text-gray-500">Min ${method.minDeposit}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 2 && selectedMethodData && (
                      <div className="space-y-6">
                        {/* Selected Method */}
                        <div className="flex items-center gap-4 p-4 bg-dark-700/50 rounded-xl border border-dark-600">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedMethodData.color} flex items-center justify-center text-3xl`}>
                            {selectedMethodData.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold text-lg">{selectedMethodData.name}</p>
                            <p className="text-gray-400 text-sm">Minimum deposit: ${selectedMethodData.minDeposit}</p>
                          </div>
                          <button
                            onClick={() => setStep(1)}
                            className="text-primary-400 hover:text-primary-300 text-sm"
                          >
                            Change
                          </button>
                        </div>

                        {/* Amount Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Deposit Amount (USD)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                            <input
                              type="number"
                              placeholder="0.00"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="w-full pl-10 pr-4 py-4 bg-dark-700 border border-dark-600 rounded-xl text-white text-xl font-semibold placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                            />
                          </div>
                          {/* Quick Amount Buttons */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {[100, 250, 500, 1000, 2500, 5000].map((amt) => (
                              <button
                                key={amt}
                                onClick={() => setAmount(amt.toString())}
                                className="px-4 py-2 rounded-lg bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white text-sm transition-colors"
                              >
                                ${amt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Gift Card Details */}
                        {selectedMethod?.startsWith('giftcard_') && (
                          <div className="space-y-4 p-4 bg-dark-700/30 rounded-xl border border-dark-600">
                            <div className="flex items-center gap-2 text-sm text-yellow-400">
                              <Info size={16} />
                              Enter your gift card details
                            </div>
                            <Input
                              label="Gift Card Code"
                              placeholder="XXXX-XXXX-XXXX-XXXX"
                              value={giftCardCode}
                              onChange={(e) => setGiftCardCode(e.target.value)}
                            />
                            <Input
                              label="PIN (if applicable)"
                              placeholder="Enter PIN"
                              value={giftCardPin}
                              onChange={(e) => setGiftCardPin(e.target.value)}
                            />
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button 
                            variant="ghost" 
                            onClick={() => {
                              setStep(1);
                              setIsLoading(false);
                              setAmount('');
                              setSelectedMethod(null);
                            }} 
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button
                            className="flex-1"
                            isLoading={isLoading}
                            onClick={handleDeposit}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Processing...' : 'Continue'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {step === 3 && depositInstructions && (
                      <div className="space-y-6">
                        {/* Success Message */}
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-500" size={32} />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">Deposit Request Created</h3>
                          <p className="text-gray-400">Complete your payment using the details below</p>
                        </div>

                        {/* Amount Summary */}
                        <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl text-center">
                          <p className="text-primary-400 text-sm mb-1">Amount to Deposit</p>
                          <p className="text-3xl font-bold text-white">
                            ${depositInstructions.deposit?.amount?.toLocaleString() || amount}
                          </p>
                        </div>

                        {/* Payment Instructions */}
                        {depositInstructions.instructions?.type === 'crypto' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm text-gray-400 mb-2">
                                Send {depositInstructions.instructions.currency} to this address:
                              </label>
                              <div className="flex items-center gap-2 p-4 bg-dark-700 rounded-xl border border-dark-600">
                                <code className="text-white text-sm flex-1 break-all font-mono">
                                  {depositInstructions.instructions.address}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(depositInstructions.instructions.address)}
                                  className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                                >
                                  {copiedAddress ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                              </div>
                            </div>
                            
                            {/* QR Code Placeholder */}
                            <div className="flex justify-center">
                              <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                                <QrCode size={120} className="text-dark-900" />
                              </div>
                            </div>

                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                              <p className="text-yellow-400 text-sm">
                                <AlertCircle size={16} className="inline mr-2" />
                                {depositInstructions.instructions.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {depositInstructions.instructions?.type === 'giftcard' && (
                          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                            <p className="text-green-400 text-sm">
                              <CheckCircle size={16} className="inline mr-2" />
                              Your gift card is being verified. This usually takes 5-30 minutes.
                            </p>
                          </div>
                        )}

                        <Button className="w-full" onClick={closeModal}>
                          Done
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Withdrawal Form */
                  <div className="space-y-6">
                    {!showConfirmation ? (
                      <>
                        {/* Balance Display */}
                        <div className="p-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-xl">
                          <p className="text-gray-400 text-sm">Available Balance</p>
                          <p className="text-3xl font-bold text-white">
                            ${(wallet?.mainBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        {/* Amount Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Withdrawal Amount (USD)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                            <input
                              type="number"
                              placeholder="Minimum $50"
                              value={withdrawalData.amount}
                              onChange={(e) => setWithdrawalData({ ...withdrawalData, amount: e.target.value })}
                              className="w-full pl-10 pr-4 py-4 bg-dark-700 border border-dark-600 rounded-xl text-white text-xl font-semibold placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Withdrawal Method */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-3">
                            Withdrawal Method
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {withdrawalMethods.slice(0, 6).map((method) => (
                              <button
                                key={method.id}
                                onClick={() => setWithdrawalData({ ...withdrawalData, paymentMethod: method.id })}
                                className={`p-4 rounded-xl border transition-all text-left ${
                                  withdrawalData.paymentMethod === method.id
                                    ? 'border-primary-500 bg-primary-500/10'
                                    : 'border-dark-600 bg-dark-700/50 hover:border-dark-500'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center text-xl mb-2`}>
                                  {method.icon}
                                </div>
                                <p className="text-white font-medium text-sm">{method.name}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Crypto Wallet Address */}
                        {withdrawalData.paymentMethod?.startsWith('crypto_') && (
                          <Input
                            label="Wallet Address"
                            placeholder="Enter your wallet address"
                            value={withdrawalData.walletAddress}
                            onChange={(e) => setWithdrawalData({ ...withdrawalData, walletAddress: e.target.value })}
                          />
                        )}

                        {/* Bank Details */}
                        {withdrawalData.paymentMethod?.startsWith('bank_') && (
                          <div className="space-y-4">
                            <Input
                              label="Bank Name"
                              placeholder="Enter bank name"
                              value={withdrawalData.bankName}
                              onChange={(e) => setWithdrawalData({ ...withdrawalData, bankName: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="Account Number"
                                placeholder="Account number"
                                value={withdrawalData.accountNumber}
                                onChange={(e) => setWithdrawalData({ ...withdrawalData, accountNumber: e.target.value })}
                              />
                              <Input
                                label="Routing Number"
                                placeholder="Routing number"
                                value={withdrawalData.routingNumber}
                                onChange={(e) => setWithdrawalData({ ...withdrawalData, routingNumber: e.target.value })}
                              />
                            </div>
                            <Input
                              label="Account Holder Name"
                              placeholder="Full name on account"
                              value={withdrawalData.accountName}
                              onChange={(e) => setWithdrawalData({ ...withdrawalData, accountName: e.target.value })}
                            />
                            {withdrawalData.paymentMethod === 'bank_wire' && (
                              <Input
                                label="SWIFT Code"
                                placeholder="SWIFT/BIC code"
                                value={withdrawalData.swiftCode}
                                onChange={(e) => setWithdrawalData({ ...withdrawalData, swiftCode: e.target.value })}
                              />
                            )}
                          </div>
                        )}

                        {/* Fee Preview */}
                        {withdrawalData.amount && parseFloat(withdrawalData.amount) >= 50 && (
                          <div className="p-4 bg-dark-700/50 rounded-xl border border-dark-600 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Withdrawal Amount</span>
                              <span className="text-white">${parseFloat(withdrawalData.amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Processing Fee</span>
                              <span className="text-yellow-400">-${getWithdrawalFee().toFixed(2)}</span>
                            </div>
                            <div className="border-t border-dark-600 pt-3 flex justify-between">
                              <span className="text-gray-300 font-medium">You'll Receive</span>
                              <span className="text-green-400 font-bold text-lg">
                                ${(parseFloat(withdrawalData.amount) - getWithdrawalFee()).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                              <Clock size={12} />
                              <span>Processing time: {getProcessingTime()}</span>
                            </div>
                          </div>
                        )}

                        <Button
                          className="w-full"
                          size="lg"
                          onClick={() => {
                            if (!withdrawalData.amount || parseFloat(withdrawalData.amount) < 50) {
                              toast.error('Minimum withdrawal is $50');
                              return;
                            }
                            if (!withdrawalData.paymentMethod) {
                              toast.error('Please select a withdrawal method');
                              return;
                            }
                            if (withdrawalData.paymentMethod.startsWith('crypto_') && !withdrawalData.walletAddress) {
                              toast.error('Please enter your wallet address');
                              return;
                            }
                            if (withdrawalData.paymentMethod.startsWith('bank_') && (!withdrawalData.bankName || !withdrawalData.accountNumber)) {
                              toast.error('Please fill in all bank details');
                              return;
                            }
                            setShowConfirmation(true);
                          }}
                        >
                          Continue
                        </Button>
                      </>
                    ) : (
                      /* Confirmation Step */
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="text-yellow-500" size={32} />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">Confirm Withdrawal</h3>
                          <p className="text-gray-400">Please verify the details below</p>
                        </div>

                        <div className="p-4 bg-dark-700 rounded-xl space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Amount</span>
                            <span className="text-white font-semibold">${parseFloat(withdrawalData.amount).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Method</span>
                            <span className="text-white">{withdrawalMethods.find(m => m.id === withdrawalData.paymentMethod)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Fee</span>
                            <span className="text-yellow-400">-${getWithdrawalFee().toFixed(2)}</span>
                          </div>
                          <div className="border-t border-dark-600 pt-3 flex justify-between">
                            <span className="text-white font-medium">You'll Receive</span>
                            <span className="text-green-400 font-bold text-xl">
                              ${(parseFloat(withdrawalData.amount) - getWithdrawalFee()).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                          <p className="text-yellow-400 text-sm">
                            ⚠️ Please double-check your withdrawal details. This action cannot be undone.
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="ghost" className="flex-1" onClick={() => setShowConfirmation(false)}>
                            Back
                          </Button>
                          <Button
                            className="flex-1"
                            isLoading={isLoading}
                            onClick={handleWithdrawal}
                          >
                            Confirm Withdrawal
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
