import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
    apiLogin,
    apiSignup,
    apiGetMe,
    apiToggleFavorite,
    logout as apiLogout,
    getAccessToken,
} from "@/lib/auth";

interface AuthUser {
    id?: string;
    fullName: string;
    username: string;
    email?: string;
    role?: string;
    favorites?: string[];
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
    signup: (
        fullName: string,
        email: string,
        username: string,
        password: string
    ) => Promise<{ success: boolean; message: string; field?: string }>;
    logout: () => void;
    toggleFavorite: (monasteryId: string) => Promise<void>;
    isFavorite: (monasteryId: string) => boolean;
    sessionTimeLeft: number | null; // seconds until session timeout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout: 30 minutes of inactivity
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [sessionTimeLeft, setSessionTimeLeft] = useState<number | null>(null);

    // Restore session on mount
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const token = getAccessToken();
                const savedSession = localStorage.getItem("monastery360_session");

                if (token && token !== "local") {
                    // Real JWT — verify with backend
                    const userData = await apiGetMe();
                    if (userData) {
                        setUser(userData);
                    } else {
                        apiLogout();
                    }
                } else if (savedSession) {
                    // Local/offline session
                    setUser(JSON.parse(savedSession));
                }
            } catch {
                // Session expired or invalid
                apiLogout();
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    // Track user activity for session timeout
    useEffect(() => {
        if (!user) return;

        const trackActivity = () => setLastActivity(Date.now());
        const events = ["mousedown", "keydown", "scroll", "touchstart"];
        events.forEach((evt) => window.addEventListener(evt, trackActivity, { passive: true }));

        return () => {
            events.forEach((evt) => window.removeEventListener(evt, trackActivity));
        };
    }, [user]);

    // Session timeout checker
    useEffect(() => {
        if (!user) {
            setSessionTimeLeft(null);
            return;
        }

        const interval = setInterval(() => {
            const elapsed = Date.now() - lastActivity;
            const remaining = Math.max(0, SESSION_TIMEOUT_MS - elapsed);
            setSessionTimeLeft(Math.floor(remaining / 1000));

            if (remaining <= 0) {
                // Session timed out
                handleLogout();
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [user, lastActivity]);

    const handleLogin = useCallback(
        async (username: string, password: string) => {
            const result = await apiLogin(username, password);
            if (result.success && result.data) {
                setUser(result.data.user);
                setLastActivity(Date.now());
            }
            return { success: result.success, message: result.message };
        },
        []
    );

    const handleSignup = useCallback(
        async (fullName: string, email: string, username: string, password: string) => {
            const result = await apiSignup(fullName, email, username, password);
            if (result.success && result.data) {
                setUser(result.data.user);
                setLastActivity(Date.now());
            }
            return { success: result.success, message: result.message, field: result.field };
        },
        []
    );

    const handleLogout = useCallback(() => {
        setUser(null);
        apiLogout();
    }, []);

    const toggleFavorite = useCallback(
        async (monasteryId: string) => {
            if (!user) return;
            const newFavorites = await apiToggleFavorite(monasteryId);
            setUser((prev) => (prev ? { ...prev, favorites: newFavorites } : null));
        },
        [user]
    );

    const isFavorite = useCallback(
        (monasteryId: string) => {
            return user?.favorites?.includes(monasteryId) || false;
        },
        [user?.favorites]
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login: handleLogin,
                signup: handleSignup,
                logout: handleLogout,
                toggleFavorite,
                isFavorite,
                sessionTimeLeft,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
