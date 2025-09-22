import React from 'react';

export default function ForgotPasswordForm({ onBack }) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold text-slate-800">Quên mật khẩu</h1>
        <p className="mt-1 text-sm text-slate-500">Nhập email để lấy lại mật khẩu</p>
      </div>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" placeholder="Nhập email của bạn" className="w-full px-3 py-2 border rounded" required />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Gửi yêu cầu</button>
      </form>
      <div className="mt-5 text-center text-sm">
        <button type="button" className="font-semibold text-primary-main underline underline-offset-4" onClick={onBack}>
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}
