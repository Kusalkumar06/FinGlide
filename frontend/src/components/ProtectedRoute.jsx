import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";
import api from "../api/axios";

export function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url = "/auth/check";
        await api.get(url, { withCredentials: true });

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

export function PublicRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url = "/auth/check";
        await api.get(url, { withCredentials: true });
        setAuthenticated(true);
      } catch (err){
        setAuthenticated(false);
        console.error(err)
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <Loader />;

  return authenticated ? <Navigate to="/" replace /> : children;
}


