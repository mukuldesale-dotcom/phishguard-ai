'use client';

// Progress Tracking page - Log and visualize fitness progress over time
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { TrendingUp, Plus, Scale, Activity, Camera } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';

// Mock progress data for visualization
const MOCK_WEIGHT_DATA = [
  { date: 'Jan 1', weight: 85.5 },
  { date: 'Jan 8', weight: 84.8 },
  { date: 'Jan 15', weight: 84.1 },
  { date: 'Jan 22', weight: 83.6 },
  { date: 'Feb 1', weight: 83.0 },
  { date: 'Feb 8', weight: 82.5 },
  { date: 'Feb 15', weight: 82.1 },
  { date: 'Feb 22', weight: 81.8 },
  { date: 'Mar 1', weight: 81.2 },
  { date: 'Mar 8', weight: 80.9 },
  { date: 'Mar 15', weight: 80.5 },
  { date: 'Mar 22', weight: 80.1 },
];

const MOCK_MEASUREMENTS_DATA = [
  { date: 'Jan', chest: 105, waist: 92, hips: 102 },
  { date: 'Feb', chest: 103, waist: 89, hips: 100 },
  { date: 'Mar', chest: 101, waist: 87, hips: 98 },
];

// Progress log form types
interface ProgressForm {
  weight: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  notes?: string;
  mood: string;
}

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm shadow-xl">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.value}{p.name === 'weight' ? 'kg' : 'cm'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<'weight' | 'measurements'>('weight');
  const [showLogForm, setShowLogForm] = useState(false);
  const [loggedEntries, setLoggedEntries] = useState<any[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProgressForm>({
    defaultValues: { mood: 'good' },
  });

  const onSubmit = (data: ProgressForm) => {
    const entry = {
      ...data,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      id: Date.now().toString(),
    };
    setLoggedEntries(prev => [entry, ...prev]);
    reset();
    setShowLogForm(false);
  };

  // Calculate stats from mock data
  const latestWeight = MOCK_WEIGHT_DATA[MOCK_WEIGHT_DATA.length - 1].weight;
  const startWeight = MOCK_WEIGHT_DATA[0].weight;
  const weightChange = Math.round((latestWeight - startWeight) * 10) / 10;

  return (
    <div className="pt-20 min-h-screen">
      {/* Page Header */}
      <section className="py-16 border-b border-gray-800 bg-gradient-to-b from-amber-950/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-4">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm">Progress Tracker</span>
              </div>
              <h1 className="section-title text-left">Your Progress</h1>
              <p className="text-gray-400">Track your transformation journey with detailed analytics</p>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="btn-gold flex items-center gap-2 self-start md:self-center"
              onClick={() => setShowLogForm(!showLogForm)}
            >
              <Plus className="w-5 h-5" />
              Log Progress
            </motion.button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Log Progress Form */}
        {showLogForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium mb-8 border-amber-500/30"
          >
            <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              Log Today&apos;s Progress
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Weight (kg) *</label>
                <input
                  {...register('weight', { required: true, min: 20, max: 500 })}
                  type="number"
                  step="0.1"
                  placeholder="e.g. 80.5"
                  className="input-gold"
                />
                {errors.weight && <p className="text-red-400 text-xs mt-1">Valid weight is required</p>}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Chest (cm)</label>
                <input
                  {...register('chest')}
                  type="number"
                  placeholder="e.g. 100"
                  className="input-gold"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Waist (cm)</label>
                <input
                  {...register('waist')}
                  type="number"
                  placeholder="e.g. 85"
                  className="input-gold"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Arms (cm)</label>
                <input
                  {...register('arms')}
                  type="number"
                  placeholder="e.g. 38"
                  className="input-gold"
                />
              </div>

              {/* Mood selector */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Today&apos;s Mood</label>
                <div className="flex gap-3">
                  {[
                    { value: 'excellent', emoji: '😄' },
                    { value: 'good', emoji: '😊' },
                    { value: 'neutral', emoji: '😐' },
                    { value: 'bad', emoji: '😔' },
                    { value: 'terrible', emoji: '😫' },
                  ].map((m) => (
                    <label key={m.value} className="flex flex-col items-center gap-1 cursor-pointer">
                      <input type="radio" value={m.value} {...register('mood')} className="hidden" />
                      <span className="text-2xl hover:scale-125 transition-transform">{m.emoji}</span>
                      <span className="text-xs text-gray-400 capitalize">{m.value}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Notes</label>
                <textarea
                  {...register('notes')}
                  placeholder="How was your workout? Any observations..."
                  rows={3}
                  className="input-gold resize-none"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="btn-gold flex-1">
                  Save Progress
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  className="btn-outline-gold flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              icon: Scale,
              label: 'Current Weight',
              value: `${latestWeight}kg`,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
            },
            {
              icon: TrendingUp,
              label: 'Weight Change',
              value: `${weightChange > 0 ? '+' : ''}${weightChange}kg`,
              color: weightChange < 0 ? 'text-green-400' : 'text-red-400',
              bg: weightChange < 0 ? 'bg-green-500/10' : 'bg-red-500/10',
            },
            {
              icon: Activity,
              label: 'Entries Logged',
              value: `${MOCK_WEIGHT_DATA.length + loggedEntries.length}`,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
            {
              icon: Camera,
              label: 'Photos Taken',
              value: '8',
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
            },
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

        {/* Charts Section */}
        <div className="card-premium mb-8">
          {/* Chart Tab Selector */}
          <div className="flex gap-3 mb-8">
            {[
              { key: 'weight', label: 'Weight Trend' },
              { key: 'measurements', label: 'Measurements' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-400 hover:text-white bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Weight chart */}
          {activeTab === 'weight' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-white font-semibold mb-4">Weight Progress (kg)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={MOCK_WEIGHT_DATA} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fill="url(#weightGradient)"
                    dot={{ fill: '#f59e0b', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Measurements chart */}
          {activeTab === 'measurements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-white font-semibold mb-4">Body Measurements (cm)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={MOCK_MEASUREMENTS_DATA} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="chest" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="chest" />
                  <Line type="monotone" dataKey="waist" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4 }} name="waist" />
                  <Line type="monotone" dataKey="hips" stroke="#34d399" strokeWidth={2} dot={{ r: 4 }} name="hips" />
                </LineChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex gap-6 mt-4 justify-center">
                {[{ color: '#f59e0b', label: 'Chest' }, { color: '#60a5fa', label: 'Waist' }, { color: '#34d399', label: 'Hips' }].map(l => (
                  <div key={l.label} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-4 h-0.5" style={{ backgroundColor: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Recent logged entries */}
        {loggedEntries.length > 0 && (
          <div className="card-premium">
            <h3 className="text-white font-bold text-lg mb-4">Recently Logged</h3>
            <div className="space-y-3">
              {loggedEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4">
                  <div>
                    <div className="text-white font-medium">{entry.date}</div>
                    <div className="text-gray-400 text-sm">
                      Weight: {entry.weight}kg
                      {entry.chest && ` · Chest: ${entry.chest}cm`}
                      {entry.waist && ` · Waist: ${entry.waist}cm`}
                    </div>
                    {entry.notes && <div className="text-gray-500 text-xs mt-1">{entry.notes}</div>}
                  </div>
                  <div className="text-2xl">{
                    entry.mood === 'excellent' ? '😄' :
                    entry.mood === 'good' ? '😊' :
                    entry.mood === 'neutral' ? '😐' :
                    entry.mood === 'bad' ? '😔' : '😫'
                  }</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
