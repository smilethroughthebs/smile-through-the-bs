'use client';

/**
 * ==============================================
 * VARLIXO - CRYPTO CONVERTER WIDGET
 * ==============================================
 * Convert between crypto and fiat currencies
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, RefreshCw, TrendingUp, TrendingDown, ChevronDown, Check } from 'lucide-react';
import { marketAPI } from '@/app/lib/api';

interface Currency {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  price: number;
  change24h?: number;
}

const defaultCurrencies: Currency[] = [
  { id: 'usd', symbol: 'USD', name: 'US Dollar', price: 1, image: '💵' },
  { id: 'eur', symbol: 'EUR', name: 'Euro', price: 0.92, image: '💶' },
  { id: 'gbp', symbol: 'GBP', name: 'British Pound', price: 0.79, image: '💷' },
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 67000, change24h: 2.5, image: '₿' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3500, change24h: -1.2, image: 'Ξ' },
  { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1, change24h: 0, image: '₮' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 580, change24h: 3.1, image: '⬡' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 140, change24h: 5.2, image: '◎' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0.52, change24h: 1.8, image: '✕' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: -0.5, image: '₳' },
];

interface CryptoConverterProps {
  variant?: 'default' | 'compact' | 'modal';
  className?: string;
}

export default function CryptoConverter({ variant = 'default', className = '' }: CryptoConverterProps) {
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies);
  const [fromCurrency, setFromCurrency] = useState<Currency>(defaultCurrencies[3]); // BTC
  const [toCurrency, setToCurrency] = useState<Currency>(defaultCurrencies[0]); // USD
  const [fromAmount, setFromAmount] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch live prices
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const response = await marketAPI.getCryptos(10);
      const data = response.data?.data?.data || response.data?.data || [];
      
      if (Array.isArray(data) && data.length > 0) {
        const updatedCurrencies = [...defaultCurrencies];
        
        data.forEach((crypto: any) => {
          const index = updatedCurrencies.findIndex(c => c.id === crypto.id);
          if (index > -1) {
            updatedCurrencies[index] = {
              ...updatedCurrencies[index],
              price: crypto.current_price || crypto.price || updatedCurrencies[index].price,
              change24h: crypto.price_change_percentage_24h || crypto.change24h || 0,
            };
          }
        });
        
        setCurrencies(updatedCurrencies);
        
        // Update selected currencies with new prices
        const updatedFrom = updatedCurrencies.find(c => c.id === fromCurrency.id);
        const updatedTo = updatedCurrencies.find(c => c.id === toCurrency.id);
        if (updatedFrom) setFromCurrency(updatedFrom);
        if (updatedTo) setToCurrency(updatedTo);
        
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.log('Using default prices');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate conversion
  const convertedAmount = useMemo(() => {
    const amount = parseFloat(fromAmount) || 0;
    if (fromCurrency.id === toCurrency.id) return amount;
    
    // Convert to USD first, then to target currency
    const fromInUsd = amount * fromCurrency.price;
    const result = fromInUsd / toCurrency.price;
    
    return result;
  }, [fromAmount, fromCurrency, toCurrency]);

  // Swap currencies
  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setFromAmount(convertedAmount.toFixed(8).replace(/\.?0+$/, ''));
  };

  // Format number based on size
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (num >= 1) return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
    if (num >= 0.0001) return num.toFixed(6);
    return num.toFixed(8);
  };

  // Dropdown component
  const CurrencyDropdown = ({ 
    selected, 
    onSelect, 
    isOpen, 
    setIsOpen, 
    position 
  }: { 
    selected: Currency; 
    onSelect: (c: Currency) => void; 
    isOpen: boolean; 
    setIsOpen: (v: boolean) => void;
    position: 'from' | 'to';
  }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-xl transition-colors"
      >
        <span className="text-xl">{selected.image}</span>
        <span className="font-semibold text-white">{selected.symbol}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${position === 'from' ? 'left-0' : 'right-0'} mt-2 w-56 bg-dark-800 border border-dark-700 rounded-2xl shadow-xl z-50 overflow-hidden`}
          >
            <div className="p-2 max-h-64 overflow-y-auto">
              {currencies.map((currency) => (
                <button
                  key={currency.id}
                  onClick={() => {
                    onSelect(currency);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    selected.id === currency.id
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-gray-300 hover:bg-dark-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{currency.image}</span>
                    <div className="text-left">
                      <p className="font-medium">{currency.symbol}</p>
                      <p className="text-xs text-gray-500">{currency.name}</p>
                    </div>
                  </div>
                  {selected.id === currency.id && (
                    <Check size={16} className="text-primary-500" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className={`p-4 bg-dark-800/50 rounded-2xl border border-dark-700 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Quick Convert</h3>
          <button 
            onClick={fetchPrices}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="w-full bg-dark-700 border-none rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0"
            />
          </div>
          <span className="text-sm text-gray-500">{fromCurrency.symbol}</span>
          <span className="text-gray-600">=</span>
          <span className="text-sm font-semibold text-primary-400">
            {formatNumber(convertedAmount)} {toCurrency.symbol}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-dark-800/50 rounded-3xl border border-dark-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Crypto Converter</h3>
        <button 
          onClick={fetchPrices}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* From Currency */}
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-2">From</label>
        <div className="flex items-center gap-3 p-4 bg-dark-900/50 rounded-2xl border border-dark-700">
          <CurrencyDropdown
            selected={fromCurrency}
            onSelect={setFromCurrency}
            isOpen={showFromDropdown}
            setIsOpen={(v) => {
              setShowFromDropdown(v);
              if (v) setShowToDropdown(false);
            }}
            position="from"
          />
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="flex-1 bg-transparent text-right text-2xl font-bold text-white focus:outline-none"
            placeholder="0"
          />
        </div>
        {fromCurrency.change24h !== undefined && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className="text-gray-500">24h:</span>
            <span className={`flex items-center gap-0.5 ${fromCurrency.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {fromCurrency.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(fromCurrency.change24h).toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-3 relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSwap}
          className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 hover:bg-primary-400 transition-colors"
        >
          <ArrowUpDown size={18} />
        </motion.button>
      </div>

      {/* To Currency */}
      <div className="mt-2">
        <label className="block text-xs text-gray-500 mb-2">To</label>
        <div className="flex items-center gap-3 p-4 bg-dark-900/50 rounded-2xl border border-dark-700">
          <CurrencyDropdown
            selected={toCurrency}
            onSelect={setToCurrency}
            isOpen={showToDropdown}
            setIsOpen={(v) => {
              setShowToDropdown(v);
              if (v) setShowFromDropdown(false);
            }}
            position="to"
          />
          <div className="flex-1 text-right">
            <p className="text-2xl font-bold text-primary-400">
              {formatNumber(convertedAmount)}
            </p>
          </div>
        </div>
        {toCurrency.change24h !== undefined && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className="text-gray-500">24h:</span>
            <span className={`flex items-center gap-0.5 ${toCurrency.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {toCurrency.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(toCurrency.change24h).toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Exchange Rate */}
      <div className="mt-6 p-4 bg-dark-900/30 rounded-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Exchange Rate</span>
          <span className="text-white font-medium">
            1 {fromCurrency.symbol} = {formatNumber(fromCurrency.price / toCurrency.price)} {toCurrency.symbol}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

