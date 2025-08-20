import React, { createContext, useContext, useState, useEffect } from "react";

const AuthCtx = createContext(null);
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  const login = (t, u) => {
    setToken(t); setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
  };
  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem("token"); localStorage.removeItem("user");
  };

  const authFetch = async (path, opts={}) => {
    const res = await fetch(`${API}${path}`, {
      ...opts,
      headers: { "Content-Type": "application/json", ...(opts.headers||{}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (!res.ok) throw new Error((await res.json()).error || "Request failed");
    return res.json();
  };

  return <AuthCtx.Provider value={{ token, user, login, logout, authFetch }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
