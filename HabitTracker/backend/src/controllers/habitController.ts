import { Request, Response } from "express";
import { db } from "../db";
import { habits, habitLogs } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

// 1. GET ALL HABITS
export const getHabits = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "User ID required" });
  }

  try {
    const userHabits = await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId));

    res.json(userHabits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
};

// 2. LOG A HABIT
export const logHabit = async (req: Request, res: Response): Promise<any> => {
  const { habitId, date } = req.body;

  try {
    // Check if it's already logged
    const existingLog = await db
      .select()
      .from(habitLogs)
      .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
      .limit(1);

    if (existingLog.length > 0) {
      // Toggle off (delete)
      await db.delete(habitLogs).where(eq(habitLogs.id, existingLog[0].id));
      return res.json({ status: "unchecked" });
    } else {
      // Toggle on (create)
      await db.insert(habitLogs).values({
        habitId,
        date,
        completed: true,
      });
      return res.json({ status: "checked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log habit" });
  }
};

// 3. GET PROGRESS
export const getProgress = async (req: Request, res: Response): Promise<any> => {
  const { userId, startDate, endDate } = req.query;

  if (!userId || typeof userId !== "string")
    return res.status(400).json({ error: "Missing params" });

  try {
    const result = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM ${habitLogs} 
      JOIN ${habits} ON ${habitLogs.habitId} = ${habits.id}
      WHERE ${habits.userId} = ${userId}
      AND ${habitLogs.date} >= ${startDate} 
      AND ${habitLogs.date} <= ${endDate}
    `);

    res.json({ totalCompleted: result[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate progress" });
  }
};
