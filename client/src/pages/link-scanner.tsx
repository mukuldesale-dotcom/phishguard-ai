import { useState } from "react";
import { CyberCard } from "@/components/cyber-card";
import { RiskGauge } from "@/components/risk-gauge";
import { useAnalyzeUrl } from "@/hooks/use-scan";
import { Radar, Globe, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LinkScanner() {
  const [url, setUrl] = useState("");
  const { mutate: analyze, data: result, isPending, error } = useAnalyzeUrl();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    // Auto-prepend http if missing for basic validation to pass backend
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'http://' + formattedUrl;
    }
    
    analyze({ url: formattedUrl });
  };

  const getRiskColor = (level: string) => {
    if (level === "Safe") return "success";
    if (level === "Medium") return "warning";
    return "destructive";
  };

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold flex items-center justify-center gap-3">
          <Radar className="w-8 h-8 text-primary" /> Deep Link Scanner
        </h1>
        <p className="text-muted-foreground mt-3">
          Unmask hidden redirects, deceptive domains, and phishing infrastructure.
        </p>
      </div>

      <CyberCard glowColor="primary" className="p-2 sm:p-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-input/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
              placeholder="example.com/login-secure"
              disabled={isPending}
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !url.trim()}
            className="px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Scan</>}
          </button>
        </form>
      </CyberCard>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-center">
          Scan failed. Please check the URL format and try again.
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <CyberCard className="flex justify-center py-10" glowColor={getRiskColor(result.riskLevel) as any}>
              <RiskGauge score={result.riskScore} level={result.riskLevel} size={240} />
            </CyberCard>

            <CyberCard className="h-full flex flex-col justify-center">
              <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" /> Scan Results
              </h3>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 font-mono text-sm break-all mb-6 text-muted-foreground">
                Target: {url}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                {result.explanation}
              </p>
              
              <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-muted-foreground font-mono">
                <span>Confidence Level</span>
                <span className="text-primary">{result.confidence}%</span>
              </div>
            </CyberCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
