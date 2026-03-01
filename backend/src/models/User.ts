import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    fullName: string;
    email: string;
    username: string;
    password: string;
    role: "user" | "admin";
    favorites: string[];
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username cannot exceed 30 characters"],
            match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // Don't include password in queries by default
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        favorites: {
            type: [String],
            default: [],
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err: any) {
        next(err);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

export default mongoose.model<IUser>("User", UserSchema);
