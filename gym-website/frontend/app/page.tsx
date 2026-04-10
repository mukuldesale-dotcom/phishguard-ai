'use client';

// Home page - Premium 3D hero section with animated content
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Play, Dumbbell, Zap, Target, Users, Star, ChevronDown } from 'lucide-react';

// Lazy load 3D component for better performance
const Hero3D = dynamic(() => import('@/components/Hero3D'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-950/20 to-black" />,
});

// Feature highlights data
const features = [
  { icon: Dumbbell, title: 'Weekly Workout Plans', description: '7-day structured programs for all fitness levels' },
  { icon: Target, title: 'Smart Nutrition', description: 'Personalized diet plans based on your goals' },
  { icon: Zap, title: 'TDEE Calculator', description: 'Precise calorie and macro calculations' },
  { icon: Users, title: 'Progress Tracking', description: 'Visual charts to monitor your transformation' },
];

// Stats data
const stats = [
  { value: '10,000+', label: 'Active Members' },
  { value: '200+', label: 'Workout Plans' },
  { value: '50+', label: 'Diet Programs' },
  { value: '95%', label: 'Success Rate' },
];

// Testimonials data
const testimonials = [
  {
    name: 'Alex Thompson',
    role: 'Lost 25kg in 6 months',
    content: 'GymPro completely transformed my approach to fitness. The structured workout plans and diet guidance made everything so clear.',
    rating: 5,
    avatar: 'AT',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Gained 8kg of muscle',
    content: 'The muscle gain program is incredible. I finally understand how to eat and train for my goals. Best fitness platform ever!',
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'Marcus Johnson',
    role: 'Marathon Runner',
    content: 'The calorie calculator and progress tracking features have been game-changers for my marathon training preparation.',
    rating: 5,
    avatar: 'MJ',
  },
];

// Animation variants for stagger effects
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background - lazy loaded */}
        <Hero3D />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black pointer-events-none" />

        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-hero opacity-60 pointer-events-none" />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Premium Fitness Platform</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span className="text-white">FORGE YOUR</span>
            <br />
            <span className="text-gradient-gold text-shadow-gold">ULTIMATE BODY</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Premium workout plans, personalized diet programs, and smart fitness tools —
            everything you need to transform your physique.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup">
              <motion.button
                className="btn-gold flex items-center gap-2 text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link href="/workouts">
              <motion.button
                className="btn-outline-gold flex items-center gap-2 text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                View Workouts
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-12 border-t border-gray-800"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-gradient-gold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-amber-400/60" />
        </motion.div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">
              A complete fitness ecosystem designed to maximize your results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-premium text-center group"
              >
                <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA WORKOUT SECTION ==================== */}
      <section className="py-20 bg-gradient-to-r from-amber-900/20 to-black border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                STRUCTURED WEEKLY
                <br />
                <span className="text-gradient-gold">WORKOUT PLANS</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Follow expert-designed programs for every day of the week.
                Filter by difficulty level and find the perfect workout for your fitness journey.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <span
                    key={level}
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${
                      level === 'Beginner' ? 'badge-beginner' :
                      level === 'Intermediate' ? 'badge-intermediate' : 'badge-advanced'
                    }`}
                  >
                    {level}
                  </span>
                ))}
              </div>
              <Link href="/workouts">
                <motion.button
                  className="btn-gold flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Workouts <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { day: 'MON', focus: 'Chest & Triceps', color: 'from-amber-500/20' },
                { day: 'TUE', focus: 'Back & Biceps', color: 'from-amber-600/20' },
                { day: 'WED', focus: 'Leg Day', color: 'from-amber-700/20' },
                { day: 'THU', focus: 'Shoulders & Abs', color: 'from-amber-500/20' },
                { day: 'FRI', focus: 'HIIT Blast', color: 'from-amber-600/20' },
                { day: 'SAT', focus: 'Yoga & Recovery', color: 'from-amber-700/20' },
                { day: 'SUN', focus: 'Active Rest', color: 'from-amber-500/20' },
              ].map((item) => (
                <div
                  key={item.day}
                  className={`bg-gradient-to-br ${item.color} to-transparent border border-gray-800 rounded-xl p-4`}
                >
                  <div className="text-amber-400 font-black text-lg">{item.day}</div>
                  <div className="text-white text-sm font-medium mt-1">{item.focus}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== DIET SECTION PREVIEW ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Smart Nutrition Plans</h2>
            <p className="section-subtitle">
              Evidence-based diet programs tailored to your specific fitness goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Weight Loss',
                calories: '1,800 cal/day',
                description: 'Strategic calorie deficit with high protein to preserve lean muscle while burning fat.',
                emoji: '🔥',
                color: 'border-red-500/30',
                badge: 'Most Popular',
              },
              {
                title: 'Muscle Gain',
                calories: '3,200 cal/day',
                description: 'Calorie surplus with optimal protein timing to maximize muscle protein synthesis.',
                emoji: '💪',
                color: 'border-amber-500/30',
                badge: 'Recommended',
              },
              {
                title: 'Maintenance',
                calories: '2,400 cal/day',
                description: 'Balanced macronutrient distribution to maintain weight and support overall health.',
                emoji: '⚖️',
                color: 'border-green-500/30',
                badge: 'Sustainable',
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`card-premium border ${plan.color} relative overflow-hidden`}
              >
                <div className="absolute top-4 right-4">
                  <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full">{plan.badge}</span>
                </div>
                <div className="text-4xl mb-4">{plan.emoji}</div>
                <h3 className="text-white font-bold text-xl mb-1">{plan.title}</h3>
                <div className="text-amber-400 font-semibold mb-3">{plan.calories}</div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{plan.description}</p>
                <Link href="/diet">
                  <button className="btn-outline-gold w-full text-sm py-2">
                    View Plan
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CALCULATOR CTA ==================== */}
      <section className="py-20 bg-gradient-to-b from-transparent to-amber-950/10 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-6">🧮</div>
            <h2 className="section-title">Smart Fitness Calculator</h2>
            <p className="section-subtitle mb-10">
              Enter your stats and instantly get your personalized calorie targets,
              macro breakdown, and diet recommendations.
            </p>
            <Link href="/calculator">
              <motion.button
                className="btn-gold text-lg px-10 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Calculate My Calories
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Real Results, Real People</h2>
            <p className="section-subtitle">
              Join thousands of members who have transformed their bodies with GymPro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="card-premium"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-black text-sm font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-amber-400 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-24 bg-gradient-to-r from-amber-900/30 via-black to-amber-900/30 border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-5xl md:text-6xl font-black text-white mb-6"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              READY TO
              <span className="text-gradient-gold"> TRANSFORM</span>?
            </h2>
            <p className="text-gray-400 text-xl mb-10">
              Join GymPro today and get access to all workout plans, diet programs, and premium features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <motion.button
                  className="btn-gold text-xl px-12 py-5 animate-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Now — It&apos;s Free
                </motion.button>
              </Link>
              <Link href="/calculator">
                <motion.button
                  className="btn-outline-gold text-xl px-12 py-5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Calculate Calories
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
