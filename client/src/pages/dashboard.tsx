import { ProtectedRoute } from "@/components/protected-route";
import { CyberCard } from "@/components/cyber-card";
import { useScanHistory } from "@/hooks/use-scan";
import { useGameHistory } from "@/hooks/use-game";
import { Shield, Target, Award, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { data: scans, isLoading: loadingScans } = useScanHistory();
  const { data: games, isLoading: loadingGames } = useGameHistory();

  const isLoading = loadingScans || loadingGames;

  // Calculate Digital Safety Level
  let safetyScore = 0;
  let safetyLevel = "Rookie";
  
  if (scans && games) {
    const totalScans = scans.length;
    const safeScans = scans.filter(s => s.riskLevel.toLowerCase() === 'safe').length;
    const scanScore = totalScans > 0 ? (safeScans / totalScans) * 50 : 25; // Base 25 if no scans

    const totalGames = games.length;
    const avgGameScore = totalGames > 0 
      ? games.reduce((acc, g) => acc + (g.score / g.totalQuestions), 0) / totalGames * 50
      : 25; // Base 25 if no games

    safetyScore = Math.round(scanScore + avgGameScore);
    
    if (safetyScore >= 90) safetyLevel = "Cyber Ninja";
    else if (safetyScore >= 70) safetyLevel = "Vigilant Operator";
    else if (safetyScore >= 50) safetyLevel = "Defender";
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Command Center</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Here are your latest operative stats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stat Card */}
        <CyberCard className="lg:col-span-2 flex flex-col sm:flex-row items-center gap-8" glowColor="primary">
          <div className="relative flex items-center justify-center w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
              <circle 
                cx="96" cy="96" r="80" 
                stroke="currentColor" strokeWidth="12" fill="transparent" 
                className="text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" 
                strokeDasharray="502" 
                strokeDashoffset={502 - (safetyScore / 100) * 502} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-display font-bold text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                {safetyScore}%
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Safety Level</span>
            </div>
          </div>
          <div className="space-y-4 text-center sm:text-left">
            <div>
              <h2 className="text-2xl font-bold font-display">{safetyLevel}</h2>
              <p className="text-muted-foreground">Your overall digital resilience based on scans and training.</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                <Target className="w-4 h-4 text-secondary" />
                <span className="font-medium">{scans?.length || 0} Scans</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                <Award className="w-4 h-4 text-warning" />
                <span className="font-medium">{games?.length || 0} Games</span>
              </div>
            </div>
          </div>
        </CyberCard>

        {/* Quick Actions */}
        <CyberCard className="flex flex-col gap-4">
          <h3 className="text-lg font-bold font-display flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Quick Deploy
          </h3>
          <div className="flex flex-col gap-3 mt-2">
            <Link href="/analyzer" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all group">
              <span className="font-medium">Scan Text</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </Link>
            <Link href="/scanner" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-secondary/10 border border-transparent hover:border-secondary/30 transition-all group">
              <span className="font-medium">Scan URL</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary" />
            </Link>
            <Link href="/game" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-warning/10 border border-transparent hover:border-warning/30 transition-all group">
              <span className="font-medium">Training Sim</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-warning" />
            </Link>
          </div>
        </CyberCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scans */}
        <CyberCard>
          <h3 className="text-xl font-bold font-display flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-muted-foreground" /> Recent Scans
          </h3>
          <div className="space-y-4">
            {!scans?.length ? (
              <p className="text-muted-foreground italic">No operations recorded yet.</p>
            ) : (
              scans.slice(0, 5).map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                  <div className="overflow-hidden pr-4">
                    <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-[300px]">{scan.content}</p>
                    <p className="text-xs text-muted-foreground uppercase mt-1">{scan.type}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${
                    scan.riskLevel === 'Safe' ? 'bg-success/20 text-success' :
                    scan.riskLevel === 'Medium' ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {scan.riskLevel}
                  </div>
                </div>
              ))
            )}
          </div>
        </CyberCard>

        {/* Recent Game Scores */}
        <CyberCard>
          <h3 className="text-xl font-bold font-display flex items-center gap-2 mb-6">
            <Gamepad2Icon className="w-5 h-5 text-muted-foreground" /> Simulation Logs
          </h3>
          <div className="space-y-4">
            {!games?.length ? (
              <p className="text-muted-foreground italic">No simulations completed.</p>
            ) : (
              games.slice(0, 5).map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                  <div>
                    <p className="font-medium">Phishing Awareness</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(game.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-xl font-display font-bold text-primary">
                    {game.score} / {game.totalQuestions}
                  </div>
                </div>
              ))
            )}
          </div>
        </CyberCard>
      </div>
    </div>
  );
}

function Gamepad2Icon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
}
