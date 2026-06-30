import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

function Navbar() {
  const { user, role, logout } = useAuthStore();
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0d0d0c]/80 border-b border-neutral-200/80 dark:border-neutral-800/80 px-6 py-4 flex items-center justify-between transition-colors">
      <Link to="/" className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
        Thinking<span className="font-light italic text-neutral-500 dark:text-neutral-400">OutLoud</span>
      </Link>

      <div className="flex items-center gap-4 md:gap-6">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-neutral-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M9.75 15l1.5 1.5m4.5-4.5l1.5 1.5M3 12h2.25m13.5 0H21M5.75 5.75l1.5 1.5m10.5 10.5l1.5 1.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          )}
        </button>

        <div className="hidden md:flex items-center gap-6">
          {!user && (
            <div className="flex items-center gap-5">
              <Link to="/login" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm font-medium bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 px-4 py-2 rounded-full transition-all shadow-sm">
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-5">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Hello, <span className="text-neutral-900 dark:text-white font-semibold">{user}</span>
              </span>

              {role === "ROLE_ADMIN" && (
                <Link to="/admin/editor" className="text-sm font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 px-3.5 py-1.5 rounded-full transition-colors border border-neutral-200 dark:border-neutral-800">
                  Admin Panel
                </Link>
              )}

              <div className="w-[1px] h-4 bg-neutral-200 dark:bg-neutral-800" />

              <button 
                className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition-colors cursor-pointer" 
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all shadow-sm cursor-pointer"
            title="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-[72px] right-6 w-52 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 rounded-2xl shadow-lg p-4 flex flex-col gap-3.5 z-50 animate-fade-in md:hidden transition-colors duration-300">
            {user ? (
              <>
                <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pb-1 border-b border-neutral-100 dark:border-neutral-850">
                  Account
                </div>
                <div className="text-sm font-medium text-neutral-650 dark:text-neutral-400">
                  Hello, <span className="font-bold text-neutral-900 dark:text-white">{user}</span>
                </div>
                {role === "ROLE_ADMIN" && (
                  <Link 
                    to="/admin/editor" 
                    className="text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="h-[1px] bg-neutral-100 dark:bg-neutral-850 w-full" />
                <button 
                  className="w-full text-left text-sm font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer" 
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pb-1 border-b border-neutral-100 dark:border-neutral-850">
                  Welcome
                </div>
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm font-semibold bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 text-center py-2 rounded-xl transition-all shadow-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
