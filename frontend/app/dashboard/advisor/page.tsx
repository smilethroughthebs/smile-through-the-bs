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

// AI Response templates based on keywords
const aiResponses: Record<string, { response: string; suggestions: string[] }> = {
  'beginner': {
    response: `Welcome to investing! Here's my advice for beginners:\n\n📚 **Start Small**\nBegin with our Starter Plan ($100 min) to learn how the platform works.\n\n💡 **Diversify Later**\nOnce comfortable, spread investments across different plans.\n\n⏰ **Be Patient**\nConsistent small investments often outperform risky large ones.\n\n🎯 **Recommended Plan**: Starter Plan at 1.5% daily - perfect for learning!`,
    suggestions: ['Tell me about the Starter plan', 'What are the risks?', 'How much should I start with?'],
  },
  'recommend': {
    response: `Based on typical investor profiles, here are my recommendations:\n\n💰 **Conservative ($100-$1,000)**\n→ Starter Plan: 1.5% daily, 30 days\n→ Expected return: ~45%\n\n📈 **Moderate ($1,000-$10,000)**\n→ Professional Plan: 2.5% daily, 45 days\n→ Expected return: ~112%\n\n🚀 **Aggressive ($10,000+)**\n→ Elite Plan: 3% daily, 60 days\n→ Expected return: ~180%\n\n⚠️ Remember: Higher returns = Higher risk. Never invest more than you can afford to lose.`,
    suggestions: ['Calculate my potential earnings', 'What are the risks?', 'How do withdrawals work?'],
  },
  'risk': {
    response: `Understanding investment risks is crucial:\n\n⚠️ **Market Risk**\nCrypto markets are volatile. Our strategies aim to minimize exposure.\n\n🔒 **Platform Security**\n• 256-bit encryption\n• 2FA authentication\n• Cold storage for funds\n• $100M insurance coverage\n\n📊 **Risk Mitigation Tips**\n1. Never invest emergency funds\n2. Start with smaller amounts\n3. Diversify across plans\n4. Withdraw profits regularly\n\n✅ Our track record: 99.8% uptime, 50,000+ satisfied investors.`,
    suggestions: ['How is my money protected?', 'Show me safe investment options', 'What is your success rate?'],
  },
  'withdraw': {
    response: `Here's how withdrawals work:\n\n💸 **Process**\n1. Go to Wallet → Withdraw\n2. Choose crypto or bank transfer\n3. Enter amount and address\n4. Confirm withdrawal\n\n⏱️ **Processing Time**\n• Crypto: Within 24 hours\n• Bank: 2-5 business days\n\n💰 **Fees**\n• Crypto: Network fee only\n• Bank: Free above $1,000\n\n📌 **Minimum**: $50\n📌 **Daily profits**: Withdrawable anytime!`,
    suggestions: ['What are the fees?', 'How long does it take?', 'Can I withdraw daily profits?'],
  },
  'profit': {
    response: `Let me explain how profits work:\n\n📈 **Daily Returns**\n• Starter: 1.5%/day ($100 min)\n• Professional: 2.5%/day ($5,000 min)\n• Elite: 3.0%/day ($25,000 min)\n\n💵 **Example Calculation**\n$10,000 in Professional Plan:\n• Daily: $250\n• Weekly: $1,750\n• Total (45 days): $11,250 profit\n• Final return: $21,250\n\n✨ Profits credited daily to your wallet!`,
    suggestions: ['Calculate my specific returns', 'When do I get my principal back?', 'Can I reinvest profits?'],
  },
  'default': {
    response: `I'm your AI Investment Advisor! I can help you with:\n\n🎯 **Investment Strategies**\nPersonalized recommendations based on your goals\n\n💰 **Plan Selection**\nFinding the right plan for your budget\n\n📊 **Return Calculations**\nProject your potential earnings\n\n🔒 **Risk Assessment**\nUnderstand and manage investment risks\n\n❓ **Platform Questions**\nDeposits, withdrawals, KYC, and more\n\nWhat would you like to know?`,
    suggestions: ['Recommend a plan for me', 'I\'m a beginner', 'Calculate potential returns', 'Explain the risks'],
  },
};

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

  const getAIResponse = (userMessage: string): { response: string; suggestions: string[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, value] of Object.entries(aiResponses)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        return value;
      }
    }
    
    // Check for additional keywords
    if (lowerMessage.includes('how much') || lowerMessage.includes('calculate') || lowerMessage.includes('earn')) {
      return aiResponses.profit;
    }
    if (lowerMessage.includes('safe') || lowerMessage.includes('secure') || lowerMessage.includes('protect')) {
      return aiResponses.risk;
    }
    if (lowerMessage.includes('start') || lowerMessage.includes('new') || lowerMessage.includes('first')) {
      return aiResponses.beginner;
    }
    if (lowerMessage.includes('which plan') || lowerMessage.includes('best plan') || lowerMessage.includes('suggest')) {
      return aiResponses.recommend;
    }
    
    return aiResponses.default;
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

