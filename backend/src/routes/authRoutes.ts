import { Router } from "express";
import {
    signup,
    login,
    refreshToken,
    getMe,
    updateProfile,
    toggleFavorite,
    sendSignupOtp,
    verifyAndCreateAccount,
    sendLoginOtp,
    verifyLoginOtp,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";
import { authLimiter } from "../middleware/security";

const router = Router();

// ─── MFA / OTP Routes ──────────────────────────────────
router.post("/signup/send-otp", authLimiter, sendSignupOtp);          // Step 1: send OTP to email
router.post("/signup/verify-otp", authLimiter, verifyAndCreateAccount); // Step 2: verify OTP & create account
router.post("/login/send-otp", authLimiter, sendLoginOtp);           // Step 1: verify creds & send OTP
router.post("/login/verify-otp", authLimiter, verifyLoginOtp);         // Step 2: verify OTP & issue tokens

// ─── Legacy Routes (kept for backward compatibility) ───
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/refresh-token", refreshToken);

// ─── Protected Routes ───────────────────────────────────
router.get("/me", authenticateToken, getMe);
router.put("/profile", authenticateToken, updateProfile);
router.post("/favorites/toggle", authenticateToken, toggleFavorite);

export default router;
