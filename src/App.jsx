import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Registration from "./components/Registration.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { getSession, logout } from "./auth.js";

export default function App() {
  const [user, setUser] = useState(getSession());

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Registration />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
