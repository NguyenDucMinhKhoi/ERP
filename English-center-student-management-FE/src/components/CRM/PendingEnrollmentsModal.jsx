import React, { useEffect, useState } from 'react';

export default function PendingEnrollmentsModal({ isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setError('');
      setLoading(true);
      // Mock pending enrollments for UI-only preview
      setTimeout(() => {
        setItems([
          {
            id: 'dk1',
            hocvien_info: { ten: 'Tran Thi B', email: 'b@example.com' },
            khoahoc_info: { ten: 'IELTS Foundation' },
            ngay_dang_ky: new Date().toISOString(),
          },
          {
            id: 'dk2',
            hocvien_info: { ten: 'Nguyen Van C', email: 'c@example.com' },
            khoahoc_info: { ten: 'TOEIC Intensive' },
            ngay_dang_ky: new Date().toISOString(),
          },
          {
            id: 'dk3',
            hocvien_info: { ten: 'Le Van D', email: 'd@example.com' },
            khoahoc_info: { ten: 'Speaking Mastery' },
            ngay_dang_ky: new Date().toISOString(),
          },
        ]);
        setLoading(false);
      }, 300);
    }
    if (isOpen) load();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async (id) => {
    // UI-only: remove item locally
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 text-lg font-semibold text-slate-800">Đăng ký chờ xác nhận</div>
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        <div className="max-h-[60vh] overflow-auto">
          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">Đang tải...</div>
          ) : items.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">Không có đăng ký chờ</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2">Học viên</th>
                  <th className="py-2">Khóa học</th>
                  <th className="py-2">Ngày đăng ký</th>
                  <th className="py-2 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b last:border-0">
                    <td className="py-2">{it.hocvien_info?.ten} ({it.hocvien_info?.email})</td>
                    <td className="py-2">{it.khoahoc_info?.ten}</td>
                    <td className="py-2">{new Date(it.ngay_dang_ky).toLocaleString()}</td>
                    <td className="py-2 text-right">
                      <button onClick={() => handleConfirm(it.id)} className="rounded-xl bg-primary-main px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">Xác nhận</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => onClose?.()} className="rounded-xl border border-slate-200 bg-surface px-4 py-2 text-sm hover:bg-slate-100">Đóng</button>
        </div>
      </div>
    </div>
  );
}


