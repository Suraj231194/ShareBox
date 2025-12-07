import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const [mode, setModeState] = useState("light");

  // ---------------- LOAD MODE ----------------
  useEffect(() => {
    const savedMode = localStorage.getItem("mode") || "light";
    setModeState(savedMode);
    document.body.dataset.mode = savedMode;
    if (savedMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    document.body.dataset.mode = newMode;
    localStorage.setItem("mode", newMode);
    setModeState(newMode);
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const displayName = user?.fullname || "User";
  const displayEmail = user?.email || "No email";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3 px-6 flex items-center justify-between transition-colors duration-300 w-full md:w-[calc(100%-16rem)] md:left-64">

      {/* ---------------- MOBILE MENU BUTTON ---------------- */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* ---------------- BRAND LOGO ---------------- */}
      <div className="flex flex-col text-left md:hidden">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="Logo" className="w-9 h-9 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">PasteBox</span>
        </Link>
      </div>

      {/* ---------------- RIGHT SIDE CONTROLS ---------------- */}
      <section className="flex items-center gap-4 md:gap-6 ml-auto">

        {/* ------------- MODE SWITCH ------------- */}
        <button
          onClick={toggleMode}
          className="p-2 rounded-full text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {mode === "dark" ? <FaSun className="text-yellow-400" size={20} /> : <FaMoon className="text-slate-600" size={20} />}
        </button>

        {/* ------------- USER PROFILE ------------- */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="hidden md:block text-right leading-tight">
            <h3 className="text-sm font-semibold text-foreground">{displayName}</h3>
            <p className="text-xs text-muted-foreground">{displayEmail}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold shadow-md ring-2 ring-background">
            {userInitial}
          </div>
        </div>

      </section>
    </header>
  );
};

export default Header;
