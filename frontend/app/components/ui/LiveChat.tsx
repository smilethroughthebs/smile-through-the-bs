'use client';

/**
 * ==============================================
 * VARLIXO - LIVE CHAT WIDGET
 * ==============================================
 * Floating chat bubble with expandable chat window
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Minus,
  Paperclip,
  Smile,
  Bot,
  User,
  Sparkles,
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  typing?: boolean;
}

const quickReplies = [
  'How do I deposit?',
  'Withdrawal process',
  'Investment plans',
  'KYC verification',
  'Contact support',
];

const botResponses: Record<string, string> = {
  'how do i deposit': 'To make a deposit:\n\n1. Go to Dashboard → Wallet\n2. Click "Deposit"\n3. Choose your payment method (BTC, ETH, USDT)\n4. Send funds to the provided address\n5. Wait for confirmation\n\nMinimum deposit is $100. Need more help?',
  'withdrawal': 'To withdraw:\n\n1. Go to Dashboard → Wallet\n2. Click "Withdraw"\n3. Enter amount and wallet address\n4. Confirm withdrawal\n\nWithdrawals are processed within 24 hours. Minimum withdrawal is $50.',
  'investment': 'We offer 3 investment plans:\n\n🥉 Starter: 1.5% daily (30 days)\n🥈 Professional: 2.5% daily (45 days)\n🥇 Elite: 3% daily (60 days)\n\nAll plans return your principal at the end. Visit /plans to learn more!',
  'kyc': 'KYC verification requires:\n\n1. Government-issued ID (passport/driver\'s license)\n2. Selfie with ID\n3. Proof of address (optional)\n\nVerification takes 24-48 hours. Go to Dashboard → KYC to start.',
  'support': 'You can reach our support team:\n\n📧 Email: support@varlixo.com\n📱 WhatsApp: +1 (888) 123-4567\n💬 Live Chat: You\'re using it!\n\nWe respond within 24 hours.',
  'default': 'Thanks for your message! Our AI is processing your request. For immediate assistance, you can:\n\n• Check our FAQ section\n• Email support@varlixo.com\n• Call +1 (888) 123-4567\n\nAn agent will be with you shortly!',
};

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! 👋 Welcome to Varlixo! I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return botResponses.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    handleSend();
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center text-white z-50 group"
          >
            <MessageCircle size={28} />
            {/* Pulse animation */}
            <span className="absolute w-full h-full rounded-full bg-primary-500 animate-ping opacity-30" />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : 500,
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[380px] bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Varlixo Support</h3>
                  <p className="text-white/70 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minus size={18} className="text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-primary-500' 
                            : 'bg-dark-700'
                        }`}>
                          {message.sender === 'user' ? (
                            <User size={14} className="text-white" />
                          ) : (
                            <Bot size={14} className="text-primary-400" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-primary-500 text-white rounded-br-md'
                              : 'bg-dark-700 text-gray-200 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-white/60' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
                        <Bot size={14} className="text-primary-400" />
                      </div>
                      <div className="bg-dark-700 px-4 py-3 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length <= 2 && (
                  <div className="px-4 py-2 border-t border-dark-700 bg-dark-800">
                    <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => {
                            setInput(reply);
                            setTimeout(() => handleSend(), 100);
                          }}
                          className="px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-gray-300 text-xs rounded-full transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-dark-700 bg-dark-800">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors">
                      <Paperclip size={20} />
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type your message..."
                      className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors">
                      <Smile size={20} />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="p-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-700 disabled:text-gray-600 text-white rounded-xl transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

