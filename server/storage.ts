import { db, pool } from "./db";
import { users, scanHistory, gameScores, type User, type InsertUser, type ScanHistory, type InsertScanHistory, type GameScore, type InsertGameScore } from "@shared/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import MemoryStoreFactory from "memorystore";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createScanHistory(history: InsertScanHistory): Promise<ScanHistory>;
  getScanHistoryByUser(userId: number): Promise<ScanHistory[]>;

  createGameScore(score: InsertGameScore): Promise<GameScore>;
  getGameScoresByUser(userId: number): Promise<GameScore[]>;

  sessionStore: session.Store;
}

// ---------------------------------------------------------------------------
// PostgreSQL-backed storage (used when DATABASE_URL is set)
// ---------------------------------------------------------------------------

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    if (!pool) {
      throw new Error("DatabaseStorage requires a valid database connection (DATABASE_URL must be set).");
    }
    const PostgresStore = connectPg(session);
    this.sessionStore = new PostgresStore({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db!.insert(users).values(insertUser).returning();
    return user;
  }

  async createScanHistory(history: InsertScanHistory): Promise<ScanHistory> {
    const [scan] = await db!.insert(scanHistory).values(history).returning();
    return scan;
  }

  async getScanHistoryByUser(userId: number): Promise<ScanHistory[]> {
    return await db!.select().from(scanHistory).where(eq(scanHistory.userId, userId));
  }

  async createGameScore(score: InsertGameScore): Promise<GameScore> {
    const [sc] = await db!.insert(gameScores).values(score).returning();
    return sc;
  }

  async getGameScoresByUser(userId: number): Promise<GameScore[]> {
    return await db!.select().from(gameScores).where(eq(gameScores.userId, userId));
  }
}

// ---------------------------------------------------------------------------
// In-memory storage (fallback when DATABASE_URL is not set)
// ---------------------------------------------------------------------------

const MemoryStore = MemoryStoreFactory(session);

export class MemoryStorage implements IStorage {
  sessionStore: session.Store;

  private users: User[] = [];
  private scans: ScanHistory[] = [];
  private scores: GameScore[] = [];
  private nextId = 1;

  constructor() {
    this.sessionStore = new MemoryStore({ checkPeriod: 86_400_000 });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { id: this.nextId++, ...insertUser };
    this.users.push(user);
    return user;
  }

  async createScanHistory(history: InsertScanHistory): Promise<ScanHistory> {
    const scan: ScanHistory = {
      id: this.nextId++,
      createdAt: new Date(),
      userId: history.userId ?? null,
      content: history.content,
      type: history.type,
      riskLevel: history.riskLevel,
      riskScore: history.riskScore,
      analysis: history.analysis,
    };
    this.scans.push(scan);
    return scan;
  }

  async getScanHistoryByUser(userId: number): Promise<ScanHistory[]> {
    return this.scans.filter((s) => s.userId === userId);
  }

  async createGameScore(score: InsertGameScore): Promise<GameScore> {
    const sc: GameScore = {
      id: this.nextId++,
      createdAt: new Date(),
      userId: score.userId ?? null,
      score: score.score,
      totalQuestions: score.totalQuestions,
    };
    this.scores.push(sc);
    return sc;
  }

  async getGameScoresByUser(userId: number): Promise<GameScore[]> {
    return this.scores.filter((s) => s.userId === userId);
  }
}

// Use PostgreSQL when available, otherwise fall back to in-memory.
export const storage: IStorage = pool ? new DatabaseStorage() : new MemoryStorage();