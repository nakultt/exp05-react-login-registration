import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InputField from "./InputField.jsx";
import { validateLogin } from "../validation.js";
import { loginUser } from "../auth.js";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: location.state?.email || "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateLogin(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const session = await loginUser(form);
      onLogin(session);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Welcome back</h1>
      <p className="muted">Log in to continue to your dashboard</p>
      {location.state?.registered && <div className="alert success">Registration successful! Please log in.</div>}
      {serverError && <div className="alert danger">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange}
          error={errors.email} placeholder="you@example.com" />
        <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange}
          error={errors.password} placeholder="Your password" />
        <button type="submit" className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
      <p className="switch">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
