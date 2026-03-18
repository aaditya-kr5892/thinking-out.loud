import React, { useState } from "react";
import { loginUser } from "../../api/authApi";
import { useAuthStore } from "./authStore";
import { useNavigate, Link } from "react-router-dom";
import './css/auth.css';

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
    <div className="auth-page">
      <div className="auth-card">

        {/* ── Brand panel ── */}
        <div className="auth-brand">
          <div className="auth-brand-top">
            <span className="auth-brand-logo">
              Thinking<em>OutLoud</em>
            </span>
            <h2 className="auth-brand-heading">
              Welcome<br /><em>back.</em>
            </h2>
            <p className="auth-brand-desc">
              A platform for ideas that take longer
              than a tweet to express.
            </p>
          </div>
          <div className="auth-brand-quote">
            <p>
              "The best writing comes from sitting quietly
              with an idea long enough to actually understand it."
            </p>
          </div>
        </div>

        {/* ── Form panel ── */}
        <div className="auth-form-panel">
          <h1 className="auth-form-title">Sign in.</h1>
          <p className="auth-form-sub">
            Don't have an account?{" "}
            <Link to="/register">Create one →</Link>
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <input
                className="auth-input"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="auth-submit" type="submit">
              Sign In
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;