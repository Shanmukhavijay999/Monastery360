// Auth API client — connects frontend to backend JWT system
// Falls back to localStorage for when backend is unavailable

const API_BASE = import.meta.env.VITE_API_URL || "https://monastery360-0f3x.onrender.com/api";

interface AuthUser {
    id?: string;
    fullName: string;
    username: string;
    email?: string;
    role?: string;
    favorites?: string[];
}

interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
    };
    field?: string;
}

// Token storage
const TOKEN_KEY = "monastery360_access_token";
const REFRESH_KEY = "monastery360_refresh_token";
const SESSION_KEY = "monastery360_session";
const USERS_KEY = "monastery360_users";

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_KEY);

export const setTokens = (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(SESSION_KEY);
};

// Authenticated fetch wrapper
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getAccessToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(`${API_BASE}${url}`, { ...options, headers });

    // If token expired, try refresh
    if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            headers["Authorization"] = `Bearer ${getAccessToken()}`;
            response = await fetch(`${API_BASE}${url}`, { ...options, headers });
        }
    }

    return response;
};

// Refresh access token
const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
        const res = await fetch(`${API_BASE}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
            clearTokens();
            return false;
        }

        const data = await res.json();
        if (data.success) {
            setTokens(data.data.accessToken, data.data.refreshToken);
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

// ─── Auth API Functions ──────────────────────────────

export const apiSignup = async (
    fullName: string,
    email: string,
    username: string,
    password: string
): Promise<AuthResponse> => {
    try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, username, password }),
        });
        const data = await res.json();

        if (data.success && data.data) {
            setTokens(data.data.accessToken, data.data.refreshToken);
            localStorage.setItem(SESSION_KEY, JSON.stringify(data.data.user));
        }
        return data;
    } catch {
        // Fallback to localStorage when backend is unavailable
        return localSignup(fullName, email, username, password);
    }
};

export const apiLogin = async (
    username: string,
    password: string
): Promise<AuthResponse> => {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (data.success && data.data) {
            setTokens(data.data.accessToken, data.data.refreshToken);
            localStorage.setItem(SESSION_KEY, JSON.stringify(data.data.user));
        }
        return data;
    } catch {
        // Fallback to localStorage when backend is unavailable
        return localLogin(username, password);
    }
};

export const apiGetMe = async (): Promise<AuthUser | null> => {
    try {
        const res = await authFetch("/auth/me");
        const data = await res.json();
        if (data.success) return data.data.user;
        return null;
    } catch {
        // Fallback
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }
};

export const apiToggleFavorite = async (monasteryId: string): Promise<string[]> => {
    try {
        const res = await authFetch("/auth/favorites/toggle", {
            method: "POST",
            body: JSON.stringify({ monasteryId }),
        });
        const data = await res.json();
        if (data.success) return data.data.favorites;
        return [];
    } catch {
        // Fallback: manage favorites locally
        return localToggleFavorite(monasteryId);
    }
};

export const logout = () => {
    clearTokens();
};

// ─── localStorage Fallback (when backend is unavailable) ─────

function localSignup(
    fullName: string,
    email: string,
    username: string,
    password: string
): AuthResponse {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    const existingUsername = storedUsers.find(
        (u: any) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (existingUsername) {
        return { success: false, message: "Username already taken.", field: "username" };
    }

    const existingEmail = storedUsers.find(
        (u: any) => u.email?.toLowerCase() === email.trim().toLowerCase()
    );
    if (existingEmail) {
        return { success: false, message: "Email already registered.", field: "email" };
    }

    const newUser = {
        username: username.trim(),
        password,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        favorites: [],
        createdAt: new Date().toISOString(),
    };
    storedUsers.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(storedUsers));

    const userData: AuthUser = {
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        favorites: [],
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));

    return {
        success: true,
        message: "Account created (offline mode).",
        data: { user: userData, accessToken: "local", refreshToken: "local" },
    };
}

function localLogin(username: string, password: string): AuthResponse {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    const user = storedUsers.find(
        (u: any) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!user) {
        return { success: false, message: "No account found with this username." };
    }
    if (user.password !== password) {
        return { success: false, message: "Incorrect password." };
    }

    const userData: AuthUser = {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        favorites: user.favorites || [],
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));

    return {
        success: true,
        message: "Login successful (offline mode).",
        data: { user: userData, accessToken: "local", refreshToken: "local" },
    };
}

function localToggleFavorite(monasteryId: string): string[] {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return [];

    const user = JSON.parse(session);
    const favorites: string[] = user.favorites || [];
    const index = favorites.indexOf(monasteryId);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(monasteryId);
    }

    user.favorites = favorites;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));

    // Also update in users store
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const storedUser = users.find((u: any) => u.username === user.username);
    if (storedUser) {
        storedUser.favorites = favorites;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    return favorites;
}
