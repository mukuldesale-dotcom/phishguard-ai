import { useState } from "react";
import { CyberCard } from "@/components/cyber-card";
import { useAnalyzeText, useSafeReply } from "@/hooks/use-scan";
import { Brain, ShieldCheck, AlertTriangle, AlertOctagon, MessageSquare, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScamAnalyzer() {
  const [text, setText] = useState("");
  const { mutate: analyze, data: result, isPending, error } = useAnalyzeText();
  const { mutate: generateReply, data: replyData, isPending: isGeneratingReply } = useSafeReply();
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    analyze({ text });
  };

  const handleGenerateReply = () => {
    if (!text.trim()) return;
    generateReply({ text });
  };

  const handleCopy = () => {
    if (replyData?.reply) {
      navigator.clipboard.writeText(replyData.reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRiskIcon = (level: string) => {
    if (level === "Safe") return <ShieldCheck className="w-12 h-12 text-success" />;
    if (level === "Medium") return <AlertTriangle className="w-12 h-12 text-warning" />;
    return <AlertOctagon className="w-12 h-12 text-destructive" />;
  };

  const getRiskColor = (level: string) => {
    if (level === "Safe") return "success";
    if (level === "Medium") return "warning";
    return "destructive";
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-secondary" /> Scam Psychology Analyzer
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Paste any suspicious email, text message, or DM. Our AI will analyze the psychological tactics being used against you.
        </p>
      </div>

      <CyberCard glowColor="secondary">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 px-4 py-4 rounded-xl bg-input/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-none"
            placeholder="e.g. URGENT: Your account will be locked in 24 hours. Click here to verify your identity immediately..."
            disabled={isPending}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-display">Neural Engine Ready</span>
            <button
              type="submit"
              disabled={isPending || !text.trim()}
              className="px-6 py-3 rounded-xl font-bold bg-secondary text-secondary-foreground hover:shadow-[0_0_20px_rgba(150,0,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Run Analysis"}
            </button>
          </div>
        </form>
      </CyberCard>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-center">
          Analysis failed. Please try again.
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Risk Assessment */}
            <CyberCard glowColor={getRiskColor(result.riskLevel) as any} className="flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-black/20 border border-white/5 mb-4">
                {getRiskIcon(result.riskLevel)}
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">{result.riskLevel} Risk</h2>
              <p className="text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-6">
                {result.riskScore}<span className="text-2xl text-muted-foreground">/100</span>
              </p>
              
              <div className="w-full text-left space-y-2 mt-auto">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Tactics Detected:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.tactics.length > 0 ? (
                    result.tactics.map(t => (
                      <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">None detected</span>
                  )}
                </div>
              </div>
            </CyberCard>

            {/* AI Breakdown & Reply */}
            <div className="space-y-6">
              <CyberCard>
                <h3 className="text-lg font-bold font-display mb-3 text-primary">AI Breakdown</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{result.explanation}</p>
              </CyberCard>

              <CyberCard className="border-secondary/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold font-display flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-secondary" /> Safe Reply Protocol
                  </h3>
                  {!replyData && (
                    <button
                      onClick={handleGenerateReply}
                      disabled={isGeneratingReply}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-secondary/20 text-secondary hover:bg-secondary hover:text-white transition-colors flex items-center gap-2"
                    >
                      {isGeneratingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
                    </button>
                  )}
                </div>
                
                {replyData ? (
                  <div className="relative bg-black/40 p-4 rounded-xl border border-white/10">
                    <p className="text-sm font-mono text-gray-300 pr-10">{replyData.reply}</p>
                    <button 
                      onClick={handleCopy}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Generate a polite, non-committal response to safely disengage without revealing personal info.
                  </p>
                )}
              </CyberCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
