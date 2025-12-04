/**
 * ==============================================
 * VARLIXO - MARKET DATA SERVICE
 * ==============================================
 * Fetches real-time cryptocurrency and market data
 * from CoinGecko API.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// Market data interfaces
export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  image: string;
  sparkline_in_7d?: { price: number[] };
}

export interface MarketStats {
  total_market_cap: number;
  total_volume: number;
  market_cap_change_percentage_24h: number;
  bitcoin_dominance: number;
}

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private readonly apiUrl: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheDuration = 60000; // 1 minute cache

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('apis.coinGecko') || 'https://api.coingecko.com/api/v3';
  }

  /**
   * Get top cryptocurrencies by market cap
   */
  async getTopCryptos(limit: number = 10): Promise<CryptoPrice[]> {
    const cacheKey = `top-cryptos-${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.apiUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h',
        },
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch crypto prices:', error.message);
      return [];
    }
  }

  /**
   * Get specific cryptocurrency price
   */
  async getCryptoPrice(coinId: string): Promise<CryptoPrice | null> {
    const cacheKey = `crypto-${coinId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.apiUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: coinId,
          sparkline: true,
        },
      });

      const data = response.data[0] || null;
      if (data) {
        this.setCache(cacheKey, data);
      }
      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${coinId}:`, error.message);
      return null;
    }
  }

  /**
   * Get multiple crypto prices
   */
  async getMultipleCryptoPrices(coinIds: string[]): Promise<CryptoPrice[]> {
    const cacheKey = `cryptos-${coinIds.join(',')}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.apiUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: coinIds.join(','),
          sparkline: true,
        },
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch multiple crypto prices:', error.message);
      return [];
    }
  }

  /**
   * Get global market statistics
   */
  async getGlobalStats(): Promise<MarketStats | null> {
    const cacheKey = 'global-stats';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.apiUrl}/global`);
      const data = response.data.data;

      const stats: MarketStats = {
        total_market_cap: data.total_market_cap.usd,
        total_volume: data.total_volume.usd,
        market_cap_change_percentage_24h: data.market_cap_change_percentage_24h_usd,
        bitcoin_dominance: data.market_cap_percentage.btc,
      };

      this.setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      this.logger.error('Failed to fetch global stats:', error.message);
      return null;
    }
  }

  /**
   * Convert between currencies
   */
  async convertCurrency(
    fromCoin: string,
    toCoin: string,
    amount: number,
  ): Promise<{ converted: number; rate: number } | null> {
    try {
      const prices = await this.getMultipleCryptoPrices([fromCoin, toCoin]);
      
      if (prices.length < 2) {
        return null;
      }

      const fromPrice = prices.find((p) => p.id === fromCoin)?.current_price || 0;
      const toPrice = prices.find((p) => p.id === toCoin)?.current_price || 0;

      if (fromPrice === 0 || toPrice === 0) {
        return null;
      }

      const rate = fromPrice / toPrice;
      const converted = amount * rate;

      return { converted, rate };
    } catch (error) {
      this.logger.error('Currency conversion failed:', error.message);
      return null;
    }
  }

  /**
   * Get trending coins
   */
  async getTrendingCoins(): Promise<any[]> {
    const cacheKey = 'trending';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.apiUrl}/search/trending`);
      const trending = response.data.coins.slice(0, 7).map((item: any) => item.item);
      
      this.setCache(cacheKey, trending);
      return trending;
    } catch (error) {
      this.logger.error('Failed to fetch trending coins:', error.message);
      return [];
    }
  }

  /**
   * Get price history for charts
   */
  async getPriceHistory(coinId: string, days: number = 7): Promise<number[][]> {
    const cacheKey = `history-${coinId}-${days}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.apiUrl}/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days,
        },
      });

      this.setCache(cacheKey, response.data.prices);
      return response.data.prices;
    } catch (error) {
      this.logger.error(`Failed to fetch price history for ${coinId}:`, error.message);
      return [];
    }
  }

  // Cache helpers
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}



