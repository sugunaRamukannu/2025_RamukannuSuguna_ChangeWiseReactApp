import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      try {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const expiry = payload.exp * 1000;
        const timeLeft = expiry - Date.now();

        if (timeLeft > 0) {
          setTimeout(() => {
            localStorage.removeItem("token");
            navigate("/login");
          }, timeLeft);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
      navigate("/coins");
    } else {
      setMsg(data.error.errorMsg);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: 400 }}>
        <h3 className="text-center mb-3"> Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Username:</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {msg && <div className="alert alert-danger">{msg}</div>}
          <div className="d-grid">
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
