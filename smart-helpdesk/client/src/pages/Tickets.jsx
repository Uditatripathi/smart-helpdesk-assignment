import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";

export default function Tickets() {
  const { authFetch } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const data = await authFetch("/api/tickets");
      setTickets(data);
    } catch (e) { setErr(e.message); }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await authFetch("/api/tickets", { method:"POST", body: JSON.stringify({ title, description }) });
      setTitle(""); setDescription("");
      await load();
    } catch (e) { setErr(e.message); }
  };

  return (
    <div style={{padding:16}}>
      <h2>Your Tickets</h2>
      {err && <div style={{color:"red"}}>{err}</div>}
      <form onSubmit={create} style={{display:"grid", gap:8, maxWidth:480, marginBottom:16}}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea placeholder="Describe your issue" value={description} onChange={e=>setDescription(e.target.value)} />
        <button type="submit">Create Ticket</button>
      </form>

      <table border="1" cellPadding="6" style={{borderCollapse:"collapse", width:"100%"}}>
        <thead><tr><th>Title</th><th>Status</th><th>Category</th><th>Updated</th></tr></thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t._id}>
              <td><Link to={`/ticket/${t._id}`}>{t.title}</Link></td>
              <td>{t.status}</td>
              <td>{t.category}</td>
              <td>{new Date(t.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
