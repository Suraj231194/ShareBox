import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mode, setModeState] = useState("light");
  const [scrolled, setScrolled] = useState(false);

  // ------------------ INITIAL LOAD ------------------
  useEffect(() => {
    const savedMode = localStorage.getItem("mode") || "light";
    setModeState(savedMode);
    document.body.setAttribute("data-mode", savedMode);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ------------------ MODE TOGGLE ------------------
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    document.body.setAttribute("data-mode", newMode);
    localStorage.setItem("mode", newMode);
    setModeState(newMode);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              PasteBox
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleMode}
              className="p-2 rounded-full hover:bg-secondary text-foreground transition-colors"
              aria-label="Toggle Theme"
            >
              {mode === 'dark' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-slate-700" />}
            </button>

            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all shadow-md shadow-primary/20">
                Sign Up
              </Link>
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setSidebarVisible(true)}
            className="md:hidden p-2 text-foreground focus:outline-none"
          >
            <FaBars className="text-2xl" />
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm" onClick={() => setSidebarVisible(false)} />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed top-0 right-0 w-[280px] h-full bg-background border-l border-border z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${sidebarVisible ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setSidebarVisible(false)} className="p-2 hover:bg-secondary rounded-full">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dark Mode</span>
            <button
              onClick={toggleMode}
              className="p-2 rounded-full bg-secondary text-foreground transition-colors"
            >
              {mode === 'dark' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-slate-700" />}
            </button>
          </div>

          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full text-center py-2.5 rounded-lg border border-border font-medium hover:bg-secondary transition-colors"
              onClick={() => setSidebarVisible(false)}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="block w-full text-center py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              onClick={() => setSidebarVisible(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Header;
