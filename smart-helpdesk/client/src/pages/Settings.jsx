import React, { useEffect, useState } from "react";
import { useAuth } from "../state/auth.jsx";

export default function Settings() {
  const { authFetch } = useAuth();
  const [cfg, setCfg] = useState(null);
  const [err, setErr] = useState("");

  const load = async () => {
    try { setCfg(await authFetch("/api/config")); }
    catch (e) { setErr(e.message); }
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const data = await authFetch("/api/config", { method:"PUT", body: JSON.stringify(cfg) });
      setCfg(data);
    } catch (e) { setErr(e.message); }
  };

  if (!cfg) return <div style={{padding:16}}>Loading...</div>;

  return (
    <div style={{padding:16}}>
      <h2>Settings</h2>
      {err && <div style={{color:"red"}}>{err}</div>}
      <form onSubmit={save} style={{display:"grid", gap:8, maxWidth:360}}>
        <label>
          Auto Close Enabled
          <input type="checkbox" checked={!!cfg.autoCloseEnabled} onChange={e=>setCfg({...cfg, autoCloseEnabled: e.target.checked})} />
        </label>
        <label>
          Confidence Threshold
          <input type="number" step="0.01" min="0" max="1" value={cfg.confidenceThreshold} onChange={e=>setCfg({...cfg, confidenceThreshold: Number(e.target.value)})} />
        </label>
        <label>
          SLA Hours
          <input type="number" min="1" max="168" value={cfg.slaHours} onChange={e=>setCfg({...cfg, slaHours: Number(e.target.value)})} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
