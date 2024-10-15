import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useUserContext } from "../context/useContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });

      console.log("After login", response.data);

      if (response.data.user._id) {
        setData({ email: "", password: "" }); // Reset input fields
        setUser(response.data.user);
        toast.success("Login Successful");

        localStorage.setItem("token", response.data.token);
        console.log(
          response.data.user.role === "admin",
          response.data.user.role
        );
        response.data.user.role === "admin"
          ? navigate("/admin-dashboard")
          : navigate("/join-room");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.error || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign in to your account
        </h2>
        <form onSubmit={loginUser} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
