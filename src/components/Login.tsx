import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LogIn,
  User,
  Lock,
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  Mountain,
  Shield,
} from "lucide-react";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = "Username is required";
    else if (username.trim().length < 3) newErrors.username = "Username must be at least 3 characters";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 4) newErrors.password = "Password must be at least 4 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setUser({ username: username.trim() });
    setIsLoading(false);

    toast({
      title: "Welcome back! 🙏",
      description: `Namaste, ${username.trim()}! You've successfully signed in.`,
    });

    navigate("/");
  };

  return (
    <section className="min-h-screen flex relative overflow-hidden">
      {/* Left Side — Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 relative items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-yellow-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 border border-white/10 rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-white/10 rounded-full animate-float" />

        <div className="relative z-10 text-white max-w-md">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-white/20">
            <Mountain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            Welcome to
            <span className="block text-yellow-200">Monastery360</span>
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Explore over 200 ancient monasteries of Sikkim through immersive virtual tours,
            AI-powered insights, and help preserve Himalayan heritage.
          </p>

          {/* Trust badges */}
          <div className="flex flex-col gap-3">
            {[
              "🏛️ Access 200+ monasteries",
              "🤖 AI-powered spiritual guide",
              "🎧 Multi-language audio tours",
              "📜 Digital manuscript archives",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 relative">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo (only shows on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-200">
              <span className="text-lg font-black text-white">M360</span>
            </div>
            <h2 className="text-xl font-bold text-deep-earth">Monastery360</h2>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl shadow-orange-100/50 border border-orange-100/50 animate-fade-in-up"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200 animate-glow-pulse">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-deep-earth">Welcome Back</h2>
              <p className="text-sm text-gray-400 mt-1">Sign in to continue your sacred journey</p>
            </div>

            {/* Username Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="login-username"
                  type="text"
                  placeholder="Enter your username"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.username
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    }`}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: undefined });
                  }}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl outline-none transition-all bg-white/50 text-sm ${errors.password
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    }`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                />
                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                onClick={() =>
                  toast({
                    title: "Password Reset",
                    description: "Please contact the admin to reset your password.",
                  })
                }
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 rounded-xl shadow-lg shadow-orange-200 text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-300 disabled:opacity-70 disabled:hover:scale-100 gap-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-4 text-xs text-gray-400 uppercase tracking-wide">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Quick Login Hint */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-amber-700 text-center">
                💡 <strong>Quick tip:</strong> Enter any username & password (min 4 chars) to explore the platform.
              </p>
            </div>

            {/* Signup Link */}
            <p className="text-sm text-gray-500 text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-500 font-semibold hover:text-orange-600 transition-colors inline-flex items-center gap-1"
              >
                Create Account <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
