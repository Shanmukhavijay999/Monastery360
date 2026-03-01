import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Heart,
    Clock,
    Settings,
    LogOut,
    MapPin,
    Sparkles,
    Shield,
    ChevronRight,
    Star,
    Calendar,
    Compass,
    BookOpen,
    Headphones,
    X,
    Edit3,
    Check,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const MONASTERIES_DATA = [
    { id: "rumtek", name: "Rumtek Monastery", location: "East Sikkim", image: "/assets/rumtek.jpg", tradition: "Kagyu" },
    { id: "pemayangtse", name: "Pemayangtse Monastery", location: "West Sikkim", image: "/assets/pemayangtse.jpg", tradition: "Nyingma" },
    { id: "tashiding", name: "Tashiding Monastery", location: "West Sikkim", image: "/assets/tashiding.jpg", tradition: "Nyingma" },
    { id: "enchey", name: "Enchey Monastery", location: "Gangtok", image: "/assets/enchey.jpg", tradition: "Nyingma" },
    { id: "ralang", name: "Ralang Monastery", location: "South Sikkim", image: "/assets/ralang.jpg", tradition: "Kagyu" },
    { id: "dubdi", name: "Dubdi Monastery", location: "West Sikkim", image: "/assets/dubdi.jpg", tradition: "Nyingma" },
];

const tabs = [
    { id: "overview", label: "Overview", icon: Compass },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "activity", label: "Activity", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
];

