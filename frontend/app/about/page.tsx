'use client';

/**
 * ==============================================
 * VARLIXO - ABOUT PAGE
 * ==============================================
 */

import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Globe,
  TrendingUp,
  Award,
  Clock,
  Target,
  Zap,
} from 'lucide-react';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { Card } from '@/app/components/ui/Card';

const stats = [
  { value: '$50M+', label: 'Total Investments' },
  { value: '25,000+', label: 'Active Investors' },
  { value: '99.9%', label: 'Uptime' },
  { value: '150+', label: 'Countries Served' },
];

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'Your investments are protected with enterprise-grade security and cold storage solutions.',
  },
  {
    icon: Users,
    title: 'Client Focused',
    description: 'Every decision we make is centered around providing the best experience for our investors.',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Serving investors from over 150 countries with 24/7 support in multiple languages.',
  },
  {
    icon: TrendingUp,
    title: 'Consistent Returns',
    description: 'Our advanced trading strategies deliver consistent daily returns to all our investors.',
  },
];

const timeline = [
  { year: '2021', title: 'Founded', description: 'Varlixo was founded with a mission to democratize investing.' },
  { year: '2022', title: 'Global Expansion', description: 'Expanded operations to serve investors in over 100 countries.' },
  { year: '2023', title: '$25M Milestone', description: 'Reached $25 million in total investments under management.' },
  { year: '2024', title: 'Platform 2.0', description: 'Launched our next-generation investment platform with enhanced features.' },
];

const team = [
  { name: 'Alexander Chen', role: 'CEO & Founder', image: '👨‍💼' },
  { name: 'Sarah Mitchell', role: 'Chief Investment Officer', image: '👩‍💼' },
  { name: 'David Park', role: 'Head of Security', image: '👨‍💻' },
  { name: 'Emma Williams', role: 'Customer Success Lead', image: '👩‍💻' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-primary-500/10 text-primary-400 rounded-full text-sm font-medium mb-6">
              About Varlixo
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Building the Future of <span className="text-primary-500">Digital Investing</span>
            </h1>
            <p className="text-xl text-gray-400">
              We're on a mission to make professional investment strategies accessible to everyone,
              everywhere. Join thousands of investors growing their wealth with Varlixo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Varlixo was founded in 2021 with a simple yet powerful vision: to democratize 
                  access to professional investment strategies that were previously only available 
                  to institutional investors and the ultra-wealthy.
                </p>
                <p>
                  Our team of experienced traders, financial engineers, and technology experts 
                  came together to build a platform that combines cutting-edge technology with 
                  proven investment strategies, making it possible for anyone to grow their wealth.
                </p>
                <p>
                  Today, we serve over 25,000 active investors across 150+ countries, managing 
                  more than $50 million in investments. Our commitment to security, transparency, 
                  and consistent returns has made us one of the fastest-growing investment 
                  platforms in the industry.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Target, label: 'Mission Driven' },
                { icon: Award, label: 'Award Winning' },
                { icon: Clock, label: '24/7 Support' },
                { icon: Zap, label: 'Fast Execution' },
              ].map((item, index) => (
                <Card key={index} className="p-6 text-center">
                  <item.icon className="text-primary-500 mx-auto mb-3" size={32} />
                  <p className="text-white font-medium">{item.label}</p>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              These core values guide everything we do at Varlixo
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full p-6">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="text-primary-500" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-dark-700 hidden md:block" />
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-8 mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                  <Card className="p-6 inline-block">
                    <div className="text-primary-500 font-bold text-lg mb-1">{item.year}</div>
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </Card>
                </div>
                <div className="hidden md:flex w-4 h-4 bg-primary-500 rounded-full z-10" />
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Leadership Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Meet the experts behind Varlixo's success
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-4xl mb-4">
                    {member.image}
                  </div>
                  <h3 className="text-white font-semibold">{member.name}</h3>
                  <p className="text-gray-400 text-sm">{member.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


