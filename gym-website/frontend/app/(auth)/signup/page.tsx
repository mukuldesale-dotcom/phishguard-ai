'use client';

// Signup page - New user registration with profile setup
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus, Dumbbell, ChevronRight, ChevronLeft } from 'lucide-react';
import { authAPI, SignupData } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';

// Multi-step form data
interface SignupForm extends SignupData {
  confirmPassword: string;
}

// Step 1 fields
type Step1 = { name: string; email: string; password: string; confirmPassword: string };
// Step 2 fields
type Step2 = { age: number; height: number; weight: number; gender: string };
// Step 3 fields
type Step3 = { goal: string; activityLevel: string };

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();

  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<SignupForm>({
    defaultValues: { gender: 'male', goal: 'maintenance', activityLevel: 'moderately_active' },
  });

  const password = watch('password');

  // Proceed to next step with validation
  const nextStep = async () => {
    const fields = step === 1
      ? ['name', 'email', 'password', 'confirmPassword'] as const
      : ['age', 'height', 'weight', 'gender'] as const;

    const isValid = await trigger(fields);
    if (isValid) setStep(step + 1);
  };

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { confirmPassword, ...signupData } = data;
      const response = await authAPI.signup(signupData);
      const { user, accessToken, refreshToken } = response.data.data;

      setUser(user);
      setTokens(accessToken, refreshToken);
      router.push('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            s === step ? 'bg-amber-500 text-black scale-110'
            : s < step ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
            : 'bg-gray-800 text-gray-500'
          }`}>
            {s < step ? '✓' : s}
          </div>
          {s < 3 && <div className={`w-12 h-0.5 ${s < step ? 'bg-amber-500/50' : 'bg-gray-800'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-black text-gradient-gold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              GymPro
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Start Your Journey</h1>
          <p className="text-gray-400">Create your free account in 3 easy steps</p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <StepIndicator />

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm"
            >
              {errorMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* STEP 1: Account Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h2 className="text-white font-bold text-xl mb-6">Account Details</h2>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
                  <input
                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                    type="text"
                    placeholder="John Doe"
                    className="input-gold"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                    })}
                    type="email"
                    placeholder="you@example.com"
                    className="input-gold"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Min 8 characters' },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Must include uppercase, lowercase, and number',
                        },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 chars, uppercase + number"
                      className="input-gold pr-12"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Confirm Password</label>
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    type="password"
                    placeholder="Repeat password"
                    className="input-gold"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button type="button" onClick={nextStep} className="btn-gold w-full py-3 flex items-center justify-center gap-2 mt-2">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Body Stats */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h2 className="text-white font-bold text-xl mb-6">Your Body Stats</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Age</label>
                    <input {...register('age', { required: true, min: 13, max: 120 })} type="number" placeholder="25" className="input-gold" />
                    {errors.age && <p className="text-red-400 text-xs mt-1">Valid age required</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Gender</label>
                    <select {...register('gender')} className="input-gold">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Height (cm)</label>
                    <input {...register('height', { min: 50, max: 300 })} type="number" placeholder="175" className="input-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Weight (kg)</label>
                    <input {...register('weight', { min: 20, max: 500 })} type="number" placeholder="75" className="input-gold" />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setStep(1)} className="btn-outline-gold flex items-center gap-1 flex-1 justify-center py-3">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="btn-gold flex items-center gap-1 flex-1 justify-center py-3">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Fitness Goals */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h2 className="text-white font-bold text-xl mb-6">Your Fitness Goal</h2>

                <div>
                  <label className="block text-gray-400 text-sm mb-3">What&apos;s your primary goal?</label>
                  <div className="space-y-2">
                    {[
                      { value: 'lose_weight', label: 'Lose Weight', emoji: '🔥' },
                      { value: 'gain_muscle', label: 'Gain Muscle', emoji: '💪' },
                      { value: 'maintenance', label: 'Stay in Shape', emoji: '⚖️' },
                    ].map((g) => (
                      <label key={g.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        watch('goal') === g.value ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 hover:border-gray-600'
                      }`}>
                        <input type="radio" value={g.value} {...register('goal')} className="hidden" />
                        <span className="text-xl">{g.emoji}</span>
                        <span className={`font-medium ${watch('goal') === g.value ? 'text-amber-400' : 'text-gray-300'}`}>{g.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Activity Level</label>
                  <select {...register('activityLevel')} className="input-gold">
                    <option value="sedentary">Sedentary — Little exercise</option>
                    <option value="lightly_active">Lightly Active — 1-3x/week</option>
                    <option value="moderately_active">Moderately Active — 3-5x/week</option>
                    <option value="very_active">Very Active — 6-7x/week</option>
                    <option value="extremely_active">Extremely Active — Physical job</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="btn-outline-gold flex items-center gap-1 flex-1 justify-center py-3">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <motion.button
                    type="submit"
                    className="btn-gold flex items-center gap-2 flex-1 justify-center py-3"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Creating...</>
                    ) : (
                      <><UserPlus className="w-4 h-4" /> Create Account</>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
