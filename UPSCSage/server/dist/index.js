"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const PORT = process.env.PORT || 5000;
const server = app_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
/**
 * Handle graceful shutdown
 * Stops the server from accepting new connections
 * Wait for active connections to finish
 * Drains the PostgreSQL connection pool
 */
const shutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    // Close the server (stop accepting new requests)
    server.close(async () => {
        console.log('HTTP server closed.');
        try {
            // Close the database pool
            console.log('Closing database connection pool...');
            await db_1.default.end();
            console.log('Database connection pool closed.');
            process.exit(0);
        }
        catch (err) {
            console.error('Error during database teardown', err);
            process.exit(1);
        }
    });
    // Force shutdown if they take too long (e.g., 10 seconds)
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};
// Listen for termination signals from the OS (Docker/Kubernetes etc)
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
