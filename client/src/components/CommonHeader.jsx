import React from "react";
import { Link, useLocation } from "react-router-dom";

const CommonHeader = () => {
  const location = useLocation();
  const current = location.pathname;

  // For normal text menu (Home, Login)
  const activeText = (path) =>
    current === path
      ? "text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg"
      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50 px-3 py-1 rounded-lg transition-all";

  // For SignUp button (Special styling if needed, but keeping consistent for now)
  const activeButton = (path) =>
    current === path
      ? "bg-indigo-600 text-white shadow-md"
      : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50";

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">S</div>
          <span className="text-2xl font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">ShareBox</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2 sm:gap-4">

          {/* Home */}
          <Link to="/" className={`text-sm sm:text-base font-medium ${activeText("/")}`}>
            Home
          </Link>

          {/* Login */}
          <Link to="/login" className={`text-sm sm:text-base font-medium ${activeText("/login")}`}>
            Login
          </Link>

          {/* Sign Up */}
          <Link
            to="/signup"
            className="hidden sm:block ml-2 px-5 py-2 rounded-full font-bold text-sm bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transform hover:-translate-y-0.5 transition-all"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default CommonHeader;
