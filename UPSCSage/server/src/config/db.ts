import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the PostgreSQL connection pool
// This avoids opening a new TCP connection on every request,
// improving latency and supporting higher concurrency.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add additional configurations if needed (max connections, idle timeouts, etc.)
  // max: 20, // max number of clients in the pool
  // idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
