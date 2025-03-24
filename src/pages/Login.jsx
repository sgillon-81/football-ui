import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/token`, new URLSearchParams({
        username,
        password
      }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      login(response.data.access_token);
      toast.success("✅ Login successful!");
      navigate("/players");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("❌ Login failed. Check username/password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <label className="block mb-2">Username</label>
          <input
            type="text"
            className="w-full p-2 mb-4 bg-gray-700 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 mb-6 bg-gray-700 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
