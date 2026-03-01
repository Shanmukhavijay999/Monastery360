import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../middleware/auth";
import { generateOtp, saveOtp, verifyOtp, sendOtpEmail } from "../services/otpService";

const JWT_SECRET = process.env.JWT_SECRET || "monastery360_super_secret_key_change_in_production";

// ─── SIGNUP ──────────────────────────────────────────

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, username, password } = req.body;

        // Validate required fields
        if (!fullName || !email || !username || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required: fullName, email, username, password",
            });
            return;
        }

        // Password strength check
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
            return;
        }

        // Check for existing user
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() },
            ],
        });

        if (existingUser) {
            const field = existingUser.email === email.toLowerCase() ? "email" : "username";
            res.status(409).json({
                success: false,
                message: `An account with this ${field} already exists.`,
                field,
            });
            return;
        }

        // Create user (password is auto-hashed by pre-save hook)
        const user = await User.create({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            username: username.trim(),
            password,
        });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(201).json({
            success: true,
            message: "Account created successfully!",
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    favorites: user.favorites,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (err: any) {
        // Handle Mongoose validation errors
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e: any) => e.message);
            res.status(400).json({
                success: false,
                message: messages.join(". "),
            });
            return;
        }

        console.error("Signup error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error. Please try again.",
        });
    }
};

// ─── SEND SIGNUP OTP ─────────────────────────────────────────────────────────

export const sendSignupOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, username, password } = req.body;

        if (!fullName || !email || !username || !password) {
            res.status(400).json({ success: false, message: "All fields are required." });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({ success: false, message: "Enter a valid email address." });
            return;
        }

        // Check duplicates before sending OTP
        const existing = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
        });
        if (existing) {
            const field = existing.email === email.toLowerCase() ? "email" : "username";
            res.status(409).json({ success: false, message: `An account with this ${field} already exists.`, field });
            return;
        }

        const otp = generateOtp();
        saveOtp(email, otp, { fullName: fullName.trim(), email: email.trim().toLowerCase(), username: username.trim(), password });

        await sendOtpEmail(email, otp, "signup");

        const isOAuth2 = !!process.env.SMTP_REFRESH_TOKEN;
        const isDev = (!process.env.SMTP_PASS || process.env.SMTP_PASS === "your_16_char_app_password_here") && !isOAuth2;

        console.log(`Sending /send-otp. isDev: ${isDev}`);

        res.json({
            success: true,
            message: `Verification code sent to ${email}. Check your inbox.`,
            ...(isDev ? { devOtp: otp } : {})
        });
    } catch (err: any) {
        console.error("sendSignupOtp error:", err);
        res.status(500).json({ success: false, message: "Failed to send OTP. Please check your email and try again." });
    }
};

// ─── VERIFY OTP & CREATE ACCOUNT ─────────────────────────────────────────────

export const verifyAndCreateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ success: false, message: "Email and OTP are required." });
            return;
        }

        const entry = verifyOtp(email, otp);
        if (!entry) {
            res.status(400).json({ success: false, message: "Invalid or expired OTP. Please request a new code." });
            return;
        }

        const { pendingData } = entry;
        if (!pendingData) {
            res.status(400).json({ success: false, message: "Signup session expired. Please start over." });
            return;
        }

        // Final duplicate check
        const existing = await User.findOne({
            $or: [{ email: pendingData.email }, { username: pendingData.username }],
        });
        if (existing) {
            const field = existing.email === pendingData.email ? "email" : "username";
            res.status(409).json({ success: false, message: `An account with this ${field} already exists.`, field });
            return;
        }

        const user = await User.create(pendingData);
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(201).json({
            success: true,
            message: "Account created successfully! Email verified. 🎉",
            data: {
                user: { id: user._id, fullName: user.fullName, username: user.username, email: user.email, role: user.role, favorites: user.favorites },
                accessToken,
                refreshToken,
            },
        });
    } catch (err: any) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e: any) => e.message);
            res.status(400).json({ success: false, message: messages.join(". ") });
            return;
        }
        console.error("verifyAndCreateAccount error:", err);
        res.status(500).json({ success: false, message: "Internal server error. Please try again." });
    }
};

// ─── SEND LOGIN OTP ───────────────────────────────────────────────────────────

