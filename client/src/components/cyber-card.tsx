import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CyberCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "secondary" | "destructive" | "warning" | "success" | "none";
}

export function CyberCard({ children, className = "", glowColor = "none", ...props }: CyberCardProps) {
  const glowClasses = {
    primary: "neon-border",
    secondary: "border-secondary/50 shadow-[0_0_15px_rgba(150,0,255,0.15)]",
    destructive: "neon-border-destructive",
    warning: "neon-border-warning",
    success: "neon-border-success",
    none: "border-white/10 hover:border-white/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${glowClasses[glowColor]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
