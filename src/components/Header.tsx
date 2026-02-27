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
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "@/lib/i18n";

const Header = ({ user, setUser, showAuth = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

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
      }, 300);
      return;
    }
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: MapPin, isRoute: true },
    { href: "#tours", label: t("nav.virtualTours"), icon: Archive, isRoute: false },
    { href: "#archives", label: t("nav.archives"), icon: Archive, isRoute: false },
    { href: "#events", label: t("nav.events"), icon: Calendar, isRoute: false },
    { href: "#audio", label: t("nav.audioGuide"), icon: AudioLines, isRoute: false },
    { href: "#quiz", label: t("nav.aiQuiz"), icon: Brain, isRoute: false },
    { href: "/reviews", label: t("nav.reviews"), icon: Star, isRoute: true },
  ];

  // Don't show the header on login/signup pages
  const hideHeader = ["/login", "/signup"].includes(location.pathname);
  if (hideHeader) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-orange-100/20 border-b border-orange-100/50 py-2"
          : "bg-background/80 backdrop-blur-md border-b border-border py-3"
        }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-200 group-hover:shadow-lg group-hover:shadow-orange-300 transition-all duration-300 group-hover:scale-105">
            <span className="text-sm font-black text-white">M360</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Monastery360
            </h1>
            <p className="text-[10px] text-gray-400 -mt-1 hidden sm:block">{t("header.tagline")}</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon, isRoute }) =>
            isRoute ? (
              <Link
                key={label}
                to={href}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${location.pathname === href
                    ? "text-orange-600 bg-orange-50 font-medium"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ) : (
              <button
                key={label}
                onClick={() => scrollToSection(href)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            )
          )}
        </nav>

        {/* Right Side — Language, Auth & CTA */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* CTA Button */}
          <Button
            onClick={() => scrollToSection("#tours")}
            className="hidden md:flex bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-200 gap-2 rounded-xl"
            size="sm"
          >
            <Sparkles className="w-4 h-4" />
            {t("nav.explore")}
          </Button>

          {/* Auth Buttons — Always visible */}
          {!user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 font-medium"
              >
                <LogIn className="w-3.5 h-3.5" />
                {t("nav.login")}
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md shadow-emerald-200 font-medium"
              >
                {t("nav.signup")}
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-100">
                <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white uppercase">
                    {user.username?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-sm font-medium text-deep-earth max-w-[80px] truncate">
                  {user.username}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-orange-200 text-orange-600 hover:bg-orange-50 rounded-lg gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t("nav.logout")}
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-orange-100 shadow-xl animate-fade-in-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ href, label, icon: Icon, isRoute }) =>
              isRoute ? (
                <Link
                  key={label}
                  to={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === href
                      ? "text-orange-600 bg-orange-50 font-medium"
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ) : (
                <button
                  key={label}
                  onClick={() => scrollToSection(href)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all text-left"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              )
            )}

            {/* Mobile Auth */}
            <div className="pt-3 mt-2 border-t border-gray-100">
              {!user ? (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center py-3 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 transition-all font-medium text-sm"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 text-center py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all font-medium text-sm"
                  >
                    {t("nav.signup")}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 rounded-xl">
                    <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white uppercase">
                        {user.username?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-deep-earth">{user.username}</p>
                      <p className="text-xs text-gray-400">{t("nav.signedIn")}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
