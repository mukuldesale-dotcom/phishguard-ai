'use client';

// User Dashboard - Personal stats, saved workouts, and quick actions
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Dumbbell, Utensils, TrendingUp, Settings,
  ChevronRight, Zap, Target, Award, Calendar
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

// Mock dashboard data (in production, this would come from API)
const MOCK_STATS = {
  workoutsCompleted: 24,
  currentStreak: 7,
  caloriesBurned: 12450,
  weightLost: 3.2,
};

const MOCK_RECENT_WORKOUTS = [
  { id: '1', name: 'Chest & Triceps', day: 'Monday', date: '2 days ago', duration: 60, calories: 450 },
  { id: '2', name: 'Back & Biceps', day: 'Tuesday', date: '3 days ago', duration: 65, calories: 480 },
  { id: '3', name: 'Leg Day', day: 'Wednesday', date: '4 days ago', duration: 70, calories: 550 },
];

const MOCK_ACHIEVEMENTS = [
  { id: '1', title: '7-Day Streak', emoji: '🔥', earned: true },
  { id: '2', title: 'First Workout', emoji: '💪', earned: true },
  { id: '3', title: '10kg Lost', emoji: '⚡', earned: false },
  { id: '4', title: '50 Workouts', emoji: '🏆', earned: false },
];

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-2xl font-black text-black">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                Welcome back, <span className="text-gradient-gold">{user?.name?.split(' ')[0]}</span>!
              </h1>
              <p className="text-gray-400">Keep pushing — you&apos;re making great progress 💪</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Dumbbell, label: 'Workouts Done', value: MOCK_STATS.workoutsCompleted, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: Zap, label: 'Day Streak', value: MOCK_STATS.currentStreak, color: 'text-red-400', bg: 'bg-red-500/10' },
            { icon: Target, label: 'Calories Burned', value: MOCK_STATS.caloriesBurned.toLocaleString(), color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: TrendingUp, label: 'Weight Change', value: `-${MOCK_STATS.weightLost}kg`, color: 'text-green-400', bg: 'bg-green-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium"
            >
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity & Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Workouts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-premium"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  Recent Workouts
                </h2>
                <Link href="/workouts" className="text-amber-400 text-sm hover:text-amber-300 flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {MOCK_RECENT_WORKOUTS.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{workout.name}</div>
                        <div className="text-gray-400 text-xs">{workout.day} · {workout.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm font-semibold">{workout.duration} min</div>
                      <div className="text-gray-400 text-xs">{workout.calories} cal</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  Profile
                </h2>
                <button className="text-amber-400 text-sm hover:text-amber-300 flex items-center gap-1">
                  <Settings className="w-4 h-4" /> Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Name', value: user?.name || '—' },
                  { label: 'Email', value: user?.email || '—' },
                  { label: 'Goal', value: user?.goal?.replace('_', ' ') || 'Not set' },
                  { label: 'Activity Level', value: user?.activityLevel?.replace('_', ' ') || 'Not set' },
                  { label: 'Weight', value: user?.weight ? `${user.weight}kg` : 'Not set' },
                  { label: 'Height', value: user?.height ? `${user.height}cm` : 'Not set' },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-400 text-xs">{item.label}</div>
                    <div className="text-white font-medium text-sm capitalize">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions & Achievements */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card-premium"
            >
              <h2 className="text-white font-bold text-lg mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { icon: Dumbbell, label: 'Browse Workouts', href: '/workouts', color: 'text-amber-400' },
                  { icon: Utensils, label: 'View Diet Plans', href: '/diet', color: 'text-green-400' },
                  { icon: TrendingUp, label: 'Log Progress', href: '/progress', color: 'text-blue-400' },
                  { icon: Target, label: 'Calculate Calories', href: '/calculator', color: 'text-purple-400' },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{action.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium"
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="text-white font-bold text-lg">Achievements</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {MOCK_ACHIEVEMENTS.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-xl text-center border transition-all ${
                      achievement.earned
                        ? 'border-amber-500/40 bg-amber-500/10'
                        : 'border-gray-700 opacity-40'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.emoji}</div>
                    <div className={`text-xs font-medium ${achievement.earned ? 'text-amber-400' : 'text-gray-400'}`}>
                      {achievement.title}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Today's Plan Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-amber-900/30 to-transparent border border-amber-500/30 rounded-xl p-5"
            >
              <h2 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">Today&apos;s Workout</h2>
              <h3 className="text-white font-bold text-xl mb-2">Full Body HIIT Blast</h3>
              <p className="text-gray-400 text-sm mb-4">45 min · Advanced · 600 cal</p>
              <Link href="/workouts">
                <button className="btn-gold w-full py-2 text-sm">Start Workout</button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
