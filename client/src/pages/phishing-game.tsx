import { useState } from "react";
import { CyberCard } from "@/components/cyber-card";
import { useSaveScore } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-auth";
import { Gamepad2, ShieldCheck, AlertOctagon, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

// Hardcoded questions for the simulation
const QUESTIONS = [
  {
    text: "URGENT: Your account will be locked. Click here to verify: http://bit.ly/secure-acc",
    type: "scam",
    explanation: "Sense of urgency ('URGENT', 'locked') combined with a shortened URL (bit.ly) is a classic phishing tactic to bypass filters."
  },
  {
    text: "Your Netflix subscription has been updated. If you did not make this change, please contact support at support@netflix.com.",
    type: "real",
    explanation: "Legitimate notifications usually direct you to contact their official support channel rather than providing a direct hidden link."
  },
  {
    text: "Hi, this is mom. I lost my phone, this is my new number. Can you send me $50 for groceries?",
    type: "scam",
    explanation: "This is a 'piggybacking' or 'imposter' scam. Always verify by calling the person's original number or asking a personal question."
  },
  {
    text: "CONGRATULATIONS! You've been selected to win a free iPhone 15. Claim it now at win-iphone15-promo.com!",
    type: "scam",
    explanation: "Too good to be true. Scammers use extreme positive emotion and greed to force impulsive clicks."
  },
  {
    text: "Reminder: Team meeting at 2 PM PST tomorrow via Zoom. The link is in your calendar invite.",
    type: "real",
    explanation: "Standard corporate communication. It doesn't force you to click a shady link directly in the message, directing you to a trusted source (calendar) instead."
  }
];

type GameState = "start" | "playing" | "feedback" | "end";

export default function PhishingGame() {
  const { data: user } = useUser();
  const { mutate: saveScore, isPending: isSaving } = useSaveScore();
  
  const [gameState, setGameState] = useState<GameState>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  const currentQ = QUESTIONS[currentIndex];

  const startGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setGameState("playing");
  };

  const handleAnswer = (answer: "real" | "scam") => {
    const isCorrect = answer === currentQ.type;
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) setScore(s => s + 1);
    setGameState("feedback");
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex(i => i + 1);
      setGameState("playing");
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameState("end");
    // Only save score if user is logged in
    if (user) {
      saveScore({ score: score + (lastAnswerCorrect ? 1 : 0), totalQuestions: QUESTIONS.length });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <AnimatePresence mode="wait">
        
        {gameState === "start" && (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
            <CyberCard className="text-center p-10" glowColor="primary">
              <Gamepad2 className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl font-display font-bold mb-4">Training Sim V1.0</h1>
              <p className="text-muted-foreground mb-8 text-lg">
                Test your instincts. You will be shown 5 messages. You must determine if they are REAL or a SCAM.
              </p>
              <button 
                onClick={startGame}
                className="px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all text-lg"
              >
                Initialize Simulation
              </button>
            </CyberCard>
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div className="flex justify-between items-center mb-6 text-sm font-display text-muted-foreground">
              <span>Target: {currentIndex + 1} / {QUESTIONS.length}</span>
              <span>Score: <span className="text-primary font-bold">{score}</span></span>
            </div>
            
            <CyberCard className="p-8">
              <div className="min-h-[150px] flex items-center justify-center bg-black/30 p-6 rounded-xl border border-white/5 mb-8">
                <p className="text-lg md:text-xl text-center font-mono leading-relaxed">
                  "{currentQ.text}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleAnswer("real")}
                  className="py-4 rounded-xl font-bold glass-panel border-success/30 text-success hover:bg-success hover:text-success-foreground hover:shadow-[0_0_15px_rgba(0,255,100,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" /> REAL
                </button>
                <button 
                  onClick={() => handleAnswer("scam")}
                  className="py-4 rounded-xl font-bold glass-panel border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0_15px_rgba(255,0,50,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <AlertOctagon className="w-5 h-5" /> SCAM
                </button>
              </div>
            </CyberCard>
          </motion.div>
        )}

        {gameState === "feedback" && (
          <motion.div key="feedback" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <CyberCard glowColor={lastAnswerCorrect ? "success" : "destructive"} className="text-center p-8">
              <div className="mb-6">
                {lastAnswerCorrect ? (
                  <div className="inline-flex flex-col items-center">
                    <ShieldCheck className="w-16 h-16 text-success mb-2" />
                    <span className="text-2xl font-bold font-display text-success">CORRECT</span>
                  </div>
                ) : (
                  <div className="inline-flex flex-col items-center">
                    <AlertOctagon className="w-16 h-16 text-destructive mb-2" />
                    <span className="text-2xl font-bold font-display text-destructive">INCORRECT</span>
                  </div>
                )}
              </div>
              
              <div className="bg-black/30 p-6 rounded-xl border border-white/5 text-left mb-8">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-white">AI Analysis:</strong> {currentQ.explanation}
                </p>
              </div>

              <button 
                onClick={nextQuestion}
                className="w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Next Target <ArrowRight className="w-5 h-5" />
              </button>
            </CyberCard>
          </motion.div>
        )}

        {gameState === "end" && (
          <motion.div key="end" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <CyberCard glowColor="primary" className="text-center p-10">
              <h2 className="text-3xl font-display font-bold mb-2">Simulation Complete</h2>
              
              <div className="my-8">
                <span className="text-7xl font-bold font-display text-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  {score}
                </span>
                <span className="text-2xl text-muted-foreground">/{QUESTIONS.length}</span>
              </div>

              <p className="text-lg text-muted-foreground mb-8">
                {score === QUESTIONS.length ? "Flawless operation. Your instincts are sharp." : 
                 score >= 3 ? "Good job, but there's room for improvement." : 
                 "You need more training. Scammers almost got you."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl font-bold glass-panel hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" /> Retry Sim
                </button>
                {user ? (
                  <Link href="/dashboard" className="px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all">
                    Return to Dashboard
                  </Link>
                ) : (
                  <Link href="/auth" className="px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all">
                    Save Score (Login)
                  </Link>
                )}
              </div>
              
              {isSaving && <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Syncing to mainframe...</p>}
            </CyberCard>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
