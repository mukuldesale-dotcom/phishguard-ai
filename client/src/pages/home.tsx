import { Link } from "wouter";
import { Shield, Brain, Radar, ShieldAlert, ArrowRight } from "lucide-react";
import { CyberCard } from "@/components/cyber-card";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-primary text-sm font-medium mb-4"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen Student Cybersecurity
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-display tracking-tight"
        >
          Outsmart Scammers with <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-text">
            CyberSathi AI
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Level up your digital defense. Analyze suspicious messages, scan risky links, and train your instincts with our AI-powered gamified platform.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link 
            href="/auth" 
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Deploy Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/game" 
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold glass-panel border-white/20 hover:bg-white/5 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Play Training Game
            <GamepadIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        <CyberCard className="flex flex-col items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Brain className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-display">Scam Psychology AI</h3>
          <p className="text-muted-foreground leading-relaxed">
            Don't just know it's a scam—know *how* they're trying to trick you. Our AI breaks down urgency, fear, and manipulation tactics.
          </p>
        </CyberCard>
        
        <CyberCard className="flex flex-col items-start gap-4">
          <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
            <Radar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-display">Deep Link Scanner</h3>
          <p className="text-muted-foreground leading-relaxed">
            Paste suspicious URLs before you click. We'll analyze the domain patterns, hidden redirects, and risk levels instantly.
          </p>
        </CyberCard>

        <CyberCard className="flex flex-col items-start gap-4">
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-display">Safe Reply Generator</h3>
          <p className="text-muted-foreground leading-relaxed">
            Not sure how to respond to a sketchy text from someone you know? Generate identity-protecting, polite decline messages.
          </p>
        </CyberCard>
      </section>
    </div>
  );
}

function GamepadIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
}
