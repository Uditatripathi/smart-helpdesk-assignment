import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";

export default function TicketDetail() {
  const { id } = useParams();
  const { authFetch, user } = useAuth();
  const [data, setData] = useState(null);
  const [audit, setAudit] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const d = await authFetch(`/api/tickets/${id}`);
      setData(d);
      const logs = await authFetch(`/api/audit/${id}`);
      setAudit(logs);
    } catch (e) { setErr(e.message); }
  };

  useEffect(() => { load(); }, [id]);

  const resolveNow = async () => {
    try {
      await authFetch(`/api/tickets/${id}/reply`, { method:"POST", body: JSON.stringify({}) });
      await load();
    } catch (e) { setErr(e.message); }
  };

  if (!data) return <div style={{padding:16}}>Loading...</div>;

  const { ticket, suggestion } = data;

  return (
    <div style={{padding:16, display:"grid", gap:16}}>
      {err && <div style={{color:"red"}}>{err}</div>}
      <section style={{border:"1px solid #eee", padding:12}}>
        <h3>{ticket.title}</h3>
        <p><b>Status:</b> {ticket.status} &nbsp; <b>Category:</b> {ticket.category}</p>
        <p>{ticket.description}</p>
        {(user?.role === "agent" || user?.role === "admin") && ticket.status !== "resolved" && (
          <button onClick={resolveNow}>Send Reply & Resolve</button>
        )}
      </section>

      <section style={{border:"1px solid #eee", padding:12}}>
        <h3>Agent Suggestion</h3>
        {suggestion ? (
          <div>
            <p><b>Predicted:</b> {suggestion.predictedCategory} ({(suggestion.confidence*100).toFixed(1)}%)</p>
            <pre style={{whiteSpace:"pre-wrap"}}>{suggestion.draftReply}</pre>
            <p><b>Citations:</b> {suggestion.articleIds?.join(", ")}</p>
          </div>
        ) : <p>No suggestion yet.</p>}
      </section>

      <section style={{border:"1px solid #eee", padding:12}}>
        <h3>Audit Timeline</h3>
        <ul>
          {audit.map(a => (
            <li key={a._id}>
              <code>{a.timestamp}</code> — <b>{a.actor}</b> — {a.action} — <small>{JSON.stringify(a.meta)}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
