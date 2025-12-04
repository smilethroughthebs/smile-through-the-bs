'use client';

/**
 * ==============================================
 * VARLIXO - INVESTMENT PLANS PAGE
 * ==============================================
 * Public page showing all available investment plans
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  Shield,
  ArrowRight,
  Check,
  Zap,
  Crown,
  Gem,
} from 'lucide-react';
import Button from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { investmentAPI } from '@/app/lib/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// Default plans if API fails
const defaultPlans = [
  {
    _id: '1',
    name: 'Starter',
    slug: 'starter',
    description: 'Perfect for beginners looking to start their investment journey',
    minAmount: 100,
    maxAmount: 999,
    dailyROI: 1.5,
    duration: 30,
    totalROI: 45,
    features: ['Daily returns', '24/7 Support', 'Instant deposits', 'Auto-compounding'],
    isPopular: false,
    icon: 'Zap',
    color: 'from-blue-500 to-blue-600',
  },
  {
    _id: '2',
    name: 'Professional',
    slug: 'professional',
    description: 'For serious investors seeking higher returns',
    minAmount: 1000,
    maxAmount: 9999,
    dailyROI: 2.5,
    duration: 45,
    totalROI: 112.5,
    features: ['Higher daily returns', 'Priority support', 'Instant withdrawals', 'Dedicated manager', 'Weekly reports'],
    isPopular: true,
    icon: 'Crown',
    color: 'from-primary-500 to-primary-600',
  },
  {
    _id: '3',
    name: 'Elite',
    slug: 'elite',
    description: 'Premium plan for high-net-worth investors',
    minAmount: 10000,
    maxAmount: 100000,
    dailyROI: 3.5,
    duration: 60,
    totalROI: 210,
    features: ['Maximum returns', 'VIP support', 'Instant everything', 'Personal advisor', 'Daily reports', 'Exclusive events'],
    isPopular: false,
    icon: 'Gem',
    color: 'from-purple-500 to-purple-600',
  },
];

const iconMap: { [key: string]: any } = {
  Zap: Zap,
  Crown: Crown,
  Gem: Gem,
  Star: Star,
};

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>(defaultPlans);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await investmentAPI.getPlans();
      const data = response.data.data?.data || response.data.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setPlans(data);
      }
    } catch (error) {
      console.log('Using default plans');
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Star;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 bg-primary-500/10 text-primary-400 rounded-full text-sm font-medium mb-6">
              Investment Plans
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your <span className="text-primary-500">Investment Plan</span>
            </h1>
            <p className="text-xl text-gray-400">
              Select a plan that fits your investment goals. All plans include daily returns,
              instant deposits, and 24/7 support.
            </p>
          </motion.div>

          {/* Plans Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => {
              const Icon = getIcon(plan.icon || 'Star');
              return (
                <motion.div
                  key={plan._id || index}
                  variants={fadeInUp}
                  className={`relative ${plan.isPopular ? 'md:-mt-4 md:mb-4' : ''}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-sm font-medium rounded-full z-10">
                      Most Popular
                    </div>
                  )}
                  <Card
                    className={`h-full ${
                      plan.isPopular
                        ? 'border-primary-500/50 bg-gradient-to-b from-primary-500/10 to-transparent'
                        : ''
                    }`}
                  >
                    <div className="p-8">
                      {/* Plan Header */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color || 'from-primary-500 to-primary-600'} flex items-center justify-center mb-6`}>
                        <Icon className="text-white" size={28} />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-400 mb-6">{plan.description}</p>

                      {/* ROI Display */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-white">{plan.dailyROI}%</span>
                          <span className="text-gray-400">/ day</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Up to {plan.totalROI}% total return
                        </p>
                      </div>

                      {/* Plan Details */}
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Min Investment</span>
                          <span className="text-white font-medium">${plan.minAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Max Investment</span>
                          <span className="text-white font-medium">${plan.maxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Duration</span>
                          <span className="text-white font-medium">{plan.duration} days</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-8">
                        {(plan.features || []).map((feature: string, i: number) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                              <Check size={12} className="text-green-500" />
                            </div>
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Link href="/auth/register">
                        <Button
                          className={`w-full ${
                            plan.isPopular
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600'
                              : ''
                          }`}
                          variant={plan.isPopular ? 'primary' : 'outline'}
                        >
                          Get Started
                          <ArrowRight size={18} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Invest With Us?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We provide industry-leading security, returns, and customer service.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Bank-Grade Security',
                description: 'Your investments are protected with enterprise-level security',
              },
              {
                icon: TrendingUp,
                title: 'Consistent Returns',
                description: 'Daily returns deposited directly to your account',
              },
              {
                icon: Clock,
                title: 'Instant Withdrawals',
                description: 'Access your funds anytime with instant processing',
              },
              {
                icon: DollarSign,
                title: 'Low Minimums',
                description: 'Start investing with as little as $100',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto bg-dark-700 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="text-primary-500" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Growing Your Wealth?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of investors already earning with Varlixo.
          </p>
          <Link href="/auth/register">
            <Button size="lg">
              Create Free Account
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}


