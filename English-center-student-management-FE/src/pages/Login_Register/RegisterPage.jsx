import React, { useState } from "react";
import AuthLayout from "../../components/Auth/AuthLayout";
import InputField from "../../components/UI/InputField";
import Button from "../../components/UI/Button";
import Banner from "../../components/Auth/Banner";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("register:", { name, email });
    navigate("/login");
  };

  const Left = (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold text-slate-800">Register</h1>
        <p className="mt-1 text-sm text-slate-500">Create a new account</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <InputField
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          required
        />
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
          autoComplete="new-password"
          required
        />
        <Button type="submit">SIGN UP</Button>
      </form>
      <div className="mt-5 text-center text-sm">
        <span className="text-slate-600">Already have an account? </span>
        <button
          type="button"
          className="font-semibold text-primary-main underline underline-offset-4"
          onClick={() => navigate("/login")}
        >
          Sign in
        </button>
      </div>
    </div>
  );

  return <AuthLayout left={Left} right={<Banner />} />;
}
