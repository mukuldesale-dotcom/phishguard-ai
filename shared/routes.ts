import { z } from "zod";
import { insertUserSchema, users, scanHistory, gameScores } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/register" as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/login" as const,
      input: insertUserSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/logout" as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/me" as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
  },
  scan: {
    analyzeText: {
      method: "POST" as const,
      path: "/api/scan/text" as const,
      input: z.object({ text: z.string() }),
      responses: {
        200: z.object({
          riskLevel: z.string(),
          riskScore: z.number(),
          tactics: z.array(z.string()),
          explanation: z.string(),
          confidence: z.number(),
        }),
        500: errorSchemas.internal,
      },
    },
    analyzeUrl: {
      method: "POST" as const,
      path: "/api/scan/url" as const,
      input: z.object({ url: z.string() }),
      responses: {
        200: z.object({
          riskLevel: z.string(),
          riskScore: z.number(),
          explanation: z.string(),
          confidence: z.number(),
        }),
        500: errorSchemas.internal,
      },
    },
    history: {
      method: "GET" as const,
      path: "/api/scan/history" as const,
      responses: {
        200: z.array(z.custom<typeof scanHistory.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
  },
  safeReply: {
    generate: {
      method: "POST" as const,
      path: "/api/safe-reply" as const,
      input: z.object({ text: z.string() }),
      responses: {
        200: z.object({ reply: z.string() }),
        500: errorSchemas.internal,
      },
    },
  },
  game: {
    saveScore: {
      method: "POST" as const,
      path: "/api/game/score" as const,
      input: z.object({ score: z.number(), totalQuestions: z.number() }),
      responses: {
        200: z.custom<typeof gameScores.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    history: {
      method: "GET" as const,
      path: "/api/game/history" as const,
      responses: {
        200: z.array(z.custom<typeof gameScores.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
