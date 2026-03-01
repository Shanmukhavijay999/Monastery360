import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { applySecurity } from "./middleware/security";
import authRoutes from "./routes/authRoutes";
import monasteryRoutes from "./routes/monasteryRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS Configuration ─────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:8082",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body Parsers ────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Security Middleware ─────────────────────────────
applySecurity(app);

// ─── Routes ──────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    status: "running",
    name: "Monastery360 API",
    version: "2.0.0",
    security: "enterprise-grade",
    endpoints: {
      auth: "/api/auth",
      monasteries: "/api/monasteries",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/monasteries", monasteryRoutes);

// ─── 404 Handler ─────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ─── Global Error Handler ────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("🔥 Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : err.message || "Something went wrong.",
  });
});

// ─── Database & Server ───────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/monastery360";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`🔒 Security middleware: Helmet, Rate Limiting, Input Sanitization, HPP`);
      console.log(`🔑 Auth: JWT + bcrypt + Role-based access`);
    });
  })
  .catch(async (err) => {
    console.error("❌ Local MongoDB connection failed:", err.message);
    console.log("⚠️ Starting in-memory MongoDB Server so OTP and auth features keep working...");
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      await mongoose.connect(memUri);

      console.log(`✅ In-Memory MongoDB connected at ${memUri}`);
      console.log('DEBUG CHECK - SMTP_PASS:', process.env.SMTP_PASS ? `Defined (length ${process.env.SMTP_PASS.length})` : 'UNDEFINED');

      app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log(`🔒 Authentication & OTP are fully functional in memory-mode!`);
      });
    } catch (memErr) {
      console.error("❌ In-Memory MongoDB failed to start", memErr);
      app.listen(PORT, () => {
        console.log(`⚠️ Server running WITHOUT database on http://localhost:${PORT}`);
      });
    }
  });
