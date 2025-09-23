import React from "react";
import { useNavigate } from "react-router-dom";
import CreateAccountForm from "../components/CRM/CreateAccountForm.jsx";

export default function CreateAccount() {
  const navigate = useNavigate();

  const handleSubmit = (payload) => {
    console.log("Create account payload:", payload);
    // TODO: integrate API
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-800">Create an account</h1>
        <p className="text-slate-600 mt-1">
        Create a staff or teacher account
        </p>
      </div>

      <CreateAccountForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