const Dashboard = () => {
    const { user, logout, toggleFavorite, isFavorite, sessionTimeLeft } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);

    if (!user) return null;

    const favoriteMonasteries = MONASTERIES_DATA.filter((m) => isFavorite(m.id));

    const quickStats = [
        { label: "Favorites", value: user.favorites?.length || 0, icon: Heart, color: "text-rose-500" },
        { label: "Tours Taken", value: 12, icon: Compass, color: "text-blue-500" },
        { label: "Quizzes Played", value: 5, icon: BookOpen, color: "text-amber-500" },
        { label: "Audio Guides", value: 8, icon: Headphones, color: "text-emerald-500" },
    ];

    const recentActivity = [
        { action: "Explored virtual tour", target: "Rumtek Monastery", time: "2 hours ago", icon: Compass },
        { action: "Completed quiz", target: "Monastery Knowledge", time: "5 hours ago", icon: Star },
        { action: "Listened to guide", target: "Pemayangtse History", time: "1 day ago", icon: Headphones },
        { action: "Saved favorite", target: "Tashiding Monastery", time: "2 days ago", icon: Heart },
        { action: "Generated trip plan", target: "5-Day Pilgrimage", time: "3 days ago", icon: Calendar },
    ];

    return (
        <section className="min-h-screen bg-background pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <ScrollReveal>
                    {/* Profile Header */}
                    <div className="glass-strong rounded-3xl p-8 md:p-10 mb-8 border border-border/60 relative overflow-hidden">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

                        <div className="relative flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-orange-200/30 dark:shadow-orange-900/30">
                                {user.fullName?.[0]?.toUpperCase() || user.username[0]?.toUpperCase()}
                            </div>

                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-3xl font-black text-foreground">
                                    {user.fullName || user.username}
                                </h1>
                                <p className="text-muted-foreground mt-1">@{user.username}</p>
                                {user.email && (
                                    <p className="text-sm text-muted-foreground/70 mt-0.5">{user.email}</p>
                                )}
                                <div className="flex items-center gap-3 mt-3 justify-center md:justify-start">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium">
                                        <Shield className="w-3 h-3" />
                                        {user.role === "admin" ? "Admin" : "Explorer"}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                        <Sparkles className="w-3 h-3" />
                                        AI Features Enabled
                                    </span>
                                </div>
                            </div>

                            {/* Session timer & Logout */}
                            <div className="flex flex-col items-end gap-2">
                                {sessionTimeLeft !== null && sessionTimeLeft < 300 && (
                                    <span className="text-xs text-amber-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Session expires in {Math.floor(sessionTimeLeft / 60)}m
                                    </span>
                                )}
                                <button
                                    onClick={() => { logout(); navigate("/"); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-medium text-foreground transition-all border border-border/60"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Quick Stats */}
                <ScrollReveal delay={0.1}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {quickStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card rounded-2xl p-5 border border-border/60 hover:border-primary/30 transition-all group cursor-default"
                            >
                                <stat.icon className={`w-5 h-5 ${stat.color} mb-3 group-hover:scale-110 transition-transform`} />
                                <p className="text-2xl font-black text-foreground tabular-nums">{stat.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </ScrollReveal>

                {/* Tabs */}
                <ScrollReveal delay={0.2}>
                    <div className="flex gap-1 bg-secondary/50 p-1 rounded-2xl mb-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </ScrollReveal>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Recent Activity */}
                                <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-border/60">
                                        <h3 className="font-bold text-foreground">Recent Activity</h3>
                                    </div>
                                    <div className="divide-y divide-border/40">
                                        {recentActivity.map((item, i) => (
                                            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
                                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <item.icon className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-foreground font-medium truncate">
                                                        {item.action}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{item.target}</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground/70 whitespace-nowrap">
                                                    {item.time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { label: "Virtual Tours", desc: "Explore sacred spaces", icon: Compass, path: "/#virtual-tours" },
                                        { label: "AI Trip Planner", desc: "Plan your pilgrimage", icon: MapPin, path: "/#ai-trip-planner" },
                                        { label: "Take a Quiz", desc: "Test your knowledge", icon: Star, path: "/#ai-quiz" },
                                    ].map((action) => (
                                        <button
                                            key={action.label}
                                            onClick={() => navigate(action.path)}
                                            className="bg-card rounded-2xl p-5 border border-border/60 text-left hover:border-primary/40 hover:shadow-lg transition-all group"
                                        >
                                            <action.icon className="w-5 h-5 text-primary mb-3 group-hover:scale-110 transition-transform" />
                                            <p className="font-semibold text-foreground text-sm">{action.label}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Favorites Tab */}
                        {activeTab === "favorites" && (
                            <div>
                                {favoriteMonasteries.length === 0 ? (
                                    <div className="bg-card rounded-2xl border border-border/60 p-12 text-center">
                                        <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-foreground mb-2">No favorites yet</h3>
                                        <p className="text-sm text-muted-foreground mb-6">
                                            Explore monasteries and click the heart icon to save them here.
                                        </p>
                                        <button
                                            onClick={() => navigate("/#monastery-map")}
                                            className="px-6 py-3 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Explore Monasteries
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {favoriteMonasteries.map((m) => (
                                            <motion.div
                                                key={m.id}
                                                layout
                                                className="bg-card rounded-2xl border border-border/60 overflow-hidden group hover:shadow-lg transition-all"
                                            >
                                                <div className="aspect-video bg-secondary relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                                                        <MapPin className="w-8 h-8 text-foreground/30" />
                                                    </div>
                                                    <button
                                                        onClick={() => toggleFavorite(m.id)}
                                                        className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                                    >
                                                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-bold text-foreground text-sm">{m.name}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {m.location}
                                                    </p>
                                                    <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                                                        {m.tradition}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Activity Tab */}
                        {activeTab === "activity" && (
                            <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
                                <div className="px-6 py-4 border-b border-border/60">
                                    <h3 className="font-bold text-foreground">Full Activity History</h3>
                                </div>
                                <div className="divide-y divide-border/40">
                                    {[...recentActivity, ...recentActivity].map((item, i) => (
                                        <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <item.icon className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground font-medium">{item.action}</p>
                                                <p className="text-xs text-muted-foreground">{item.target}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground/70">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === "settings" && (
                            <div className="space-y-4">
                                <div className="bg-card rounded-2xl border border-border/60 p-6">
                                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Profile Information
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Full Name", value: user.fullName || "—" },
                                            { label: "Username", value: `@${user.username}` },
                                            { label: "Email", value: user.email || "—" },
                                            { label: "Role", value: user.role || "Explorer" },
                                        ].map((field) => (
                                            <div key={field.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                                                <span className="text-sm text-muted-foreground">{field.label}</span>
                                                <span className="text-sm font-medium text-foreground">{field.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-card rounded-2xl border border-border/60 p-6">
                                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                        <Shield className="w-4 h-4" /> Security
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Session Timeout</p>
                                                <p className="text-xs text-muted-foreground">Auto-logout after 30 min inactivity</p>
                                            </div>
                                            <span className="text-xs text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full font-medium">Active</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">JWT Authentication</p>
                                                <p className="text-xs text-muted-foreground">Token-based secure access</p>
                                            </div>
                                            <span className="text-xs text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full font-medium">Enabled</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Password Encryption</p>
                                                <p className="text-xs text-muted-foreground">bcrypt with 12 salt rounds</p>
                                            </div>
                                            <span className="text-xs text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full font-medium">Secured</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { logout(); navigate("/"); }}
                                    className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-medium text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Dashboard;
