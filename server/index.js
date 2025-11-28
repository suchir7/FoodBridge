import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";
import authRoutes from "./routes/auth.js";
import donationRoutes from "./routes/donations.js";
import requestRoutes from "./routes/requests.js";

export function createServer() {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });

    // API routes
    app.use("/api/auth", authRoutes);
    app.use("/api/donations", donationRoutes);
    app.use("/api/requests", requestRoutes);

    app.get("/api/ping", (_req, res) => {
        const ping = process.env.PING_MESSAGE ?? "ping";
        res.json({ message: ping });
    });

    app.get("/api/demo", handleDemo);

    // Global error handler
    app.use((err, req, res, next) => {
        console.error("🔥 Server Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    });

    return app;
}
