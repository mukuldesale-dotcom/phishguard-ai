'use client';

// Workouts page - Browse and filter weekly workout plans
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Dumbbell, Clock, Flame, Heart } from 'lucide-react';
import Image from 'next/image';

// Static workout data (would normally come from API)
const WORKOUTS_DATA = [
  {
    id: '1',
    name: 'Chest & Triceps Power',
    day: 'Monday',
    difficulty: 'intermediate',
    duration: 60,
    caloriesBurned: 450,
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    category: 'strength',
    exercises: 5,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop',
    description: 'Build a powerful chest and defined triceps with compound movements.',
  },
  {
    id: '2',
    name: 'Back & Biceps Strength',
    day: 'Tuesday',
    difficulty: 'intermediate',
    duration: 65,
    caloriesBurned: 480,
    muscleGroups: ['Back', 'Biceps', 'Rear Deltoids'],
    category: 'strength',
    exercises: 4,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop',
    description: 'Build a wide, thick back and powerful biceps with essential pulling movements.',
  },
  {
    id: '3',
    name: 'Leg Day Domination',
    day: 'Wednesday',
    difficulty: 'intermediate',
    duration: 70,
    caloriesBurned: 550,
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
    category: 'strength',
    exercises: 4,
    imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&auto=format&fit=crop',
    description: 'Never skip leg day! Comprehensive lower body workout for strength and mass.',
  },
  {
    id: '4',
    name: 'Shoulders & Core Circuit',
    day: 'Thursday',
    difficulty: 'intermediate',
    duration: 55,
    caloriesBurned: 400,
    muscleGroups: ['Shoulders', 'Core', 'Traps'],
    category: 'strength',
    exercises: 4,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format&fit=crop',
    description: 'Build boulder shoulders and a rock-solid core with this targeted workout.',
  },
  {
    id: '5',
    name: 'Full Body HIIT Blast',
    day: 'Friday',
    difficulty: 'advanced',
    duration: 45,
    caloriesBurned: 600,
    muscleGroups: ['Full Body'],
    category: 'hiit',
    exercises: 4,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop',
    description: 'High-intensity interval training for maximum calorie burn and conditioning.',
  },
  {
    id: '6',
    name: 'Yoga & Flexibility Flow',
    day: 'Saturday',
    difficulty: 'beginner',
    duration: 45,
    caloriesBurned: 200,
    muscleGroups: ['Full Body', 'Core'],
    category: 'yoga',
    exercises: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop',
    description: 'Improve flexibility, mobility, and recovery with this relaxing yoga session.',
  },
  {
    id: '7',
    name: 'Light Cardio & Core',
    day: 'Sunday',
    difficulty: 'beginner',
    duration: 40,
    caloriesBurned: 300,
    muscleGroups: ['Core', 'Cardiovascular'],
    category: 'cardio',
    exercises: 3,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&auto=format&fit=crop',
    description: 'Active recovery with light cardio and core work to end the week strong.',
  },
  {
    id: '8',
    name: 'Beginner Upper Body',
    day: 'Monday',
    difficulty: 'beginner',
    duration: 40,
    caloriesBurned: 250,
    muscleGroups: ['Chest', 'Shoulders', 'Arms'],
    category: 'strength',
    exercises: 3,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop',
    description: 'Perfect introduction to upper body training. No experience needed!',
  },
];

