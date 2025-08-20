import React, { useEffect, useState } from "react";
import { useAuth } from "../state/auth.jsx";

export default function KB() {
  const { authFetch } = useAuth();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title:"", body:"", tags:"billing", status:"published" });
  const [err, setErr] = useState("");

  const search = async () => {
    try { setItems(await authFetch(`/api/kb?query=${encodeURIComponent(q)}`)); }
    catch (e) { setErr(e.message); }
  };
  useEffect(() => { search(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await authFetch("/api/kb", { method:"POST", body: JSON.stringify({ ...form, tags: form.tags.split(",").map(s=>s.trim()) }) });
      setForm({ title:"", body:"", tags:"", status:"published" });
      await search();
    } catch (e) { setErr(e.message); }
  };

  return (
    <div style={{padding:16}}>
      <h2>Knowledge Base</h2>
      {err && <div style={{color:"red"}}>{err}</div>}
      <div style={{display:"flex", gap:8, marginBottom:8}}>
        <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={search}>Search</button>
      </div>
      <ul>
        {items.map(a => (
          <li key={a._id}><b>{a.title}</b> — <i>{a.status}</i></li>
        ))}
      </ul>

      <h3>Create Article</h3>
      <form onSubmit={create} style={{display:"grid", gap:8, maxWidth:600}}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <textarea placeholder="Body" value={form.body} onChange={e=>setForm({...form, body:e.target.value})} />
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} />
        <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
