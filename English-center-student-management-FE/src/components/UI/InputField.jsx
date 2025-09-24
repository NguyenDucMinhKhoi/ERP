import React from "react";

export default function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}) {
  return (
    <div className="flex items-center gap-4">
      {label && (
        <label
          htmlFor={name}
          className="w-40 shrink-0 text-sm font-medium text-slate-700"
        >
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-required={required ? "true" : undefined}
        className="flex-1 rounded-xl border border-slate-200 bg-surface px-4 py-3 text-sm outline-none ring-primary-light placeholder:text-slate-400 focus:ring-2"
      />
    </div>
  );
}
