export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  return errors;
}

export function validateRegistration({ username, email, password, confirmPassword }) {
  const errors = {};
  if (!username.trim()) errors.username = "Username is required";
  else if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) errors.username = "3-20 letters, numbers or underscore";
  if (!email.trim()) errors.email = "Email is required";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters";
  else if (!/[A-Z]/.test(password) || !/\d/.test(password)) errors.password = "Include an uppercase letter and a number";
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";
  return errors;
}

export function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return { score, label: ["Too weak", "Weak", "Fair", "Good", "Strong"][score] };
}
