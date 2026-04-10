'use client';

// Login page with JWT authentication
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, Dumbbell } from 'lucide-react';
import { authAPI, LoginData } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await authAPI.login(data);
      const { user, accessToken, refreshToken } = response.data.data;

      // Store auth state
      setUser(user);
      setTokens(accessToken, refreshToken);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-black text-gradient-gold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              GymPro
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to continue your fitness journey</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm"
            >
              {errorMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
                })}
                type="email"
                placeholder="you@example.com"
                className="input-gold"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 text-sm font-medium">Password</label>
                <Link href="#" className="text-amber-400 text-xs hover:text-amber-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="input-gold pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Demo notice */}
          <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-amber-400 text-xs text-center">
              💡 Demo: Start the backend server and create an account first.
            </p>
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            Create one free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
