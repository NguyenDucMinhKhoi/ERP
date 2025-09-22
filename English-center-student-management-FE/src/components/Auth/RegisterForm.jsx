import React from 'react';

export default function RegisterForm({ onBack }) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold text-slate-800">Đăng ký tài khoản</h1>
        <p className="mt-1 text-sm text-slate-500">Nhập thông tin để tạo tài khoản mới</p>
      </div>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tên người dùng</label>
          <input type="text" placeholder="Tên người dùng" className="w-full px-3 py-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
          <input type="password" placeholder="Mật khẩu" className="w-full px-3 py-2 border rounded" required />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Đăng ký</button>
      </form>
      <div className="mt-5 text-center text-sm">
        <button type="button" className="font-semibold text-primary-main underline underline-offset-4" onClick={onBack}>
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}
