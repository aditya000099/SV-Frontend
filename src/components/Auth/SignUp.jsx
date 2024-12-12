import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../../utils/validation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { GlareCard } from "CardPatterns/Glare";

export function SignUp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user) {
    navigate("/dashboard");
  }
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const navigate = useNavigate();

  const validateNameInput = (name) => {
    // Check for numbers
    if (/\d/.test(name)) {
      return "Name cannot contain numbers";
    }
    
    // Check length
    if (name.length > 16) {
      return "Name cannot exceed 16 characters";
    }

    // Check for consecutive spaces
    if (/\s\s/.test(name)) {
      return "Name cannot contain consecutive spaces";
    }

    // Check for leading/trailing spaces
    if (name.startsWith(' ') || name.endsWith(' ')) {
      return "Name cannot start or end with spaces";
    }

    // Allow letters and single spaces between words
    if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(name)) {
      return "Name can only contain letters and spaces between words";
    }

    return "";
  };

  const validatePasswordInput = (password) => {
    if (/\s/.test(password)) {
      return "Password cannot contain spaces";
    }
    return validatePassword(password); // Your existing password validation
  };

  const validateEmailWithTLD = (email) => {
    // First check if it's a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    // Check if the email ends with .com or .in
    if (!email.endsWith('.com') && !email.endsWith('.in')) {
      return "Only .com or .in email addresses are allowed";
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {
      name: validateNameInput(formData.name),
      email: validateEmailWithTLD(formData.email),
      password: validatePasswordInput(formData.password),
      confirmPassword:
        formData.password !== formData.confirmPassword
          ? "Passwords do not match"
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

    // Real-time validation
    if (name === 'name') {
      const nameError = validateNameInput(value);
      setErrors(prev => ({
        ...prev,
        name: nameError
      }));
    } else if (name === 'password') {
      const passwordError = validatePasswordInput(value);
      setErrors(prev => ({
        ...prev,
        password: passwordError
      }));
    } else if (name === 'email') {
      const emailError = validateEmailWithTLD(value);
      setErrors(prev => ({
        ...prev,
        email: emailError
      }));
    } else {
      // Clear error when user starts typing for other fields
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerStyle = {
    "--m-x": "50%",
    "--m-y": "50%",
    "--r-x": "0deg",
    "--r-y": "0deg",
    "--bg-x": "50%",
    "--bg-y": "50%",
    "--duration": "300ms",
    "--foil-size": "100%",
    "--opacity": "0",
    "--radius": "23px",
    "--easing": "ease",
    "--transition": "var(--duration) var(--easing)",
  };

  // Add this effect to handle real-time password match validation
  useEffect(() => {
    if (formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: formData.password !== formData.confirmPassword 
          ? "Passwords do not match" 
          : ""
      }));
    }
  }, [formData.password, formData.confirmPassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-900/30 relative">
      {/* Background Glares */}
      <div className="absolute top-10 left-20 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-green-500/20 blur-3xl rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8  mt-16 py-2 rounded-xl shadow-2xl w-[28rem] backdrop-blur-xl border-[1px] border-white/10 bg-white/5 relative"
      >
        {/* Whitish Light on Top */}
        <div className="absolute inset-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent rounded-xl pointer-events-none" />

        <h2 className="text-2xl font-bold mt-6 mb-1 text-left text-white">
          Welcome to Studyverse
        </h2>
        <h2 className="text-sm font-light mt-2 mb-6 text-left text-white/70">
          Create your account to start your AI learning journey today and beyond
        </h2>

        <AnimatePresence>
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border-1 border-red-500 text-red-500 px-4 py-2 rounded-xl mb-4"
            >
              {errors.submit}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 rounded-xl backdrop-blur-lg bg-white/5 border-1 
    ${
      errors.name
        ? "border-red-500 focus:ring-red-400"
        : "border-gray-300/10 focus:ring-purple-400"
    } 
    focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-gray-400`}
              placeholder="Enter your name"
            />

            {errors.name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-2 rounded-xl backdrop-blur-lg bg-white/5 border-1 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300/10 focus:ring-purple-400"
                } focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-gray-400`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUp;
