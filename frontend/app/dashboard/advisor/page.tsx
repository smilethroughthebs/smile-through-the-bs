'use client';

/**
 * ==============================================
 * VARLIXO - AI INVESTMENT ADVISOR
 * ==============================================
 * AI-powered investment recommendations and guidance
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  User,
  Sparkles,
  TrendingUp,
  Shield,
  Target,
  Wallet,
  Clock,
  ChevronRight,
  Lightbulb,
  PieChart,
  BarChart3,
  AlertTriangle,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useAuthStore } from '@/app/lib/store';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
  feedback?: 'up' | 'down' | null;
}

// Smart AI Engine - Natural Language Processing
class SmartAI {
  private context: string[] = [];
  private userName: string = '';
  private userBalance: number = 0;

  setContext(name: string, balance: number) {
    this.userName = name;
    this.userBalance = balance;
  }

  // Extract numbers from text
  extractAmount(text: string): number | null {
    const patterns = [
      /\$([0-9,]+(?:\.[0-9]+)?)/,
      /([0-9,]+(?:\.[0-9]+)?)\s*(?:dollars?|usd|\$)/i,
      /invest(?:ing)?\s+([0-9,]+(?:\.[0-9]+)?)/i,
      /([0-9,]+(?:\.[0-9]+)?)\s*(?:k|thousand)/i,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        let amount = parseFloat(match[1].replace(/,/g, ''));
        if (text.toLowerCase().includes('k') || text.toLowerCase().includes('thousand')) {
          amount *= 1000;
        }
        return amount;
      }
    }
    return null;
  }

  // Calculate investment returns
  calculateReturns(amount: number, plan: string = 'professional') {
    const plans: Record<string, { daily: number; duration: number; name: string }> = {
      starter: { daily: 1.5, duration: 30, name: 'Starter' },
      professional: { daily: 2.5, duration: 45, name: 'Professional' },
      elite: { daily: 3.0, duration: 60, name: 'Elite' },
    };
    
    const p = plans[plan] || plans.professional;
    const dailyProfit = (amount * p.daily) / 100;
    const totalProfit = dailyProfit * p.duration;
    const totalReturn = amount + totalProfit;
    
    return { dailyProfit, totalProfit, totalReturn, plan: p };
  }

  // Determine best plan based on amount
  getBestPlan(amount: number): string {
    if (amount >= 25000) return 'elite';
    if (amount >= 5000) return 'professional';
    return 'starter';
  }

  // Generate intelligent response
  generateResponse(userMessage: string): { response: string; suggestions: string[] } {
    const msg = userMessage.toLowerCase();
    this.context.push(msg);
    
    // GREETINGS
    if (msg.match(/^(hi|hello|hey|good\s*(morning|afternoon|evening)|what'?s\s*up|sup)/i)) {
      const greetings = [
        `Hey${this.userName ? ` ${this.userName}` : ''}! 👋 Great to see you! I'm your AI investment advisor. What's on your mind today?`,
        `Hello${this.userName ? ` ${this.userName}` : ''}! 🌟 Ready to grow your wealth? Ask me anything about investments!`,
        `Hi there! 💰 I'm here to help you make smart investment decisions. What would you like to know?`,
      ];
      return {
        response: greetings[Math.floor(Math.random() * greetings.length)],
        suggestions: ['What plans do you offer?', 'I want to invest $1000', 'Am I ready to invest?'],
      };
    }

    // CALCULATE SPECIFIC AMOUNTS
    const amount = this.extractAmount(msg);
    if (amount && (msg.includes('invest') || msg.includes('put') || msg.includes('calculate') || msg.includes('earn') || msg.includes('make') || msg.includes('return'))) {
      const bestPlan = this.getBestPlan(amount);
      const calc = this.calculateReturns(amount, bestPlan);
      
      return {
        response: `Great question! Let me calculate that for you 🧮\n\n**Investing $${amount.toLocaleString()} in ${calc.plan.name} Plan:**\n\n📊 **Daily Returns**: $${calc.dailyProfit.toFixed(2)} (${calc.plan.daily}%)\n📅 **Duration**: ${calc.plan.duration} days\n💰 **Total Profit**: $${calc.totalProfit.toFixed(2)}\n🎯 **Final Return**: $${calc.totalReturn.toFixed(2)}\n\nThat's a **${((calc.totalProfit / amount) * 100).toFixed(1)}% total return!**\n\n${amount >= 5000 ? '💎 Pro tip: With this amount, you qualify for priority support!' : '💡 Tip: Consider starting here and reinvesting profits for compound growth!'}\n\nReady to get started?`,
        suggestions: ['Start this investment', 'Show me other plans', 'What are the risks?'],
      };
    }

    // HOW MUCH SHOULD I INVEST / BUDGET QUESTIONS
    if (msg.match(/how\s*much\s*(should|can|to)\s*(i\s*)?(invest|start|put)/i) || msg.includes('budget')) {
      return {
        response: `Great question! Here's my personalized advice 💡\n\n**Golden Rules:**\n1. Never invest money you can't afford to lose\n2. Start with 5-10% of your savings max\n3. Keep emergency funds separate\n\n**Based on Investment Size:**\n• $100-$500 → Perfect for testing the waters\n• $1,000-$5,000 → Good for steady growth\n• $5,000-$25,000 → Serious wealth building\n• $25,000+ → Maximum returns with Elite plan\n\n${this.userBalance > 0 ? `\n📊 Your current balance is $${this.userBalance.toLocaleString()}. Based on this, I'd suggest starting with $${Math.min(this.userBalance * 0.1, 5000).toFixed(0)} to test the platform.` : ''}\n\nWhat amount are you considering?`,
        suggestions: ['Calculate returns for $500', 'Calculate returns for $5000', 'What\'s the minimum?'],
      };
    }

    // PLANS / COMPARISON
    if (msg.match(/plan|option|package|tier|which\s*one|compare|difference/i)) {
      return {
        response: `Here are our investment plans! 📋\n\n**🥉 STARTER PLAN**\n• Daily ROI: 1.5%\n• Duration: 30 days\n• Min: $100 | Max: $4,999\n• Total Return: ~45%\n• Best for: Beginners\n\n**🥈 PROFESSIONAL PLAN** ⭐ Most Popular\n• Daily ROI: 2.5%\n• Duration: 45 days\n• Min: $5,000 | Max: $24,999\n• Total Return: ~112%\n• Best for: Serious investors\n\n**🥇 ELITE PLAN**\n• Daily ROI: 3.0%\n• Duration: 60 days\n• Min: $25,000 | Max: $100,000\n• Total Return: ~180%\n• Best for: High-net-worth investors\n\n✅ All plans return your principal at the end!\n\nWhich plan interests you?`,
        suggestions: ['Tell me more about Professional', 'Calculate $10,000 returns', 'What\'s the safest option?'],
      };
    }

    // BEGINNER / NEW / FIRST TIME
    if (msg.match(/beginner|new|first\s*time|start|never\s*invest|don'?t\s*know|learn/i)) {
      return {
        response: `Welcome to the world of investing! 🎉 I'll guide you step by step.\n\n**Your First Steps:**\n\n1️⃣ **Start Small** ($100-$500)\n   Use our Starter Plan to learn the ropes\n\n2️⃣ **Verify Your Account**\n   Complete KYC for full access\n\n3️⃣ **Make Your First Deposit**\n   BTC, ETH, or USDT accepted\n\n4️⃣ **Watch Your Profits**\n   Daily returns credited automatically!\n\n**Beginner Tips:**\n• Don't invest rent money 🏠\n• Start with amount you're OK losing\n• Withdraw some profits regularly\n• Ask me anything - I'm here 24/7!\n\nWhat's your biggest concern about starting?`,
        suggestions: ['How do I deposit?', 'Is my money safe?', 'Calculate $100 returns'],
      };
    }

    // SAFETY / SECURITY / TRUST
    if (msg.match(/safe|secure|trust|legit|scam|protect|hack|steal|lose|risk/i)) {
      return {
        response: `Your security is our #1 priority! 🔒\n\n**How We Protect You:**\n\n🛡️ **Technical Security**\n• 256-bit SSL encryption\n• 2FA authentication\n• Cold storage for 95% of funds\n• DDoS protection\n\n💰 **Financial Protection**\n• $100M insurance coverage\n• Segregated user accounts\n• Regular third-party audits\n\n📊 **Track Record**\n• 50,000+ active investors\n• 99.9% platform uptime\n• 4+ years in operation\n• $150M+ processed\n\n**Risk Disclosure:**\nAll investments carry risk. Only invest what you can afford to lose. Past performance doesn't guarantee future results.\n\nWant to know more about specific security measures?`,
        suggestions: ['How is 2FA set up?', 'What if you get hacked?', 'Show me success stories'],
      };
    }

    // DEPOSIT
    if (msg.match(/deposit|add\s*(money|funds)|fund\s*my|put\s*money|how\s*to\s*pay/i)) {
      return {
        response: `Here's how to deposit funds! 💳\n\n**Step-by-Step:**\n1. Go to **Dashboard → Wallet**\n2. Click **"Deposit"**\n3. Choose your method:\n   • 🟠 Bitcoin (BTC)\n   • 🔷 Ethereum (ETH)\n   • 🟢 Tether (USDT)\n4. Copy the wallet address\n5. Send from your wallet/exchange\n6. Wait for confirmation (10-30 min)\n\n**Details:**\n• Minimum: $100\n• Maximum: Unlimited (verified)\n• Fees: We cover network fees!\n• Processing: Usually under 30 minutes\n\n💡 **Pro Tip:** USDT on TRC-20 has the lowest fees!\n\nNeed help with a specific payment method?`,
        suggestions: ['I want to deposit BTC', 'What\'s the minimum?', 'How long until it shows?'],
      };
    }

    // WITHDRAW
    if (msg.match(/withdraw|cash\s*out|take\s*out|get\s*my\s*money|payout/i)) {
      return {
        response: `Here's how withdrawals work! 💸\n\n**Process:**\n1. Go to **Dashboard → Wallet**\n2. Click **"Withdraw"**\n3. Enter amount & wallet address\n4. Confirm with 2FA\n5. Receive funds!\n\n**Timeframes:**\n• Crypto: 1-24 hours\n• Bank Transfer: 2-5 business days\n\n**Limits:**\n• Minimum: $50\n• Maximum: $50,000/day (verified)\n• Fees: Only network fees\n\n✨ **Daily profits are withdrawable immediately!**\n\n⚠️ Note: Large withdrawals may require additional verification for security.\n\nAnything specific about withdrawals?`,
        suggestions: ['What are the fees?', 'Can I withdraw daily?', 'How to add bank account?'],
      };
    }

    // REFERRAL
    if (msg.match(/referral|invite|friend|bonus|commission|affiliate/i)) {
      return {
        response: `Earn passive income with referrals! 🎁\n\n**How It Works:**\n• Share your unique referral link\n• Earn **5%** of your referrals' investments\n• No limit on referrals!\n\n**Example:**\nRefer 10 friends who invest $1,000 each:\n→ You earn $500 in bonuses! 💰\n\n**Tier Bonuses:**\n• 10+ referrals: +1% bonus\n• 50+ referrals: +2% bonus\n• 100+ referrals: VIP status 🌟\n\n**Find Your Link:**\nDashboard → Referrals → Copy Link\n\nStart sharing and watch your earnings grow!`,
        suggestions: ['Where\'s my referral link?', 'How do I track referrals?', 'When do I get paid?'],
      };
    }

    // KYC
    if (msg.match(/kyc|verify|verification|identity|document|passport|id/i)) {
      return {
        response: `Let me explain KYC verification! 📋\n\n**What You Need:**\n• Government-issued ID (passport/license)\n• Selfie holding your ID\n• Proof of address (optional)\n\n**How to Verify:**\n1. Go to **Dashboard → KYC**\n2. Upload your documents\n3. Wait 24-48 hours\n4. Get verified! ✅\n\n**Benefits of Verification:**\n• Higher withdrawal limits\n• Faster processing\n• Access to Elite plans\n• Priority support\n\n💡 Tip: Use good lighting for photos and ensure all text is readable!\n\nNeed help with the process?`,
        suggestions: ['What documents do you accept?', 'How long does it take?', 'Is my data safe?'],
      };
    }

    // THANK YOU / POSITIVE
    if (msg.match(/thank|thanks|appreciate|helpful|great|awesome|perfect|good\s*job/i)) {
      const responses = [
        `You're welcome! 😊 I'm always here to help. Anything else you'd like to know?`,
        `Happy to help! 🌟 Feel free to ask me anything else about investing!`,
        `Glad I could assist! 💪 Remember, I'm available 24/7 for any questions!`,
      ];
      return {
        response: responses[Math.floor(Math.random() * responses.length)],
        suggestions: ['I have another question', 'How do I get started?', 'That\'s all for now'],
      };
    }

    // BYE / GOODBYE
    if (msg.match(/bye|goodbye|see\s*you|later|that'?s\s*all|done|exit/i)) {
      return {
        response: `Goodbye${this.userName ? ` ${this.userName}` : ''}! 👋\n\nRemember:\n• I'm here 24/7 if you need me\n• Check your dashboard for updates\n• Happy investing! 📈\n\nCome back anytime!`,
        suggestions: ['Actually, one more question', 'Go to Dashboard', 'View Investment Plans'],
      };
    }

    // YES / CONFIRM
    if (msg.match(/^(yes|yeah|yep|sure|ok|okay|definitely|absolutely)$/i)) {
      return {
        response: `Great! What would you like to do next? 🚀`,
        suggestions: ['Make a deposit', 'View my portfolio', 'Calculate returns'],
      };
    }

    // DEFAULT - SMART FALLBACK
    const fallbacks = [
      {
        response: `I understand you're asking about "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}"\n\nI'm still learning, but I can definitely help you with:\n\n📊 **Investment Questions**\n• Plan recommendations\n• Return calculations\n• Risk assessment\n\n💰 **Account Operations**\n• Deposits & withdrawals\n• KYC verification\n• Referral program\n\n🔧 **Technical Help**\n• Platform navigation\n• Security settings\n\nTry asking in a different way, or pick from the suggestions below!`,
        suggestions: ['Recommend a plan', 'Calculate $1000 returns', 'How do deposits work?'],
      },
      {
        response: `Hmm, let me think about that... 🤔\n\nI'm not 100% sure I understood your question. Here's what I can help with:\n\n• **"How much can I earn with $X?"**\n• **"Which plan is best for beginners?"**\n• **"How do I deposit/withdraw?"**\n• **"Is my investment safe?"**\n\nCould you rephrase your question?`,
        suggestions: ['What are the investment plans?', 'I\'m a beginner', 'Explain the risks'],
      },
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

const smartAI = new SmartAI();

// Suggested prompts
const suggestedPrompts = [
  { icon: Target, text: 'Recommend an investment plan', color: 'text-primary-500' },
  { icon: TrendingUp, text: 'Calculate my potential returns', color: 'text-green-500' },
  { icon: Shield, text: 'Explain the risks involved', color: 'text-yellow-500' },
  { icon: Wallet, text: 'How do withdrawals work?', color: 'text-blue-500' },
];

export default function AdvisorPage() {
  const { user, wallet } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello${user?.firstName ? ` ${user.firstName}` : ''}! 👋\n\nI'm your AI Investment Advisor powered by advanced algorithms. I'm here to help you make smarter investment decisions.\n\nYour current balance: $${wallet?.mainBalance?.toLocaleString() || '0'}\n\nHow can I assist you today?`,
      sender: 'ai',
      timestamp: new Date(),
      suggestions: ['Recommend a plan for me', 'I\'m new to investing', 'Calculate potential returns'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set AI context with user info
  useEffect(() => {
    smartAI.setContext(user?.firstName || '', wallet?.mainBalance || 0);
  }, [user, wallet]);

  const getAIResponse = (userMessage: string): { response: string; suggestions: string[] } => {
    return smartAI.generateResponse(userMessage);
  };

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const { response, suggestions } = getAIResponse(messageText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
        suggestions,
        feedback: null,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Bot size={24} className="text-white" />
            </div>
            AI Investment Advisor
          </h1>
          <p className="text-gray-400 mt-1">Get personalized investment recommendations</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setMessages([messages[0]])}
          leftIcon={<RefreshCw size={18} />}
        >
          New Chat
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <Wallet size={20} className="text-primary-500" />
            <div>
              <p className="text-xs text-gray-400">Your Balance</p>
              <p className="text-lg font-bold text-white">${wallet?.mainBalance?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-green-500" />
            <div>
              <p className="text-xs text-gray-400">Total Profit</p>
              <p className="text-lg font-bold text-green-400">+${wallet?.totalEarnings?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <PieChart size={20} className="text-purple-500" />
            <div>
              <p className="text-xs text-gray-400">Active Plans</p>
              <p className="text-lg font-bold text-white">0</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chat Container */}
      <Card className="h-[500px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : ''}`}>
                <div className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-primary-500' 
                      : 'bg-gradient-to-br from-primary-500 to-purple-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User size={18} className="text-white" />
                    ) : (
                      <Bot size={18} className="text-white" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`p-4 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-700 text-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                    </div>
                    
                    {/* AI message actions */}
                    {message.sender === 'ai' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(message.text, message.id)}
                          className="p-1.5 text-gray-500 hover:text-white transition-colors"
                        >
                          {copiedId === message.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, 'up')}
                          className={`p-1.5 transition-colors ${
                            message.feedback === 'up' ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
                          }`}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, 'down')}
                          className={`p-1.5 transition-colors ${
                            message.feedback === 'down' ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          <ThumbsDown size={14} />
                        </button>
                        <span className="text-xs text-gray-600">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSend(suggestion)}
                            className="px-3 py-1.5 bg-dark-600 hover:bg-dark-500 text-gray-300 text-xs rounded-full transition-colors flex items-center gap-1"
                          >
                            {suggestion}
                            <ChevronRight size={12} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div className="bg-dark-700 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts (show when few messages) */}
        {messages.length <= 2 && (
          <div className="px-6 py-3 border-t border-dark-700">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Lightbulb size={12} />
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(prompt.text)}
                  className="flex items-center gap-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-xl text-sm text-gray-300 transition-colors"
                >
                  <prompt.icon size={16} className={prompt.color} />
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-dark-700">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about investments..."
              className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="px-6"
            >
              <Send size={18} />
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            AI advisor provides general guidance. Always do your own research before investing.
          </p>
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <div className="flex gap-3">
          <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-medium">Investment Disclaimer</p>
            <p className="text-gray-400 text-sm mt-1">
              The AI Advisor provides educational information only and should not be considered financial advice. 
              Past performance does not guarantee future results. Always invest responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

