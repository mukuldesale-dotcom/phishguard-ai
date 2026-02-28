import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { z } from "zod";

type SaveScoreInput = z.infer<typeof api.game.saveScore.input>;

export function useGameHistory() {
  return useQuery({
    queryKey: [api.game.history.path],
    queryFn: async () => {
      const res = await fetch(api.game.history.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch game history");
      return api.game.history.responses[200].parse(await res.json());
    },
  });
}

export function useSaveScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SaveScoreInput) => {
      const res = await fetch(api.game.saveScore.path, {
        method: api.game.saveScore.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save game score");
      return api.game.saveScore.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.game.history.path] }),
  });
}
