'use client';

/**
 * ==============================================
 * VARLIXO - HOME PAGE
 * ==============================================
 * Premium landing page with hero, features, and CTA sections.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Check,
  Star,
  BarChart3,
  Lock,
  Globe,
  Wallet,
  PieChart,
} from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Button from './components/ui/Button';
import { Card } from './components/ui/Card';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// Stats data
const stats = [
  { value: '$150M+', label: 'Total Invested' },
  { value: '50K+', label: 'Active Investors' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];

// Features data
const features = [
  {
    icon: TrendingUp,
    title: 'High Returns',
    description: 'Earn up to 15% monthly returns with our expertly managed investment portfolios.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: '256-bit encryption, 2FA, and cold storage protect your assets around the clock.',
  },
  {
    icon: Zap,
    title: 'Instant Withdrawals',
    description: 'Access your funds anytime with our lightning-fast withdrawal processing.',
  },
  {
    icon: Users,
    title: 'Referral Rewards',
    description: 'Earn 5% commission on every investment made by users you refer.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track your portfolio performance with live charts and detailed insights.',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Invest from anywhere in the world with multi-currency support.',
  },
];

// Investment plans preview
const plans = [
  {
    name: 'Starter',
    minInvestment: 100,
    maxInvestment: 4999,
    dailyReturn: 1.5,
    duration: 30,
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Growth',
    minInvestment: 5000,
    maxInvestment: 24999,
    dailyReturn: 2.0,
    duration: 45,
    color: 'from-primary-500 to-primary-600',
    popular: true,
  },
  {
    name: 'Premium',
    minInvestment: 25000,
    maxInvestment: 100000,
    dailyReturn: 2.5,
    duration: 60,
    color: 'from-purple-500 to-purple-600',
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium">
                <Star size={16} className="fill-current" />
                Trusted by 50,000+ investors worldwide
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Invest Smarter.{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Grow Faster.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              Join the next generation of intelligent investors. Secure, automated, and designed to maximize your returns.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/auth/register">
                <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                  Start Investing Now
                </Button>
              </Link>
              <Link href="/plans">
                <Button variant="secondary" size="lg">
                  View Investment Plans
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-dark-700"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Why Choose Varlixo?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 max-w-2xl mx-auto">
              Experience the difference with our cutting-edge investment platform designed for modern investors.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card variant="hover" className="h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center mb-6">
                    <feature.icon size={28} className="text-primary-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Investment Plans Preview */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Investment Plans
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your investment goals. All plans include daily profit distribution.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card
                  className={`relative h-full ${plan.popular ? 'border-primary-500/50' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-primary-500 text-white text-sm font-semibold rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className={`w-full h-2 rounded-t-2xl bg-gradient-to-r ${plan.color} -mt-6 -mx-6 mb-6`} style={{ width: 'calc(100% + 3rem)' }} />
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.dailyReturn}%</span>
                    <span className="text-gray-400"> /day</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-gray-300">
                      <Check size={18} className="text-primary-500" />
                      ${plan.minInvestment.toLocaleString()} - ${plan.maxInvestment.toLocaleString()}
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <Check size={18} className="text-primary-500" />
                      {plan.duration} days duration
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <Check size={18} className="text-primary-500" />
                      Daily profit distribution
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <Check size={18} className="text-primary-500" />
                      Principal returned at maturity
                    </li>
                  </ul>
                  <Link href="/auth/register">
                    <Button
                      variant={plan.popular ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Link href="/plans">
              <Button variant="ghost" rightIcon={<ArrowRight size={18} />}>
                View All Plans
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary-500/10 to-purple-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Start Your Investment Journey?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 mb-10"
            >
              Join thousands of investors who are already growing their wealth with Varlixo.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/auth/register">
                <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                  Create Free Account
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
