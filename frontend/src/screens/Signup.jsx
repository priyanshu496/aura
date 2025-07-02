import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios.js";
const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("/user/signup", {
        email,
        password,
      })
      .then((res) => {
        
        console.log(res.data);
        navigate('/')
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-blue-500/20 rounded-3xl p-8 shadow-2xl shadow-black/80">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent mb-3">
              Create Account
            </h1>
            <p className="text-zinc-300 text-lg">
              Sign up for your new account
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-200">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-zinc-800/50 border-2  rounded-xl text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all duration-300`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-200">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-zinc-800/50 border-2 rounded-xl text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all duration-300`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-8">
            <p className="text-zinc-300">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-blue-300 hover:text-blue-200 font-bold transition-colors underline underline-offset-2"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 blur-xl rounded-full"></div>
      </div>
    </div>
  );
};

export default Signup;
