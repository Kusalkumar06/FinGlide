import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url = "https://finglide.onrender.com/auth/check";
        await axios.get(url, { withCredentials: true });

        setAuthenticated(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
   return <Loader/>
  }

  return authenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
