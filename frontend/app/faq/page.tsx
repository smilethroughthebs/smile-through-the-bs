'use client';

/**
 * ==============================================
 * VARLIXO - FAQ PAGE
 * ==============================================
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import Button from '@/app/components/ui/Button';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Creating an account is simple. Click the "Get Started" button, fill in your details including email and password, verify your email, and you\'re ready to start investing. The whole process takes less than 5 minutes.',
      },
      {
        q: 'What is the minimum investment amount?',
        a: 'Our Starter plan begins at just $100, making it accessible for everyone to start their investment journey. Higher tier plans start at $1,000 and $10,000 respectively.',
      },
      {
        q: 'How do I make my first deposit?',
        a: 'After logging in, go to your Wallet page and click "Deposit". Choose your preferred payment method (cryptocurrency or bank transfer), enter the amount, and follow the instructions. Deposits are typically credited within 24 hours.',
      },
    ],
  },
  {
    category: 'Investments & Returns',
    questions: [
      {
        q: 'How are daily returns calculated?',
        a: 'Daily returns are calculated based on your chosen investment plan\'s ROI percentage. For example, with a 2% daily return on a $1,000 investment, you would earn $20 per day. Returns are automatically credited to your wallet.',
      },
      {
        q: 'When do I receive my returns?',
        a: 'Returns are credited to your wallet daily at midnight UTC. You can track your earnings in real-time from your dashboard.',
      },
      {
        q: 'Can I have multiple active investments?',
        a: 'Yes! You can have multiple investments across different plans simultaneously. This allows you to diversify your portfolio and maximize returns.',
      },
      {
        q: 'What happens when my investment matures?',
        a: 'When your investment reaches its maturity date, the principal amount plus any remaining returns are automatically added to your available balance. You can then withdraw or reinvest.',
      },
    ],
  },
  {
    category: 'Withdrawals & Payments',
    questions: [
      {
        q: 'How do I withdraw my funds?',
        a: 'Go to your Wallet, click "Withdraw", select your withdrawal method, enter the amount and destination details. Withdrawals are processed within 24-48 hours.',
      },
      {
        q: 'What are the withdrawal limits?',
        a: 'Withdrawal limits depend on your account verification status. Verified accounts can withdraw up to $50,000 per day. Complete KYC verification to unlock higher limits.',
      },
      {
        q: 'Are there any withdrawal fees?',
        a: 'We charge a minimal processing fee of 1% for withdrawals. Network fees for cryptocurrency withdrawals are separate and depend on blockchain conditions.',
      },
      {
        q: 'What payment methods do you support?',
        a: 'We support Bitcoin (BTC), Ethereum (ETH), USDT (TRC20/ERC20), and bank wire transfers. More payment options are being added regularly.',
      },
    ],
  },
  {
    category: 'Security & Verification',
    questions: [
      {
        q: 'Is my investment safe?',
        a: 'Your security is our top priority. We use bank-grade encryption, two-factor authentication, and cold storage for digital assets. Our platform undergoes regular security audits.',
      },
      {
        q: 'What is KYC and why is it required?',
        a: 'KYC (Know Your Customer) is an identity verification process required by financial regulations. It helps prevent fraud and ensures a secure platform for all users. Complete KYC to unlock higher limits.',
      },
      {
        q: 'How do I enable two-factor authentication?',
        a: 'Go to Settings > Security, and click "Enable 2FA". You can use an authenticator app like Google Authenticator or receive codes via email.',
      },
    ],
  },
  {
    category: 'Referral Program',
    questions: [
      {
        q: 'How does the referral program work?',
        a: 'Share your unique referral link with friends. When they sign up and make their first investment, you earn a 5% commission on their investment amount. There\'s no limit to how much you can earn!',
      },
      {
        q: 'When do I receive referral bonuses?',
        a: 'Referral bonuses are credited to your wallet immediately after your referral makes their first qualified investment.',
      },
      {
        q: 'Where do I find my referral link?',
        a: 'Your unique referral link is available in the Referrals section of your dashboard. You can copy and share it directly or use the social sharing buttons.',
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked <span className="text-primary-500">Questions</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Find answers to common questions about Varlixo
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-dark-800 border border-dark-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="mb-10"
            >
              <h2 className="text-xl font-bold text-white mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, index) => {
                  const key = `${catIndex}-${index}`;
                  const isOpen = openIndex === key;

                  return (
                    <div
                      key={index}
                      className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                      >
                        <span className="text-white font-medium pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`text-gray-400 flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          size={20}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-6 pb-4 text-gray-400">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 px-4 bg-dark-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <MessageCircle className="text-primary-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
          <p className="text-gray-400 mb-6">
            Our support team is available 24/7 to help you with any questions.
          </p>
          <Link href="/dashboard/support">
            <Button size="lg">Contact Support</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}


