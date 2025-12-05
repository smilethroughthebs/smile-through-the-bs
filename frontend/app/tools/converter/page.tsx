'use client';

/**
 * ==============================================
 * VARLIXO - CRYPTO CONVERTER PAGE
 * ==============================================
 * Full-featured crypto/fiat converter tool
 */

import { motion } from 'framer-motion';
import { ArrowLeftRight, TrendingUp, Zap, Shield, Clock } from 'lucide-react';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import CryptoConverter from '@/app/components/ui/CryptoConverter';

const features = [
  {
    icon: TrendingUp,
    title: 'Real-Time Rates',
    description: 'Live exchange rates updated every minute from multiple sources',
  },
  {
    icon: Zap,
    title: '10+ Currencies',
    description: 'Convert between major cryptocurrencies and fiat currencies',
  },
  {
    icon: Shield,
    title: 'Accurate Data',
    description: 'Powered by CoinGecko API for reliable market data',
  },
  {
    icon: Clock,
    title: '24h Changes',
    description: 'Track price movements with 24-hour change indicators',
  },
];

export default function ConverterPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium mb-6 border border-blue-500/20">
              <ArrowLeftRight size={16} />
              Free Tool
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Crypto{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Converter
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Instantly convert between cryptocurrencies and fiat currencies with real-time exchange rates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Converter Section */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CryptoConverter />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-dark-800/50 rounded-2xl border border-dark-700 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <feature.icon className="text-primary-500" size={24} />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Supported Currencies */}
      <section className="py-16 px-4 bg-dark-800/30">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Supported Currencies
            </h2>
            <p className="text-gray-400 mb-8">
              Convert between these popular cryptocurrencies and fiat currencies
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
                { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
                { symbol: 'USDT', name: 'Tether', icon: '₮' },
                { symbol: 'BNB', name: 'BNB', icon: '⬡' },
                { symbol: 'SOL', name: 'Solana', icon: '◎' },
                { symbol: 'XRP', name: 'Ripple', icon: '✕' },
                { symbol: 'ADA', name: 'Cardano', icon: '₳' },
                { symbol: 'USD', name: 'US Dollar', icon: '💵' },
                { symbol: 'EUR', name: 'Euro', icon: '💶' },
                { symbol: 'GBP', name: 'Pound', icon: '💷' },
              ].map((currency) => (
                <div
                  key={currency.symbol}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-xl border border-dark-700"
                >
                  <span className="text-xl">{currency.icon}</span>
                  <span className="text-white font-medium">{currency.symbol}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

