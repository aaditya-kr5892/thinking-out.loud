import React, { useState } from "react";
import { registerUser } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import './css/auth.css';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser({ username, password });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Username may already be taken.");
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
              Join the<br /><em>conversation.</em>
            </h2>
            <p className="auth-brand-desc">
              Free forever. Comment, reply, and engage
              with every post on the platform.
            </p>
          </div>
          <div className="auth-brand-quote">
            <p>
              "Disagreement done respectfully is
              the highest form of engagement."
            </p>
          </div>
        </div>

        {/* ── Form panel ── */}
        <div className="auth-form-panel">
          <h1 className="auth-form-title">Create account.</h1>
          <p className="auth-form-sub">
            Already have one?{" "}
            <Link to="/login">Sign in →</Link>
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
              Create Account
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Register;