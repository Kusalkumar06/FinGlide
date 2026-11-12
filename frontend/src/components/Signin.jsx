import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/coreThunks';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';

function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUsername, setUsername] = useState('');
  const [loginPassword, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUserLoggedIn = useSelector((s) => s.core.isUserLoggedIn);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) return;

    setIsSubmitting(true);
    await dispatch(
      loginUser({
        username: loginUsername.trim(),
        password: loginPassword,
      })
    );
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isUserLoggedIn, navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-[#FFF5EC] via-[#FFF9F3] to-[#FCE8DC] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -right-20 w-[420px] h-[420px] bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Auth Card */}
      <div className="relative z-10 w-full max-w-[430px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-orange-950/10 border border-orange-100/90 p-8 sm:p-9 transition-all duration-300">
        
        {/* Brand Icon & Welcome Title */}
        <div className="text-center mb-8 flex flex-col items-center">
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
            Welcome to FinGlide
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-[280px]">
            Effortless finance & expense management at your fingertips
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400">
                <FiUser size={17} />
              </span>
              <input
                type="text"
                required
                name="username"
                value={loginUsername}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400">
                <FiLock size={17} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="password"
                value={loginPassword}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#da6e39] to-[#F96C4A] hover:from-[#c95d28] hover:to-[#e85b39] text-white font-medium rounded-xl text-sm shadow-md shadow-orange-500/25 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign in to Account'}</span>
            {!isSubmitting && <FiArrowRight size={16} />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-7 pt-4 border-t border-gray-100 text-sm text-gray-500">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="font-semibold text-[#D86D38] hover:text-orange-700 hover:underline transition-colors ml-0.5"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signin;
