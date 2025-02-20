"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Request failed");

      console.log(isLogin ? "Login Success:" : "Signup Success:", result);

      // Store employee data in localStorage
      localStorage.setItem("user", JSON.stringify(result));

      // Redirect based on role
      if (data.role === "admin") router.push("/admin-dashboard");
      else router.push("/dashboard"); // Employee Dashboard

    } catch (error: any) {
      alert(error.message);
    }
    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-center">{isLogin ? "Login" : "Sign Up"}</h2>

        <div className="flex justify-between my-4">
          <button
            className={`w-1/2 p-2 ${isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 p-2 ${!isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium">Select Your Role</label>
            <select {...register("role")} className="mt-1 block w-full border-gray-300 rounded-md">
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input type="text" {...register("name")} className="w-full p-2 border rounded-md" required />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" {...register("email")} className="w-full p-2 border rounded-md" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" {...register("password")} className="w-full p-2 border rounded-md" required />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