// Sample exercises for each workout (expanded view)
const SAMPLE_EXERCISES: Record<string, Array<{ name: string; sets: number; reps: string; muscle: string }>> = {
  '1': [
    { name: 'Barbell Bench Press', sets: 4, reps: '8-10', muscle: 'Chest' },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', muscle: 'Upper Chest' },
    { name: 'Cable Flyes', sets: 3, reps: '12-15', muscle: 'Chest' },
    { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', muscle: 'Triceps' },
    { name: 'Skull Crushers', sets: 3, reps: '10-12', muscle: 'Triceps' },
  ],
  '2': [
    { name: 'Deadlifts', sets: 4, reps: '5-6', muscle: 'Back' },
    { name: 'Pull-Ups', sets: 4, reps: '8-12', muscle: 'Lats' },
    { name: 'Barbell Rows', sets: 4, reps: '8-10', muscle: 'Middle Back' },
    { name: 'Barbell Curls', sets: 3, reps: '10-12', muscle: 'Biceps' },
  ],
};

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';
type DayFilter = 'all' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export default function WorkoutsPage() {
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [dayFilter, setDayFilter] = useState<DayFilter>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Filter workouts based on selected filters
  const filteredWorkouts = WORKOUTS_DATA.filter((w) => {
    if (difficulty !== 'all' && w.difficulty !== difficulty) return false;
    if (dayFilter !== 'all' && w.day !== dayFilter) return false;
    if (search && !w.name.toLowerCase().includes(search.toLowerCase()) &&
        !w.muscleGroups.some(m => m.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'badge-beginner';
      case 'advanced': return 'badge-advanced';
      default: return 'badge-intermediate';
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Page Header */}
      <section className="py-16 border-b border-gray-800 bg-gradient-to-b from-amber-950/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <Dumbbell className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm">Weekly Programs</span>
            </div>
            <h1 className="section-title">Workout Plans</h1>
            <p className="section-subtitle">
              Expert-designed programs for every fitness level. Filter by difficulty and find your perfect workout.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search workouts, muscle groups..."
              className="input-gold pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 mr-1" />
            {(['all', 'beginner', 'intermediate', 'advanced'] as DifficultyFilter[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  difficulty === d
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-amber-500/50 hover:text-white'
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Day Filter Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {(['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as DayFilter[]).map((day) => (
            <button
              key={day}
              onClick={() => setDayFilter(day)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dayFilter === day
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600'
              }`}
            >
              {day === 'all' ? 'All Days' : day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="text-gray-400 text-sm mb-6">
          Showing <span className="text-amber-400 font-semibold">{filteredWorkouts.length}</span> workouts
        </div>

        {/* Workout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="card-premium overflow-hidden cursor-pointer"
              onClick={() => setExpandedId(expandedId === workout.id ? null : workout.id)}
            >
              {/* Workout Image */}
              <div className="relative h-48 bg-gray-800 rounded-lg mb-4 overflow-hidden">
                <Image
                  src={workout.imageUrl}
                  alt={workout.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={getDifficultyBadge(workout.difficulty)}>
                    {workout.difficulty}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {workout.day}
                </div>
                {/* Save button */}
                <button
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                  onClick={(e) => { e.stopPropagation(); toggleSave(workout.id); }}
                >
                  <Heart
                    className={`w-4 h-4 ${savedIds.has(workout.id) ? 'fill-amber-400 text-amber-400' : 'text-white'}`}
                  />
                </button>
              </div>

              {/* Workout Info */}
              <h3 className="text-white font-bold text-lg mb-2">{workout.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{workout.description}</p>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {workout.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  {workout.caloriesBurned} cal
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
                  {workout.exercises} exercises
                </span>
              </div>

              {/* Muscle groups */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {workout.muscleGroups.map((m) => (
                  <span key={m} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full border border-gray-700">
                    {m}
                  </span>
                ))}
              </div>

              {/* Expand indicator */}
              <div className="text-amber-400 text-xs mt-2">
                {expandedId === workout.id ? '▲ Hide exercises' : '▼ View exercises'}
              </div>

              {/* Expanded exercise list */}
              {expandedId === workout.id && SAMPLE_EXERCISES[workout.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-800"
                >
                  <h4 className="text-white text-sm font-semibold mb-3">Exercises:</h4>
                  <div className="space-y-2">
                    {SAMPLE_EXERCISES[workout.id].map((ex) => (
                      <div key={ex.name} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                        <div>
                          <div className="text-white text-sm font-medium">{ex.name}</div>
                          <div className="text-gray-400 text-xs">{ex.muscle}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-400 text-sm font-bold">{ex.sets} sets</div>
                          <div className="text-gray-400 text-xs">{ex.reps} reps</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredWorkouts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-xl text-white font-semibold mb-2">No workouts found</h3>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
