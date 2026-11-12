import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/coreThunks';
import { useDispatch } from 'react-redux';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerErr, setRegisterErr] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) return;

    setIsSubmitting(true);
    const success = await dispatch(
      registerUser({
        username: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      })
    );
    setIsSubmitting(false);

    if (success) {
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterErr(false);
      navigate('/login', { replace: true });
    } else {
      setRegisterErr(true);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-[#FFF5EC] via-[#FFF9F3] to-[#FCE8DC] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -right-20 w-[420px] h-[420px] bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Auth Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-orange-950/10 border border-orange-100/90 p-8 sm:p-9 transition-all duration-300">
        
        {/* Brand Icon & Welcome Title */}
        <div className="text-center mb-7 flex flex-col items-center">
          <div className="relative mb-3 group cursor-pointer">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 opacity-30 blur-sm group-hover:opacity-60 transition duration-300" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#da6e39] to-[#F96C4A] p-3 flex items-center justify-center shadow-md shadow-orange-500/25 transform group-hover:scale-105 transition-all">
              <img
                className="w-full h-full object-contain filter drop-shadow"
                src="https://res.cloudinary.com/dtrouncfb/image/upload/v1756573796/LogoMakr-0It9qV_n5txbu.png"
                alt="FinGlide Logo"
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-gray-800 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-[280px]">
            Join FinGlide to start tracking your finances
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name / Username */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400">
                <FiUser size={17} />
              </span>
              <input
                type="text"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Choose a username"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400">
                <FiMail size={17} />
              </span>
              <input
                type="email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400">
                <FiLock size={17} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-11 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
              >
                {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          {/* Error notice */}
          {registerErr && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center">
              * Username already exists. Please try another name.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#da6e39] to-[#F96C4A] hover:from-[#c95d28] hover:to-[#e85b39] text-white font-medium rounded-xl text-sm shadow-md shadow-orange-500/25 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
            {!isSubmitting && <FiArrowRight size={16} />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-semibold text-[#D86D38] hover:text-orange-700 hover:underline transition-colors ml-0.5"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
