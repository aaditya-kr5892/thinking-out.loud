import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import "./css/navbar.css";

function Navbar() {
  const { user, role, logout } = useAuthStore();

  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        ThinkingOutLoud
      </Link>

      <div className="navbar-right">

        {!user && (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link signup">Sign Up</Link>
          </>
        )}

        {user && (
          <>
            <span className="navbar-greeting">Hello, {user}</span>

            {role === "ROLE_ADMIN" && (
              <Link to="/admin/editor" className="navbar-admin-link">Admin Panel</Link>
            )}

            <div className="navbar-divider" />

            <button className="navbar-logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;