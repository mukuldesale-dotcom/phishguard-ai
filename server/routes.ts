import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";
import passport from "passport";
import { analyzeScamPsychology, analyzeLink, generateSafeReply } from "./openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await hashPassword(input.password);
      const user = await storage.createUser({ ...input, password: hashedPassword });
      req.login(user, (err) => {
        if (err) throw err;
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    res.json(req.user);
  });

  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    next();
  };

  app.post(api.scan.analyzeText.path, async (req, res) => {
    try {
      const { text } = api.scan.analyzeText.input.parse(req.body);
      const result = await analyzeScamPsychology(text);
      if (req.isAuthenticated()) {
        await storage.createScanHistory({
          userId: req.user!.id,
          content: text,
          type: "text",
          riskLevel: result.riskLevel,
          riskScore: result.riskScore,
          analysis: result
        });
      }
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to analyze text" });
    }
  });

  app.post(api.scan.analyzeUrl.path, async (req, res) => {
    try {
      const { url } = api.scan.analyzeUrl.input.parse(req.body);
      const result = await analyzeLink(url);
      if (req.isAuthenticated()) {
        await storage.createScanHistory({
          userId: req.user!.id,
          content: url,
          type: "url",
          riskLevel: result.riskLevel,
          riskScore: result.riskScore,
          analysis: result
        });
      }
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to analyze url" });
    }
  });

  app.get(api.scan.history.path, requireAuth, async (req, res) => {
    const history = await storage.getScanHistoryByUser(req.user!.id);
    res.json(history);
  });

  app.post(api.safeReply.generate.path, async (req, res) => {
    try {
      const { text } = api.safeReply.generate.input.parse(req.body);
      const reply = await generateSafeReply(text);
      res.json({ reply });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to generate reply" });
    }
  });

  app.post(api.game.saveScore.path, requireAuth, async (req, res) => {
    try {
      const input = api.game.saveScore.input.parse(req.body);
      const score = await storage.createGameScore({
        userId: req.user!.id,
        score: input.score,
        totalQuestions: input.totalQuestions
      });
      res.json(score);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save score" });
    }
  });

  app.get(api.game.history.path, requireAuth, async (req, res) => {
    const history = await storage.getGameScoresByUser(req.user!.id);
    res.json(history);
  });

  return httpServer;
}
