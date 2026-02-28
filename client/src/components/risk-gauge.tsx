import { motion } from "framer-motion";

interface RiskGaugeProps {
  score: number; // 0-100
  level: string; // 'Safe' | 'Medium' | 'High'
  size?: number;
}

export function RiskGauge({ score, level, size = 200 }: RiskGaugeProps) {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-success";
  let dropShadow = "drop-shadow-[0_0_8px_rgba(0,255,100,0.8)]";
  
  if (level.toLowerCase() === "medium") {
    colorClass = "text-warning";
    dropShadow = "drop-shadow-[0_0_8px_rgba(255,170,0,0.8)]";
  } else if (level.toLowerCase() === "high") {
    colorClass = "text-destructive";
    dropShadow = "drop-shadow-[0_0_8px_rgba(255,0,50,0.8)]";
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background track */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={size * 0.08}
          fill="transparent"
          className="text-white/5"
        />
        {/* Animated Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={size * 0.08}
          fill="transparent"
          className={`${colorClass} ${dropShadow}`}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-4xl font-display font-bold ${colorClass} ${dropShadow}`}>
          {score}
        </span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
          {level}
        </span>
      </div>
    </div>
  );
}
