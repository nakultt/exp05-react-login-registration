export default function Dashboard({ user, onLogout }) {
  const fmt = (iso) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="auth-card dashboard">
      <div className="avatar">{user.username.slice(0, 2).toUpperCase()}</div>
      <h1>Hello, {user.username}!</h1>
      <p className="muted">You have logged in successfully.</p>
      <table>
        <tbody>
          <tr><td>Username</td><td>{user.username}</td></tr>
          <tr><td>Email</td><td>{user.email}</td></tr>
          <tr><td>Registered on</td><td>{fmt(user.createdAt)}</td></tr>
          <tr><td>Last login</td><td>{fmt(user.loginAt)}</td></tr>
        </tbody>
      </table>
      <button className="btn outline" onClick={onLogout}>Logout</button>
    </div>
  );
}
