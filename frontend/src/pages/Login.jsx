import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2">
            Please enter your details to login
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transform active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
          >
            Sign In
          </button>
        </div>
        <p className="text-center text-slate-600 mt-8 text-sm">
          Don't have an account?
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
