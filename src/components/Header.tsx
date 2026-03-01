import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  AudioLines,
  Archive,
  Star,
  LogIn,
  LogOut,
  Menu,
  X,
  Brain,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ user, setUser, showAuth = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const scrollToSection = (id: string) => {
    setIsMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 400);
      return;
    }
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: MapPin, isRoute: true },
    { href: "/tours", label: t("nav.virtualTours"), icon: Archive, isRoute: true },
    { href: "/archives", label: t("nav.archives"), icon: Archive, isRoute: true },
    { href: "/events", label: t("nav.events"), icon: Calendar, isRoute: true },
    { href: "/audio", label: t("nav.audioGuide"), icon: AudioLines, isRoute: true },
    { href: "/quiz", label: t("nav.aiQuiz"), icon: Brain, isRoute: true },
    { href: "/reviews", label: t("nav.reviews"), icon: Star, isRoute: true },
  ];

  const hideHeader = ["/login", "/signup"].includes(location.pathname);
  if (hideHeader) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-apple ${isScrolled
          ? "glass-strong shadow-[0_1px_0_0_hsl(var(--border))]"
          : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-500 group-hover:scale-105">
              <span className="text-xs font-black text-white tracking-tight">M360</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Monastery<span className="text-gradient-gold">360</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ href, label, isRoute }) =>
              isRoute ? (
                <Link
                  key={label}
                  to={href}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-300 ${location.pathname === href
                    ? "text-foreground bg-foreground/5"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {label}
                </Link>
              ) : (
                <button
                  key={label}
                  onClick={() => scrollToSection(href)}
                  className="px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg transition-all duration-300"
                >
                  {label}
                </button>
              )
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-300"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {resolvedTheme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* CTA Button */}
            <Button
              onClick={() => navigate("/tours")}
              className="hidden md:flex bg-foreground text-background hover:bg-foreground/90 text-xs font-semibold px-5 py-2 h-8 rounded-full gap-1.5 transition-all duration-300 shadow-none"
              size="sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t("nav.explore")}
            </Button>

            {/* Auth Buttons */}
            {!user ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full transition-all duration-300"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300"
                >
                  {t("nav.signup")}
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white uppercase">
                      {user.username?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-foreground max-w-[80px] truncate">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-300"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-foreground/5 rounded-full transition-all"
            >
              <AnimatePresence mode="wait">
                {isMobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Menu Content */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative pt-20 px-6 pb-8 flex flex-col gap-1"
            >
              {navLinks.map(({ href, label, icon: Icon, isRoute }, index) =>
                isRoute ? (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      to={href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-lg font-medium transition-all ${location.pathname === href
                        ? "text-foreground bg-foreground/5"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => scrollToSection(href)}
                      className="flex items-center gap-3 px-4 py-3.5 text-muted-foreground hover:text-foreground rounded-2xl transition-all text-left text-lg font-medium w-full"
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  </motion.div>
                )
              )}

              {/* Mobile Auth */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="pt-4 mt-4 border-t border-border"
              >
                {!user ? (
                  <div className="flex gap-3">
                    <Link
                      to="/login"
                      className="flex-1 text-center py-3 border border-border text-foreground rounded-2xl hover:bg-foreground/5 transition-all font-medium"
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      to="/signup"
                      className="flex-1 text-center py-3 bg-foreground text-background rounded-2xl hover:bg-foreground/90 transition-all font-medium"
                    >
                      {t("nav.signup")}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 bg-foreground/5 rounded-2xl">
                      <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white uppercase">
                          {user.username?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{t("nav.signedIn")}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-2xl transition-all w-full font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
