import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./InputField.jsx";
import { validateRegistration, passwordStrength } from "../validation.js";
import { registerUser } from "../auth.js";

const initial = { username: "", email: "", password: "", confirmPassword: "" };

export default function Registration() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const strength = passwordStrength(form.password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateRegistration(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      await registerUser(form);
      navigate("/login", { state: { registered: true, email: form.email } });
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h1>Create account</h1>
      <p className="muted">Register to get started</p>
      {serverError && <div className="alert danger">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <InputField label="Username" name="username" value={form.username} onChange={handleChange}
          error={errors.username} placeholder="e.g. nakul_t" />
        <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange}
          error={errors.email} placeholder="you@example.com" />
        <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange}
          error={errors.password} placeholder="At least 8 characters" />
        {form.password && (
          <div className="strength">
            <div className={`bar s${strength.score}`} style={{ width: `${(strength.score / 4) * 100}%` }} />
            <span>{strength.label}</span>
          </div>
        )}
        <InputField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword}
          onChange={handleChange} error={errors.confirmPassword} placeholder="Re-enter password" />
        <button type="submit" className="btn">Register</button>
      </form>
      <p className="switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
