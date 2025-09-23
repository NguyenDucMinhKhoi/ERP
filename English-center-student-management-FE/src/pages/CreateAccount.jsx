import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateAccountForm from "../components/CRM/CreateAccountForm.jsx";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = (payload) => {
    console.log("Create account payload:", payload);
    // TODO: integrate API
    setSuccessData(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
        Create an account
        </h1>
        <p className="text-slate-600 mt-1">
        Enter user information to create a new account
        </p>
      </div>
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-800">
              Registered successfully
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Account has been created with information:
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div>
                <span className="font-medium">Email:</span> {successData.email}
              </div>
              <div>
                <span className="font-medium">Password:</span>{" "}
                {successData.password}
              </div>
              <div>
                <span className="font-medium">Role:</span>{" "}
                {successData.role?.type}
                {successData.role?.department
                  ? ` (${successData.role.department})`
                  : ""}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-xl bg-primary-main px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                onClick={() => setSuccessData(null)}
              >
                Create another
              </button>
            </div>
          </div>
        </div>
      )}
      <CreateAccountForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
