import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import { Express, Request, Response, NextFunction } from "express";

// ─── Rate Limiters ───────────────────────────────────

// General API rate limit: 100 requests per 15 min
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth routes: stricter — 10 attempts per 15 min
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many login attempts. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// AI routes: 30 requests per minute (free Gemini API limits)
export const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
        success: false,
        message: "AI request limit reached. Please wait a moment.",
    },
});

// ─── Input Sanitizer ─────────────────────────────────

// Sanitize request body/params — strip dangerous characters
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
    // Recursively clean strings in an object
    const clean = (obj: any): any => {
        if (typeof obj === "string") {
            // Remove script tags and event handlers
            return obj
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
                .replace(/on\w+\s*=\s*'[^']*'/gi, "")
                .trim();
        }
        if (Array.isArray(obj)) return obj.map(clean);
        if (obj && typeof obj === "object") {
            const cleaned: any = {};
            for (const key of Object.keys(obj)) {
                cleaned[key] = clean(obj[key]);
            }
            return cleaned;
        }
        return obj;
    };

    // Remove MongoDB injection operators ($where, $gt, etc.) from body and params
    const stripMongoOps = (obj: any): any => {
        if (obj && typeof obj === "object") {
            for (const key of Object.keys(obj)) {
                if (key.startsWith("$")) {
                    delete obj[key];
                } else {
                    stripMongoOps(obj[key]);
                }
            }
        }
        return obj;
    };

    if (req.body) { req.body = clean(req.body); stripMongoOps(req.body); }
    if (req.params) { req.params = clean(req.params); stripMongoOps(req.params); }
    // Note: req.query is read-only in Express 5 — sanitize values in place
    if (req.query) {
        for (const key of Object.keys(req.query)) {
            const val = req.query[key];
            if (typeof val === "string") {
                (req.query as any)[key] = clean(val);
            }
        }
    }
    next();
};

// ─── Apply All Security ──────────────────────────────

export const applySecurity = (app: Express): void => {
    // Helmet — sets security HTTP headers
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                    fontSrc: ["'self'", "https://fonts.gstatic.com"],
                    imgSrc: ["'self'", "data:", "https:", "blob:"],
                    connectSrc: [
                        "'self'",
                        "https://generativelanguage.googleapis.com",
                        "https://api.openweathermap.org",
                    ],
                },
            },
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: { policy: "cross-origin" },
        })
    );

    // Prevent HTTP parameter pollution
    app.use(hpp());

    // Custom input sanitization + MongoDB injection protection
    // (replaces express-mongo-sanitize which is incompatible with Express 5)
    app.use(sanitizeInput);

    // General rate limit on all API routes
    app.use("/api/", generalLimiter);

    // Disable X-Powered-By header
    app.disable("x-powered-by");
};
