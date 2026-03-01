import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiSignup } from "@/lib/auth";
import {
  UserPlus, User, Lock, Sparkles, Eye, EyeOff,
  ArrowRight, Mountain, Shield, Mail, CheckCircle2,
  XCircle, KeyRound, RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = "/api";

type Step = "form" | "otp" | "success";

const Signup = ({ setUser }: { setUser?: any }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup } = useAuth();

  const [step, setStep] = useState<Step>("form");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Password strength
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-400" };
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-400" };
    if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-400" };
    if (score <= 4) return { score: 4, label: "Strong", color: "bg-emerald-400" };
    return { score: 5, label: "Excellent", color: "bg-green-500" };
  }, [password]);

  const passwordRules = useMemo(() => ([
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ]), [password]);

  // Validation
  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (!username.trim()) e.username = "Username is required";
    else if (username.trim().length < 3) e.username = "Username must be at least 3 characters";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!agreeTerms) e.terms = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({ title: "Please fix the errors", description: "Check highlighted fields.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const res = await fetch(`${API}/auth/signup/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), username: username.trim(), password }),
      });
      const data = await res.json();
      if (!data.success) {
        if (data.field) setErrors({ [data.field]: data.message });
        else setErrors({ general: data.message });
        toast({ title: "Error", description: data.message, variant: "destructive" });
      } else {
        setStep("otp");
        setResendCooldown(60);
        toast({ title: "OTP Sent! 📧", description: `Check your inbox at ${email}` });
        if (data.devOtp) {
          setTimeout(() => {
            toast({ title: "🛠️ DEV MODE OTP (No SMTP)", description: data.devOtp, duration: 20000 });
          }, 800);
        }
        setTimeout(() => otpRefs.current[0]?.focus(), 200);
      }
    } catch {
      // Backend server is not running — show helpful error
      setErrors({ general: "⚠️ Cannot connect to server. Please start the backend server (run: npm run dev inside the /backend folder)." });
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handling ────────────────────────────────────────────────────
  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) { setOtp(text.split("")); otpRefs.current[5]?.focus(); }
  };

  // ── Step 2: Verify OTP & Create Account ─────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setErrors({ otp: "Enter all 6 digits" }); return; }
    setIsLoading(true);
    setErrors({});
    try {
      const res = await fetch(`${API}/auth/signup/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: code }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrors({ otp: data.message });
        toast({ title: "Verification failed", description: data.message, variant: "destructive" });
      } else {
        // Store tokens so user is immediately logged in
        if (data.data?.accessToken) {
          localStorage.setItem("monastery360_access_token", data.data.accessToken);
          localStorage.setItem("monastery360_refresh_token", data.data.refreshToken);
          localStorage.setItem("monastery360_session", JSON.stringify(data.data.user));
        }
        setStep("success");
        toast({ title: "Account created! 🎉", description: `Welcome, ${fullName.split(" ")[0]}! Your email is verified.` });
        setTimeout(() => navigate("/"), 2000);
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
      const res = await fetch(`${API}/auth/signup/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), username: username.trim(), password }),
      });
      const data = await res.json();
      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(60);
      toast({ title: "New OTP sent! 📧", description: `Check your inbox at ${email}.` });
      if (data.devOtp) {
        setTimeout(() => {
          toast({ title: "🛠️ DEV MODE OTP (No SMTP)", description: data.devOtp, duration: 20000 });
        }, 800);
      }
      otpRefs.current[0]?.focus();
    } catch {
      toast({ title: "Error", description: "⚠️ Cannot connect to server.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const InputError = ({ error }: { error?: string }) =>
    error ? <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><Shield className="w-3 h-3" />{error}</p> : null;

  return (
    <section className="min-h-screen flex relative overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 relative items-center justify-center p-12">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-yellow-300/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-white max-w-md">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-white/20">
            <Mountain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            Join the<span className="block text-emerald-200">Sacred Community</span>
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Create your free account and begin your digital pilgrimage through Sikkim's ancient Buddhist monasteries.
          </p>
          <div className="flex flex-col gap-3">
            {["✨ Personalized AI trip planning", "📝 Write & earn coins for reviews", "🧠 Test knowledge with AI quizzes", "🗺️ Save favorite monasteries", "🔐 Email OTP verification for security"].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full flex-shrink-0" />{item}
              </div>
            ))}
          </div>

          {/* Progress steps indicator */}
          <div className="mt-10 flex items-center gap-3">
            {(["form", "otp", "success"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === s ? "bg-white text-emerald-600 shadow-lg" : (["form", "otp", "success"].indexOf(step) > i ? "bg-white/40 text-white" : "bg-white/20 text-white/60")}`}>
                  {["form", "otp", "success"].indexOf(step) > i ? "✓" : i + 1}
                </div>
                {i < 2 && <div className={`h-0.5 w-8 rounded transition-all duration-500 ${["form", "otp", "success"].indexOf(step) > i ? "bg-white/60" : "bg-white/20"}`} />}
              </div>
            ))}
            <span className="text-white/70 text-xs ml-1">
              {step === "form" ? "Fill details" : step === "otp" ? "Verify email" : "Done!"}
            </span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-lg font-black text-white">M360</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Monastery360</h2>
          </div>

          <AnimatePresence mode="wait">

            {/* ── STEP 1: Registration Form ────────────────────────── */}
            {step === "form" && (
              <motion.form key="form" onSubmit={handleSendOtp}
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl shadow-emerald-100/50 border border-emerald-100/50"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                  <p className="text-sm text-gray-400 mt-1">Step 1 of 2 — Fill in your details</p>
                </div>

                {errors.general && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Full Name */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input id="signup-fullname" type="text" placeholder="e.g. Tenzin Dorje"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.fullName ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"}`}
                      value={fullName} onChange={e => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: "" })); }} />
                  </div>
                  <InputError error={errors.fullName} />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-emerald-600 text-xs font-normal">(OTP will be sent here)</span></label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input id="signup-email" type="email" placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.email ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"}`}
                      value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }} />
                  </div>
                  <InputError error={errors.email} />
                </div>

                {/* Username */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input id="signup-username" type="text" placeholder="choose_username"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.username ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"}`}
                      value={username} onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: "" })); }} />
                  </div>
                  <InputError error={errors.username} />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Create a strong password"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.password ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"}`}
                      value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <InputError error={errors.password} />
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(l => (
                          <div key={l} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${l <= passwordStrength.score ? passwordStrength.color : "bg-gray-200"}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${passwordStrength.score <= 1 ? "text-red-500" : passwordStrength.score <= 2 ? "text-orange-500" : passwordStrength.score <= 3 ? "text-yellow-600" : "text-emerald-600"}`}>{passwordStrength.label}</p>
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        {passwordRules.map(r => (
                          <div key={r.label} className="flex items-center gap-1">
                            {r.met ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-gray-300" />}
                            <span className={`text-[10px] ${r.met ? "text-emerald-600" : "text-gray-400"}`}>{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input id="signup-confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.confirmPassword ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"}`}
                      value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: "" })); }} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <InputError error={errors.confirmPassword} />
                  {confirmPassword && !errors.confirmPassword && password === confirmPassword && (
                    <p className="text-xs text-emerald-500 mt-1.5 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Passwords match</p>
                  )}
                </div>

                {/* Terms */}
                <div className="mb-6">
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input type="checkbox" checked={agreeTerms}
                      onChange={e => { setAgreeTerms(e.target.checked); setErrors(p => ({ ...p, terms: "" })); }}
                      className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 cursor-pointer mt-0.5" />
                    <span className="text-xs text-gray-500 group-hover:text-gray-700 leading-relaxed">
                      I agree to the <span className="text-emerald-600 font-medium">Terms of Service</span> and <span className="text-emerald-600 font-medium">Privacy Policy</span>
                    </span>
                  </label>
                  <InputError error={errors.terms} />
                </div>

                <Button id="signup-submit" type="submit" disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 rounded-xl shadow-lg shadow-emerald-200 text-base font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 gap-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP…</div>
                  ) : (<><Sparkles className="w-4 h-4" />Send Verification Code<ArrowRight className="w-4 h-4" /></>)}
                </Button>

                <p className="text-sm text-gray-500 text-center mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-emerald-500 font-semibold hover:text-emerald-600 inline-flex items-center gap-1">
                    Sign In <ArrowRight className="w-3 h-3" />
                  </Link>
                </p>
              </motion.form>
            )}

            {/* ── STEP 2: OTP Verification ──────────────────────────── */}
            {step === "otp" && (
              <motion.form key="otp" onSubmit={handleVerifyOtp}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl shadow-emerald-100/50 border border-emerald-100/50"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                    <KeyRound className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
                  <p className="text-sm text-gray-500 mt-1">Step 2 of 2 — Enter the 6-digit code sent to</p>
                  <p className="text-sm font-semibold text-emerald-600 mt-0.5 break-all">{email}</p>
                </div>

                {/* OTP digit boxes */}
                <div className="flex gap-2 justify-center mb-6" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all bg-white/80 ${digit ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200"} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100`}
                    />
                  ))}
                </div>

                {errors.otp && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600">{errors.otp}</p>
                  </div>
                )}

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-6">
                  <p className="text-xs text-emerald-700 text-center">
                    ⏰ This code expires in <strong>10 minutes</strong>. Check spam/promotions if not received.
                  </p>
                </div>

                <Button id="otp-verify-submit" type="submit" disabled={isLoading || otp.join("").length !== 6}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 rounded-xl shadow-lg shadow-emerald-200 text-base font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 gap-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</div>
                  ) : (<><Shield className="w-4 h-4" />Verify & Create Account<ArrowRight className="w-4 h-4" /></>)}
                </Button>

                <div className="flex items-center justify-between mt-4 text-sm">
                  <button type="button" onClick={() => { setStep("form"); setOtp(["", "", "", "", "", ""]); setErrors({}); }}
                    className="text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
                    ← Back to form
                  </button>
                  <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || isLoading}
                    className="flex items-center gap-1.5 text-emerald-500 hover:text-emerald-600 font-medium disabled:opacity-50 transition-colors">
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
                className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-emerald-100/50 border border-emerald-100/50 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created! 🎉</h2>
                <p className="text-gray-500 text-sm">Your email is verified. Welcome to Monastery360!</p>
                <p className="text-gray-400 text-xs mt-2">Redirecting you to the homepage…</p>
                <div className="mt-4 w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
              </motion.div>
            )}

          </AnimatePresence>

          <p className="text-center text-xs text-gray-400 mt-6">
            Your data is protected with industry-standard encryption 🔒
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
