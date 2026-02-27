import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus,
  User,
  Lock,
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  Mountain,
  Shield,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength calculation
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

  const passwordRules = useMemo(() => {
    return [
      { label: "At least 6 characters", met: password.length >= 6 },
      { label: "One uppercase letter", met: /[A-Z]/.test(password) },
      { label: "One number", met: /[0-9]/.test(password) },
      { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email address";
    if (!username.trim()) newErrors.username = "Username is required";
    else if (username.trim().length < 3) newErrors.username = "Username must be at least 3 characters";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!agreeTerms) newErrors.terms = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Please fix the errors",
        description: "Check the highlighted fields below.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setUser({ username: username.trim(), fullName: fullName.trim() });
    setIsLoading(false);

    toast({
      title: "Account created! 🎉",
      description: `Welcome to Monastery360, ${fullName.trim().split(" ")[0]}!`,
    });

    navigate("/");
  };

  const InputError = ({ error }: { error?: string }) =>
    error ? (
      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
        <Shield className="w-3 h-3" /> {error}
      </p>
    ) : null;

  return (
    <section className="min-h-screen flex relative overflow-hidden">
      {/* Left Side — Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 relative items-center justify-center p-12">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-yellow-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 border border-white/10 rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-white/10 rounded-full animate-float" />

        <div className="relative z-10 text-white max-w-md">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-white/20">
            <Mountain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            Join the
            <span className="block text-emerald-200">Sacred Community</span>
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Create your free account and begin your digital pilgrimage through
            Sikkim's ancient Buddhist monasteries.
          </p>

          <div className="flex flex-col gap-3">
            {[
              "✨ Personalized AI trip planning",
              "📝 Write & earn coins for reviews",
              "🧠 Test knowledge with AI quizzes",
              "🗺️ Save favorite monasteries",
              "🔔 Get festival & event reminders",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200">
              <span className="text-lg font-black text-white">M360</span>
            </div>
            <h2 className="text-xl font-bold text-deep-earth">Monastery360</h2>
          </div>

          <form
            onSubmit={handleSignup}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl shadow-emerald-100/50 border border-emerald-100/50 animate-fade-in-up"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200 animate-glow-pulse">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-deep-earth">Create Account</h2>
              <p className="text-sm text-gray-400 mt-1">Start your sacred journey today</p>
            </div>

            {/* Full Name */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-fullname"
                  type="text"
                  placeholder="e.g. Tenzin Dorje"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.fullName ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    }`}
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: undefined }); }}
                />
              </div>
              <InputError error={errors.fullName} />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    }`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                />
              </div>
              <InputError error={errors.email} />
            </div>

            {/* Username */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                <input
                  id="signup-username"
                  type="text"
                  placeholder="choose_username"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.username ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    }`}
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); if (errors.username) setErrors({ ...errors, username: undefined }); }}
                />
              </div>
              <InputError error={errors.username} />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    }`}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <InputError error={errors.password} />

              {/* Password Strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.score ? passwordStrength.color : "bg-gray-200"
                          }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${passwordStrength.score <= 1 ? "text-red-500" :
                      passwordStrength.score <= 2 ? "text-orange-500" :
                        passwordStrength.score <= 3 ? "text-yellow-600" : "text-emerald-600"
                    }`}>
                    {passwordStrength.label}
                  </p>

                  {/* Password Rules */}
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {passwordRules.map((rule) => (
                      <div key={rule.label} className="flex items-center gap-1">
                        {rule.met ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-300" />
                        )}
                        <span className={`text-[10px] ${rule.met ? "text-emerald-600" : "text-gray-400"}`}>
                          {rule.label}
                        </span>
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
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.confirmPassword ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    }`}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined }); }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <InputError error={errors.confirmPassword} />
              {confirmPassword && !errors.confirmPassword && password === confirmPassword && (
                <p className="text-xs text-emerald-500 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="mb-6">
              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.terms) setErrors({ ...errors, terms: undefined });
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 cursor-pointer mt-0.5"
                />
                <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors leading-relaxed">
                  I agree to the <span className="text-emerald-600 font-medium">Terms of Service</span> and{" "}
                  <span className="text-emerald-600 font-medium">Privacy Policy</span>
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1 ml-6">
                  <Shield className="w-3 h-3" /> {errors.terms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 rounded-xl shadow-lg shadow-emerald-200 text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-300 disabled:opacity-70 disabled:hover:scale-100 gap-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Login Link */}
            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-500 font-semibold hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
              >
                Sign In <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Your data is protected with industry-standard encryption 🔒
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
