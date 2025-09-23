import React, { useEffect, useMemo, useState } from "react";
import InputField from "../UI/InputField.jsx";
import Button from "../UI/Button.jsx";

export default function CreateAccountForm({ onSubmit, onCancel }) {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roleType: "employee", // employee | teacher
    employeeRole: "Academic", // Academic | Sales | Finance
    password: "",
    gender: "male",
  });

  const isEmployee = formValues.roleType === "employee";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const generatePassword = () => {
    const random = Math.random().toString(36).slice(-8);
    const complex = `${random}  `;
    setFormValues((prev) => ({
      ...prev,
      password: complex,
      passwordConfirm: complex,
    }));
  };

  // Auto-generate password on mount
  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      email: formValues.email.trim(),
      password: formValues.password,
      role:
        formValues.roleType === "teacher"
          ? { type: "teacher" }
          : { type: "employee", department: formValues.employeeRole },
    };
    onSubmit?.(payload);
  };

  const isValid = useMemo(() => {
    if (!formValues.firstName || !formValues.lastName || !formValues.email)
      return false;
    if (!formValues.password) return false;
    if (isEmployee && !formValues.employeeRole) return false;
    return true;
  }, [formValues, isEmployee]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <InputField
          label="First Name"
          name="firstName"
          value={formValues.firstName}
          onChange={handleChange}
          placeholder="Enter first name"
          required
        />
        <InputField
          label="Last Name"
          name="lastName"
          value={formValues.lastName}
          onChange={handleChange}
          placeholder="Enter last name"
          required
        />
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />

        <div className="flex items-center gap-4">
          <label className="w-40 shrink-0 text-sm font-medium text-slate-700">
            Gender <span className="text-error">*</span>
          </label>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formValues.gender === "male"}
                onChange={handleChange}
              />
              <span>Male</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formValues.gender === "female"}
                onChange={handleChange}
              />
              <span>Female</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="w-40 shrink-0 text-sm font-medium text-slate-700">
            Role <span className="text-error">*</span>
          </label>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="roleType"
                value="employee"
                checked={formValues.roleType === "employee"}
                onChange={handleChange}
              />
              <span>Employee</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="roleType"
                value="teacher"
                checked={formValues.roleType === "teacher"}
                onChange={handleChange}
              />
              <span>Teacher</span>
            </label>
          </div>
        </div>

        {isEmployee && (
          <div className="flex items-center gap-4">
            <label className="w-40 shrink-0 text-sm font-medium text-slate-700">
              Employee Department
            </label>
            <select
              name="employeeRole"
              value={formValues.employeeRole}
              onChange={handleChange}
              className="flex-1 rounded-xl border border-slate-200 bg-surface px-4 py-3 text-sm outline-none ring-primary-light focus:ring-2"
            >
              <option value="Academic">Academic</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-40 shrink-0 text-sm font-medium text-slate-700">
              Password <span className="text-error">*</span>
            </label>
            <div className="flex flex-1 items-center gap-2">
              <input
                type="text"
                name="password"
                value={formValues.password}
                readOnly
                className="flex-1 rounded-xl border border-slate-200 bg-surface px-4 py-3 text-sm outline-none ring-primary-light placeholder:text-slate-400 focus:ring-2"
              />
              <button
                type="button"
                onClick={generatePassword}
                className="rounded-xl border border-transparent bg-primary-main px-8 py-3 text-xs font-medium text-white hover:opacity-90"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={!isValid} className="w-auto px-5">
          Create Account
        </Button>
        <Button
          type="button"
          onClick={() => {
            setFormValues({
              firstName: "",
              lastName: "",
              email: "",
              roleType: "employee",
              employeeRole: "Academic",
              gender: "male",
              password: "",
            });
            generatePassword();
          }}
          className="w-auto px-5 bg-slate-600"
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
