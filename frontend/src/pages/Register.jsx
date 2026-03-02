import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../utils/api";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        username: userName,
        email: email,
        password: password,
      });

      navigate("/");
    } catch (error) {
      alert(error.response?.data.message || "Register Error");
    }
  };
  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="User Name"
        onChange={(e) => setUserName(e.target.value)}
        required
      />
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
      <button>Register</button>
    </form>
  );
};

export default Register;
