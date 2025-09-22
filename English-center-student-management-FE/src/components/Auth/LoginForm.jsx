import React, { useState } from "react";
import InputField from "../UI/InputField";
import Button from "../UI/Button";

import { useNavigate } from "react-router-dom";

export default function LoginForm({ onSubmit, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold text-slate-800">Welcome Back</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your email and password to sign in
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          autoComplete="email"
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          autoComplete="current-password"
          required
        />
        <Button type="submit">SIGN IN</Button>
      </form>
      <div className="mt-5 text-center text-sm">
        <span className="text-slate-600">Forgot your password? </span>
        <button
          type="button"
          className="inline-flex items-center font-semibold text-primary-main underline underline-offset-4 hover:opacity-90"
          onClick={onForgot}
        >
          Reset password
        </button>
      </div>

      <div className="mt-3 text-center text-sm">
        <span className="text-slate-600">Don’t have an account? </span>
        <button
          type="button"
          className="font-semibold text-primary-main underline underline-offset-4"
          onClick={() => navigate("/register")}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
