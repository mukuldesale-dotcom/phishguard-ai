import { ReactNode } from "react";
import { useUser } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-display tracking-widest text-sm">AUTHENTICATING...</p>
      </div>
    );
  }

  if (!user) {
    return <Redirect href="/auth" />;
  }

  return <>{children}</>;
}
