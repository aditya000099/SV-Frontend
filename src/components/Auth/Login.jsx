import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, validatePassword } from "../../utils/validation";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user) {
    navigate("/dashboard");
  }
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const validateLoginForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: !formData.password
        ? "Password is required"
        : formData.password.length < 8
        ? "Password must be at least 8 characters long"
        : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateLoginForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      window.location.href = "/dashboard";
      // navigate("/dashboard");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: "Invalid email or password",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-900/30 relative">
      <div className="absolute top-10 left-20 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-green-500/20 blur-3xl rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8  mt-16 py-2 rounded-xl shadow-2xl w-[28rem] backdrop-blur-xl border-[1px] border-white/10 bg-white/5 relative"
      >
        <div className="absolute inset-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent rounded-xl pointer-events-none" />

        <h2 className="text-2xl font-bold mt-6 mb-1 text-left text-white">
          Welcome back learner
        </h2>
        <h2 className="text-sm font-light mt-2 mb-6 text-left text-white/70">
          Login to your account to continue
        </h2>

        <AnimatePresence>
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4"
            >
              {errors.submit}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl backdrop-blur-lg bg-white/5 border-1 ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300/10 focus:ring-purple-400"
              } focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-gray-400`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl backdrop-blur-lg bg-white/5 border-1 ${
                errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300/10 focus:ring-purple-400"
              } focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-gray-400`}
              placeholder="Enter your password"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
              </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors
          ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-6 text-center text-gray-400">
          <Link
            to="/reset-password"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign Up */}
        <div className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
