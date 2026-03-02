import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/login", { email: email, password: password });
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Login Error");
    }
  };
  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button>Login</button>
    </form>
  );
};

export default Login;
