import React, { useState } from "react";
import AuthLayout from "../../components/Auth/AuthLayout";
import InputField from "../../components/UI/InputField";
import Button from "../../components/UI/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const Left = (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold text-slate-800">Forgot Password</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your email to receive a reset link
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("reset request:", email);
          alert("If this email exists, a reset link has been sent.");
        }}
        className="space-y-5"
      >
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
        <Button type="submit">Send reset link</Button>
      </form>
    </div>
  );

  return <AuthLayout left={Left} right={<div />} />;
}
