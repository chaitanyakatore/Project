import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Quick test to ensure the database can be reached
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'OK', database: 'Connected' });
  } catch (err) {
    console.error('Database connection failed during health check', err);
    res.status(503).json({ status: 'ERROR', database: 'Disconnected' });
  }
});

// Add additional routes here later

export default app;
