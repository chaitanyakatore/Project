"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic health check route
app.get('/health', async (req, res) => {
    try {
        // Quick test to ensure the database can be reached
        await db_1.default.query('SELECT 1');
        res.status(200).json({ status: 'OK', database: 'Connected' });
    }
    catch (err) {
        console.error('Database connection failed during health check', err);
        res.status(503).json({ status: 'ERROR', database: 'Disconnected' });
    }
});
// Add additional routes here later
exports.default = app;
