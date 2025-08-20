import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Tickets from "./pages/Tickets.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import KB from "./pages/KB.jsx";
import Settings from "./pages/Settings.jsx";
import { AuthProvider, useAuth } from "./state/auth.jsx";

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav style={{display:"flex", gap:12, padding:12, borderBottom:"1px solid #eee"}}>
      <Link to="/">Tickets</Link>
      {user?.role === "admin" && <Link to="/kb">KB</Link>}
      {user?.role === "admin" && <Link to="/settings">Settings</Link>}
      <div style={{marginLeft:"auto"}}>
        {user ? (<>
          <span style={{marginRight:8}}>{user.email} ({user.role})</span>
          <button onClick={logout}>Logout</button>
        </>) : (<>
          <Link to="/login">Login</Link>
        </>)}
      </div>
    </nav>
  );
}

function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<PrivateRoute><Tickets /></PrivateRoute>} />
          <Route path="/ticket/:id" element={<PrivateRoute><TicketDetail /></PrivateRoute>} />
          <Route path="/kb" element={<PrivateRoute><KB /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
