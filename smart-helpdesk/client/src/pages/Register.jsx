import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      nav("/login");
    } catch (e) { setErr(e.message); }
  };

  return (
    <div style={{padding:16}}>
      <h2>Register</h2>
      {err && <div style={{color:"red"}}>{err}</div>}
      <form onSubmit={submit} style={{display:"grid", gap:8, maxWidth:360}}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <label>Role:
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="user">user</option>
            <option value="agent">agent</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
