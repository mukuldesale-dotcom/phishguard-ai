import { db } from "./db";
import { users, scanHistory, gameScores, type User, type InsertUser, type ScanHistory, type InsertScanHistory, type GameScore, type InsertGameScore } from "@shared/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresStore = connectPg(session);

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

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresStore({
      pool,
      tableName: "session",
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createScanHistory(history: InsertScanHistory): Promise<ScanHistory> {
    const [scan] = await db.insert(scanHistory).values(history).returning();
    return scan;
  }

  async getScanHistoryByUser(userId: number): Promise<ScanHistory[]> {
    return await db.select().from(scanHistory).where(eq(scanHistory.userId, userId));
  }

  async createGameScore(score: InsertGameScore): Promise<GameScore> {
    const [sc] = await db.insert(gameScores).values(score).returning();
    return sc;
  }

  async getGameScoresByUser(userId: number): Promise<GameScore[]> {
    return await db.select().from(gameScores).where(eq(gameScores.userId, userId));
  }
}

export const storage = new DatabaseStorage();