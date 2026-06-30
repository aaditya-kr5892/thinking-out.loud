import React, { useState } from "react";
import { loginUser } from "../../api/authApi";
import { useAuthStore } from "./authStore";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const login    = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginUser({ username, password });
      login(data.username, data.token, data.role);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#faf9f6] dark:bg-[#0d0d0c] flex items-center justify-center px-6 py-12 animate-fade-in transition-colors duration-300">
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">

        <div className="bg-neutral-900 text-white p-8 md:p-12 flex flex-col justify-between space-y-12">
          <div className="space-y-6">
            <span className="text-lg font-bold tracking-tight">
              Thinking<span className="font-light italic text-neutral-400">OutLoud</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Welcome<br /><span className="italic font-light text-neutral-300">back.</span>
            </h2>
            <p className="text-neutral-400 font-light text-sm leading-relaxed">
              A platform for ideas that take longer
              than a tweet to express.
            </p>
          </div>
          <div className="border-t border-neutral-800 pt-6">
            <p className="text-xs italic text-neutral-500 leading-relaxed font-light">
              "The best writing comes from sitting quietly
              with an idea long enough to actually understand it."
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-2">Sign in.</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 font-light">
            Don't have an account?{" "}
            <Link to="/register" className="text-neutral-900 dark:text-white font-medium hover:underline">Create one →</Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-6">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Username</label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50 transition-colors bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 font-light"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Password</label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50 transition-colors bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 font-light"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              className="w-full bg-neutral-950 dark:bg-white hover:bg-neutral-850 dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-medium py-3 px-4 rounded-xl transition-colors shadow-sm cursor-pointer mt-4" 
              type="submit"
            >
              Sign In
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;
