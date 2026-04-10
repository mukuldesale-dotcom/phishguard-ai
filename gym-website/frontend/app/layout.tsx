import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

// SEO metadata for the gym website
export const metadata: Metadata = {
  title: {
    default: 'GymPro - Premium Fitness Platform',
    template: '%s | GymPro',
  },
  description:
    'Transform your body with GymPro — Premium workout plans, personalized diet programs, smart fitness calculator, and progress tracking.',
  keywords: [
    'gym',
    'workout',
    'fitness',
    'diet',
    'exercise',
    'health',
    'muscle',
    'weight loss',
    'personal trainer',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gympro.com',
    title: 'GymPro - Premium Fitness Platform',
    description: 'Transform your body with premium workout plans and nutrition guidance.',
    siteName: 'GymPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GymPro - Premium Fitness Platform',
    description: 'Transform your body with premium workout plans and nutrition guidance.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Root layout wraps all pages with navigation and providers
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {/* Main navigation bar */}
        <Navigation />
        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
        {/* Footer */}
        <footer className="border-t border-gray-800 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gradient-gold mb-3">GymPro</h3>
                <p className="text-gray-400 text-sm">
                  Premium fitness platform to transform your body and achieve your goals.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Platform</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/workouts" className="hover:text-amber-400 transition-colors">Workouts</a></li>
                  <li><a href="/diet" className="hover:text-amber-400 transition-colors">Diet Plans</a></li>
                  <li><a href="/calculator" className="hover:text-amber-400 transition-colors">Calculator</a></li>
                  <li><a href="/progress" className="hover:text-amber-400 transition-colors">Progress</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Account</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/login" className="hover:text-amber-400 transition-colors">Login</a></li>
                  <li><a href="/signup" className="hover:text-amber-400 transition-colors">Sign Up</a></li>
                  <li><a href="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Follow Us</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-amber-400 transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition-colors">YouTube</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition-colors">Twitter</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} GymPro. All rights reserved. Built with ❤️ for fitness enthusiasts.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
