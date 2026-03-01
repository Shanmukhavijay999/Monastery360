import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "monastery360_super_secret_key_change_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

// Extend Express Request to include user data
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                username: string;
                role: string;
            };
        }
    }
}

// Generate access token
export const generateAccessToken = (user: any) => {
    return jwt.sign(
        { id: String(user._id), username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN as any }
    );
};

// Generate refresh token
export const generateRefreshToken = (user: any) => {
    return jwt.sign(
        { id: String(user._id) },
        JWT_SECRET + "_refresh",
        { expiresIn: JWT_REFRESH_EXPIRES_IN as any }
    );
};

// Verify JWT middleware — protects routes
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            username: string;
            role: string;
        };
        req.user = decoded;
        next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            res.status(401).json({
                success: false,
                message: "Token expired. Please login again.",
                code: "TOKEN_EXPIRED",
            });
            return;
        }
        res.status(403).json({
            success: false,
            message: "Invalid token.",
        });
    }
};

// Optional auth — attaches user if token present, but doesn't block
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as {
                id: string;
                username: string;
                role: string;
            };
            req.user = decoded;
        } catch {
            // Token invalid — continue without user
        }
    }
    next();
};

// Role-based access control
export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Authentication required." });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: "Insufficient permissions." });
            return;
        }
        next();
    };
};
