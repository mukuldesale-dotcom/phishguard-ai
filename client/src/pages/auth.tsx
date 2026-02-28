import { useState } from "react";
import { useLocation } from "wouter";
import { useUser, useLogin, useRegister } from "@/hooks/use-auth";
import { CyberCard } from "@/components/cyber-card";
import { Shield, Loader2 } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [, setLocation] = useLocation();
  const { data: user } = useUser();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: register, isPending: isRegistering } = useRegister();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Terminal requires both username and password.");
      return;
    }

    const payload = { username, password };
    
    if (isLogin) {
      login(payload, {
        onError: (err) => setError(err.message),
      });
    } else {
      register(payload, {
        onError: (err) => setError(err.message),
      });
    }
  };

  const isPending = isLoggingIn || isRegistering;

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <CyberCard className="w-full max-w-md p-8" glowColor="primary">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-display">Secure Terminal Access</h2>
          <p className="text-muted-foreground mt-2">Initialize your identity protocol.</p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5 uppercase tracking-wider font-display">Operative ID</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Enter username"
              disabled={isPending}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5 uppercase tracking-wider font-display">Access Code</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Enter password"
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 mt-4 rounded-xl font-bold font-display tracking-widest uppercase bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              isLogin ? "Initialize Login" : "Register Identity"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            {isLogin ? "No identity found? Register here." : "Identity exists? Initialize login."}
          </button>
        </div>
      </CyberCard>
    </div>
  );
}
