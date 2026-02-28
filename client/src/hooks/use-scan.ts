import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { z } from "zod";

type AnalyzeTextInput = z.infer<typeof api.scan.analyzeText.input>;
type AnalyzeUrlInput = z.infer<typeof api.scan.analyzeUrl.input>;
type SafeReplyInput = z.infer<typeof api.safeReply.generate.input>;

export function useScanHistory() {
  return useQuery({
    queryKey: [api.scan.history.path],
    queryFn: async () => {
      const res = await fetch(api.scan.history.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scan history");
      return api.scan.history.responses[200].parse(await res.json());
    },
  });
}

export function useAnalyzeText() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AnalyzeTextInput) => {
      const res = await fetch(api.scan.analyzeText.path, {
        method: api.scan.analyzeText.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to analyze text");
      return api.scan.analyzeText.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.scan.history.path] }),
  });
}

export function useAnalyzeUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AnalyzeUrlInput) => {
      const res = await fetch(api.scan.analyzeUrl.path, {
        method: api.scan.analyzeUrl.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to analyze URL");
      return api.scan.analyzeUrl.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.scan.history.path] }),
  });
}

export function useSafeReply() {
  return useMutation({
    mutationFn: async (data: SafeReplyInput) => {
      const res = await fetch(api.safeReply.generate.path, {
        method: api.safeReply.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate safe reply");
      return api.safeReply.generate.responses[200].parse(await res.json());
    }
  });
}
