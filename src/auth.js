// Simulated backend: users are kept in localStorage and passwords are stored as SHA-256 hashes.
const USERS_KEY = "reactAuth.users";
const SESSION_KEY = "reactAuth.session";

async function hash(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export async function registerUser({ username, email, password }) {
  const users = readUsers();
  if (users.some((u) => u.email === email.toLowerCase())) {
    throw new Error("An account with this email already exists");
  }
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error("This username is already taken");
  }
  const user = {
    username,
    email: email.toLowerCase(),
    passwordHash: await hash(password),
    createdAt: new Date().toISOString()
  };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  console.log("[API] POST /register ->", { username: user.username, email: user.email });
  return { username: user.username, email: user.email };
}

export async function loginUser({ email, password }) {
  const users = readUsers();
  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user || user.passwordHash !== (await hash(password))) {
    throw new Error("Invalid email or password");
  }
  const session = { username: user.username, email: user.email, createdAt: user.createdAt, loginAt: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  console.log("[API] POST /login ->", session);
  return session;
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  console.log("[API] POST /logout");
}
