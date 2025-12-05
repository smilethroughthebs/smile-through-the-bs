'use client';

/**
 * ==============================================
 * VARLIXO - REGISTER PAGE
 * ==============================================
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone, ArrowRight, Check, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import { Card } from '@/app/components/ui/Card';
import PasswordStrength from '@/app/components/ui/PasswordStrength';
import { authAPI, referralAPI } from '@/app/lib/api';

// Validation schema
const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [referrer, setReferrer] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeTerms: false,
    },
  });

  // Check for referral code in URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setValue('referralCode', ref);
      validateReferralCode(ref);
    }
  }, [searchParams, setValue]);

  const validateReferralCode = async (code: string) => {
    try {
      const response = await referralAPI.validateCode(code);
      if (response.data.data.valid) {
        setReferrer(response.data.data.referrer.firstName);
      }
    } catch (error) {
      // Invalid code - silently ignore
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await authAPI.register(data);
      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/auth/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-dark-800 to-dark-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Your Investment Journey
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Join Varlixo and gain access to premium investment opportunities with industry-leading returns.
            </p>

            <div className="space-y-4">
              {[
                'Up to 15% monthly returns',
                'Bank-grade security',
                'Instant withdrawals',
                '24/7 customer support',
                'Referral rewards program',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <Check size={14} className="text-primary-500" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold text-white">Varlixo</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 mb-8">
            Start your investment journey in minutes
          </p>

          {/* Referral Banner */}
          {referrer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Gift className="text-primary-500" size={24} />
                <div>
                  <p className="text-white font-medium">Referral Bonus Active!</p>
                  <p className="text-sm text-gray-400">
                    Referred by <span className="text-primary-400">{referrer}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                leftIcon={<User size={20} />}
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              leftIcon={<Mail size={20} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone (Optional)"
              type="tel"
              placeholder="+1 234 567 8900"
              leftIcon={<Phone size={20} />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div className="space-y-3">
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                leftIcon={<Lock size={20} />}
                error={errors.password?.message}
                {...register('password', {
                  onChange: (e) => setPasswordValue(e.target.value),
                })}
              />
              <PasswordStrength password={passwordValue} />
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              leftIcon={<Lock size={20} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Input
              label="Referral Code (Optional)"
              placeholder="Enter referral code"
              leftIcon={<Gift size={20} />}
              error={errors.referralCode?.message}
              {...register('referralCode')}
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                {...register('agreeTerms')}
              />
              <span className="text-sm text-gray-400">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-500 hover:text-primary-400">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-500 hover:text-primary-400">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-sm text-error">{errors.agreeTerms.message}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              rightIcon={!isLoading && <ArrowRight size={20} />}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-primary-500 hover:text-primary-400 font-medium"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
