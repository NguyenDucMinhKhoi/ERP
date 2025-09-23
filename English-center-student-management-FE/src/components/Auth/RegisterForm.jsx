import React from 'react';

export default function RegisterForm({ onBack }) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold text-slate-800">Register an account
        </h1>
        <p className="mt-1 text-sm text-slate-500">Enter information to create a new account</p>
      </div>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input type="text" placeholder="Username" className="w-full px-3 py-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input type="password" placeholder="Password" className="w-full px-3 py-2 border rounded" required />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Sign up</button>
      </form>
      <div className="mt-5 text-center text-sm">
        <button type="button" className="font-semibold text-primary-main underline underline-offset-4" onClick={onBack}>
        Return to login
        </button>
      </div>
    </div>
  );
}
