import React, { useMemo, useState } from "react";
import InputField from "../UI/InputField.jsx";
import Button from "../UI/Button.jsx";

export default function CreateAccountForm({ onSubmit, onCancel }) {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    roleType: "employee", // employee | teacher
    employeeRole: "Academic", // Academic | Sales | Finance
  });

  const isEmployee = formValues.roleType === "employee";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),
      dateOfBirth: formValues.dob,
      role:
        formValues.roleType === "teacher"
          ? { type: "teacher" }
          : { type: "employee", department: formValues.employeeRole },
    };
    onSubmit?.(payload);
  };

  const isValid = useMemo(() => {
    if (
      !formValues.name ||
      !formValues.email ||
      !formValues.phone ||
      !formValues.dob
    )
      return false;
    if (isEmployee && !formValues.employeeRole) return false;
    return true;
  }, [formValues, isEmployee]);

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Create an account</h2>
        <p className="text-sm text-slate-600 mt-1">
        Enter user information to create a new account
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          label="Username"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <InputField
          label="Phone Number"
          name="phone"
          value={formValues.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <InputField
          label="Date of Birth"
          type="date"
          name="dob"
          value={formValues.dob}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Loại vai trò
          </label>
          <select
            name="roleType"
            value={formValues.roleType}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 text-sm outline-none ring-primary-light focus:ring-2"
          >
            <option value="employee">Staff</option>
            <option value="teacher">Tearcher</option>
          </select>
        </div>

        {isEmployee && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
            Departments
            </label>
            <select
              name="employeeRole"
              value={formValues.employeeRole}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 text-sm outline-none ring-primary-light focus:ring-2"
            >
              <option value="Academic">Academic</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={!isValid} className="w-auto px-5">
          Create Account
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="w-auto px-5 bg-slate-600"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
