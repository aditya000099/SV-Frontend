'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { validateEmail } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';

export function ResetPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const validateForm = () => {
    const emailError = validateEmail(email);
    setErrors({ email: emailError });
    return !emailError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to send reset email. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gray-800 rounded-xl shadow-2xl w-96 backdrop-blur-lg"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Reset Password</h2>
        <p className="text-gray-400 text-center mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <AnimatePresence>
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4"
            >
              {errors.submit}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-lg mb-4"
            >
              Reset instructions sent! Check your email.
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({});
              }}
              className={`w-full p-2 rounded-xl bg-gray-700 border-1 ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword; 