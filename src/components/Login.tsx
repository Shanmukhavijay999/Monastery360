import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiLogin } from "@/lib/auth";
import {
  LogIn, User, Lock, Sparkles, Eye, EyeOff,
  ArrowRight, Mountain, Shield, Mail, KeyRound,
  RefreshCw, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.PROD ? "https://monastery360-0f3x.onrender.com/api" : "/api";

type Step = "credentials" | "otp" | "success";

const Login = ({ setUser }: { setUser?: any }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  // Step state
  const [step, setStep] = useState<Step>("credentials");
  const [maskedEmail, setMaskedEmail] = useState("");

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsLoading(true);
    setErrors({});
    try {
      const res = await fetch(`${API}/auth/login/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrors({ general: data.message });
        toast({ title: "Error", description: data.message, variant: "destructive" });
      } else {
        setMaskedEmail(data.maskedEmail);
        setStep("otp");
        setResendCooldown(60);
        toast({ title: "OTP Sent! 📧", description: `Check ${data.maskedEmail}` });
        if (data.devOtp) {
          setTimeout(() => {
            toast({ title: "🛠️ DEV MODE OTP (No SMTP)", description: data.devOtp, duration: 20000 });
          }, 800);
        }
        setTimeout(() => otpRefs.current[0]?.focus(), 200);
      }
    } catch {
      // Backend server is not running
      setErrors({ general: "⚠️ Cannot connect to server. Please start the backend server (npm run dev in /backend) and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handling ────────────────────────────────────────────────────
  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setErrors({ otp: "Enter all 6 digits" }); return; }

    setIsLoading(true);
    setErrors({});
    try {
      const res = await fetch(`${API}/auth/login/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), otp: code }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrors({ otp: data.message });
        toast({ title: "Verification failed", description: data.message, variant: "destructive" });
      } else {
        // Properly store tokens from backend response
        if (data.data?.accessToken) {
          localStorage.setItem("monastery360_access_token", data.data.accessToken);
          localStorage.setItem("monastery360_refresh_token", data.data.refreshToken);
          localStorage.setItem("monastery360_session", JSON.stringify(data.data.user));
        }
        setStep("success");
        toast({ title: "Welcome back! 🙏", description: data.message });
        setTimeout(() => {
          const from = (location.state as any)?.from || "/";
          navigate(from);
        }, 1500);
      }
    } catch {
      setErrors({ otp: "⚠️ Cannot connect to server. Please ensure the backend is running." });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/auth/login/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        setOtp(["", "", "", "", "", ""]);
        setResendCooldown(60);
        toast({ title: "New OTP sent! 📧", description: `Check ${maskedEmail}` });
        if (data.devOtp) {
          setTimeout(() => {
            toast({ title: "🛠️ DEV MODE OTP (No SMTP)", description: data.devOtp, duration: 20000 });
          }, 800);
        }
        otpRefs.current[0]?.focus();
      } else {
        toast({ title: "Failed to resend", description: data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "⚠️ Cannot connect to server.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex relative overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 relative items-center justify-center p-12">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-yellow-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 border border-white/10 rounded-full" />
        <div className="relative z-10 text-white max-w-md">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-white/20">
            <Mountain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            Welcome to<span className="block text-yellow-200">Monastery360</span>
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Explore over 200 ancient monasteries of Sikkim through immersive virtual tours,
            AI-powered insights, and help preserve Himalayan heritage.
          </p>
          <div className="flex flex-col gap-3">
            {["🏛️ Access 200+ monasteries", "🤖 AI-powered spiritual guide", "🎧 Multi-language audio tours", "📜 Digital manuscript archives", "🔐 Email-verified secure login"].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-lg font-black text-white">M360</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Monastery360</h2>
          </div>

          <AnimatePresence mode="wait">

            {/* ── STEP 1: Credentials ───────────────────────────────── */}
            {step === "credentials" && (
              <motion.form key="credentials" onSubmit={handleSendOtp}
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl shadow-orange-100/50 border border-orange-100/50"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                  <p className="text-sm text-gray-400 mt-1">Sign in — an OTP will be sent to your email</p>
                </div>

                {errors.general && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Username */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Username or Email</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input id="login-username" type="text" placeholder="Enter username or email"
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.username ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"}`}
                      value={username} onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: "" })); }}
                    />
                  </div>
                  {errors.username && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><Shield className="w-3 h-3" />{errors.username}</p>}
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input id="login-password" type={showPassword ? "text" : "password"} placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.password ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"}`}
                      value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><Shield className="w-3 h-3" />{errors.password}</p>}
                </div>

                {/* MFA notice */}
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
                  <Mail className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">A <strong>6-digit OTP</strong> will be sent to your registered email for extra security.</p>
                </div>

                <Button id="login-submit" type="submit" disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 rounded-xl shadow-lg shadow-orange-200 text-base font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 gap-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP…</div>
                  ) : (<><Sparkles className="w-4 h-4" />Continue<ArrowRight className="w-4 h-4" /></>)}
                </Button>

                <p className="text-sm text-gray-500 text-center mt-6">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-orange-500 font-semibold hover:text-orange-600 inline-flex items-center gap-1">
                    Create Account <ArrowRight className="w-3 h-3" />
                  </Link>
                </p>
              </motion.form>
            )}

            {/* ── STEP 2: OTP Entry ──────────────────────────────────── */}
            {step === "otp" && (
              <motion.form key="otp" onSubmit={handleVerifyOtp}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl shadow-orange-100/50 border border-orange-100/50"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                    <KeyRound className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Check Your Email</h2>
                  <p className="text-sm text-gray-500 mt-1">Enter the 6-digit code sent to</p>
                  <p className="text-sm font-semibold text-orange-600 mt-0.5">{maskedEmail}</p>
                </div>

                {/* OTP boxes */}
                <div className="flex gap-2 justify-center mb-6" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all bg-white/80 ${digit ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200"} focus:border-orange-500 focus:ring-2 focus:ring-orange-100`}
                    />
                  ))}
                </div>

                {errors.otp && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600">{errors.otp}</p>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-center">
                  <p className="text-xs text-amber-700">⏰ This code expires in <strong>10 minutes</strong>. Check your spam folder if not received.</p>
                </div>

                <Button id="otp-submit" type="submit" disabled={isLoading || otp.join("").length !== 6}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 rounded-xl shadow-lg shadow-orange-200 text-base font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 gap-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</div>
                  ) : (<><Shield className="w-4 h-4" />Verify & Sign In<ArrowRight className="w-4 h-4" /></>)}
                </Button>

                <div className="flex items-center justify-between mt-4 text-sm">
                  <button type="button" onClick={() => { setStep("credentials"); setOtp(["", "", "", "", "", ""]); setErrors({}); }}
                    className="text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
                    ← Back
                  </button>
                  <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || isLoading}
                    className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-medium disabled:opacity-50 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </motion.form>
            )}

            {/* ── STEP 3: Success ────────────────────────────────────── */}
            {step === "success" && (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-orange-100/50 border border-orange-100/50 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Successful!</h2>
                <p className="text-gray-500 text-sm">Redirecting you to your journey…</p>
                <div className="mt-4 w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
              </motion.div>
            )}

          </AnimatePresence>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
