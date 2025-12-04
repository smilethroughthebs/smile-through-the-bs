'use client';

/**
 * ==============================================
 * VARLIXO - PROFILE SETTINGS PAGE
 * ==============================================
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Mail,
  Phone,
  Globe,
  Lock,
  Shield,
  Bell,
  Sun,
  Moon,
  Save,
  Camera,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import { useAuthStore } from '@/app/lib/store';
import { authAPI } from '@/app/lib/api';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  country: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: '',
      country: '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      // In production, call API to update profile
      updateUser(data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      resetPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-500/10 text-primary-500'
                : 'text-gray-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Avatar Section */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-3xl font-bold text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center border-2 border-dark-900 hover:bg-dark-600 transition-colors">
                    <Camera size={14} className="text-gray-400" />
                  </button>
                </div>
                <div>
                  <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Member since {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="p-6 pt-0 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  leftIcon={<User size={18} />}
                  error={profileErrors.firstName?.message}
                  {...registerProfile('firstName')}
                />
                <Input
                  label="Last Name"
                  error={profileErrors.lastName?.message}
                  {...registerProfile('lastName')}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={user?.email || ''}
                disabled
                leftIcon={<Mail size={18} />}
                hint="Email cannot be changed"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  leftIcon={<Phone size={18} />}
                  error={profileErrors.phone?.message}
                  {...registerProfile('phone')}
                />
                <Input
                  label="Country"
                  placeholder="United States"
                  leftIcon={<Globe size={18} />}
                  error={profileErrors.country?.message}
                  {...registerProfile('country')}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={isLoading}>
                  <Save size={18} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="p-6 pt-0 space-y-4">
              <Input
                label="Current Password"
                type="password"
                leftIcon={<Lock size={18} />}
                error={passwordErrors.currentPassword?.message}
                {...registerPassword('currentPassword')}
              />
              <Input
                label="New Password"
                type="password"
                leftIcon={<Lock size={18} />}
                error={passwordErrors.newPassword?.message}
                hint="Min 8 chars with uppercase, lowercase, number & symbol"
                {...registerPassword('newPassword')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                leftIcon={<Lock size={18} />}
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword')}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={isLoading}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Two-Factor Auth */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  user?.twoFactorEnabled
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <Button variant="outline" className="mt-4">
                <Shield size={18} className="mr-2" />
                {user?.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
              </Button>
            </div>
          </Card>

          {/* Active Sessions */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Globe size={20} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Current Session</p>
                      <p className="text-gray-500 text-sm">Windows • Chrome • Active now</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <div className="p-6 pt-0 space-y-6">
              {[
                { id: 'email', label: 'Email Notifications', description: 'Receive updates via email', enabled: true },
                { id: 'deposits', label: 'Deposit Alerts', description: 'Get notified when deposits are confirmed', enabled: true },
                { id: 'withdrawals', label: 'Withdrawal Alerts', description: 'Get notified about withdrawal status', enabled: true },
                { id: 'investments', label: 'Investment Updates', description: 'Receive profit and maturity notifications', enabled: true },
                { id: 'security', label: 'Security Alerts', description: 'Important security notifications', enabled: true },
                { id: 'marketing', label: 'Marketing Updates', description: 'News and promotional content', enabled: false },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={item.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 peer-checked:after:bg-white"></div>
                  </label>
                </div>
              ))}

              <div className="flex justify-end pt-4 border-t border-dark-700">
                <Button>Save Preferences</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}


