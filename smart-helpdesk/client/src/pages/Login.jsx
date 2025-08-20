import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const { authFetch, login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      login(data.token, data.user);
      nav("/");
    } catch (e) { setErr(e.message); }
  };

  return (
    <div style={{padding:16}}>
      <h2>Login</h2>
      {err && <div style={{color:"red"}}>{err}</div>}
      <form onSubmit={submit} style={{display:"grid", gap:8, maxWidth:320}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