export const sendLoginOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ success: false, message: "Username and password are required." });
            return;
        }

        const user = await User.findOne({
            $or: [{ username: username.trim() }, { email: username.trim().toLowerCase() }],
        }).select("+password");

        // Always respond the same way to prevent user enumeration
        const isMatch = user ? await user.comparePassword(password) : false;
        if (!user || !isMatch) {
            res.status(401).json({ success: false, message: "Invalid credentials. Please check your username and password." });
            return;
        }

        const otp = generateOtp();
        saveOtp(user.email, otp);
        await sendOtpEmail(user.email, otp, "login");

        // Return masked email for UI display
        const masked = user.email.replace(/(.)(.+)(@.+)/, (_, a, b, c) => a + "*".repeat(Math.min(b.length, 5)) + c);
        const isOAuth2 = !!process.env.SMTP_REFRESH_TOKEN;
        const isDev = (!process.env.SMTP_PASS || process.env.SMTP_PASS === "your_16_char_app_password_here") && !isOAuth2;
        res.json({
            success: true,
            message: `Verification code sent to ${masked}.`,
            maskedEmail: masked,
            ...(isDev ? { devOtp: otp } : {})
        });
    } catch (err) {
        console.error("sendLoginOtp error:", err);
        res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
    }
};

// ─── VERIFY LOGIN OTP ─────────────────────────────────────────────────────────

export const verifyLoginOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, otp } = req.body;
        if (!username || !otp) {
            res.status(400).json({ success: false, message: "Username and OTP are required." });
            return;
        }

        const user = await User.findOne({
            $or: [{ username: username.trim() }, { email: username.trim().toLowerCase() }],
        });
        if (!user) {
            res.status(401).json({ success: false, message: "User not found." });
            return;
        }

        const entry = verifyOtp(user.email, otp);
        if (!entry) {
            res.status(400).json({ success: false, message: "Invalid or expired OTP. Please request a new code." });
            return;
        }

        user.lastLogin = new Date();
        await user.save({ validateModifiedOnly: true });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            success: true,
            message: "Login successful! Welcome back. 🙏",
            data: {
                user: { id: user._id, fullName: user.fullName, username: user.username, email: user.email, role: user.role, favorites: user.favorites },
                accessToken,
                refreshToken,
            },
        });
    } catch (err) {
        console.error("verifyLoginOtp error:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ─── LOGIN ───────────────────────────────────────────

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: "Username and password are required.",
            });
            return;
        }

        // Find user and include password field
        const user = await User.findOne({
            $or: [
                { username: username.trim() },
                { email: username.trim().toLowerCase() },
            ],
        }).select("+password");

        if (!user) {
            // Don't reveal whether username or email exists
            res.status(401).json({
                success: false,
                message: "Invalid credentials. Please check your username and password.",
            });
            return;
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials. Please check your username and password.",
            });
            return;
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateModifiedOnly: true });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            success: true,
            message: "Login successful!",
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    favorites: user.favorites,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error. Please try again.",
        });
    }
};

// ─── REFRESH TOKEN ───────────────────────────────────

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            res.status(400).json({
                success: false,
                message: "Refresh token is required.",
            });
            return;
        }

        // Verify refresh token
        const decoded = jwt.verify(token, JWT_SECRET + "_refresh") as { id: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found. Please login again.",
            });
            return;
        }

        // Issue new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        res.json({
            success: true,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (err: any) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token. Please login again.",
        });
    }
};

// ─── GET CURRENT USER ────────────────────────────────

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    favorites: user.favorites,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                },
            },
        });
    } catch (err) {
        console.error("GetMe error:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ─── UPDATE PROFILE ──────────────────────────────────

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email } = req.body;
        const user = await User.findById(req.user?.id);

        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        if (fullName) user.fullName = fullName.trim();
        if (email) {
            // Check email uniqueness
            const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
            if (existing) {
                res.status(409).json({ success: false, message: "Email already in use." });
                return;
            }
            user.email = email.toLowerCase();
        }

        await user.save();

        res.json({
            success: true,
            message: "Profile updated.",
            data: { user },
        });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ─── TOGGLE FAVORITE ─────────────────────────────────

export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
        const { monasteryId } = req.body;
        if (!monasteryId) {
            res.status(400).json({ success: false, message: "monasteryId is required." });
            return;
        }

        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        const index = user.favorites.indexOf(monasteryId);
        if (index > -1) {
            user.favorites.splice(index, 1); // Remove
        } else {
            user.favorites.push(monasteryId); // Add
        }

        await user.save();

        res.json({
            success: true,
            message: index > -1 ? "Removed from favorites." : "Added to favorites.",
            data: { favorites: user.favorites },
        });
    } catch (err) {
        console.error("Toggle favorite error:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};
