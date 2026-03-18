import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "../utils/navigation";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../features/auth/authStore";
import { useEffect } from "react";
import Navbar from "../components/NavBar";



function MainLayout() {
  useEffect(() => {
    // const navigate = useNavigate();
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      useAuthStore.setState({
        user: decoded.sub,
        role: decoded.role,
        token
      });
    }
  }, []);
  // const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();
  setNavigator(navigate);
  
  return (
    <div>
      <Navbar/>
      
      <Outlet />
    </div>
  );
}

export default MainLayout;