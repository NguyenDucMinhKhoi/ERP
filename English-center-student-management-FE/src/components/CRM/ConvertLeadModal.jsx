import React, { useEffect, useState } from "react";

export default function ConvertLeadModal({
  isOpen,
  onClose,
  defaultEmail = "",
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [khoahocId, setKhoahocId] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [courses, setCourses] = useState([]);
  const [payment, setPayment] = useState({
    so_tien: "",
    hinh_thuc: "chuyenkhoan",
    so_bien_lai: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Mock courses for UI-only preview (no API)
      setCourses([
        { id: "c1", ten: "IELTS Foundation", hoc_phi: "3,500,000" },
        { id: "c2", ten: "TOEIC Intensive", hoc_phi: "2,800,000" },
        { id: "c3", ten: "Speaking Mastery", hoc_phi: "4,200,000" },
      ]);
      setEmail(defaultEmail);
      setError("");
    }
  }, [isOpen, defaultEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Mock submit only
    const mock = {
      id: "dk_mock",
      hocvien_info: { ten: email.split("@")[0], email },
      khoahoc_info: { id: khoahocId, ten: courses.find((c) => c.id === khoahocId)?.ten },
      ngay_dang_ky: new Date().toISOString(),
      trang_thai: "dang_ky",
      ghi_chu: ghiChu,
    };
    setTimeout(() => {
      setLoading(false);
      onClose?.(mock);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 text-lg font-semibold text-slate-800">
          Chuyển Lead → Học viên
        </div>
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Khóa học
            </label>
            <select
              value={khoahocId}
              onChange={(e) => setKhoahocId(e.target.value)}
              required
              className="w-full rounded border px-3 py-2"
            >
              <option value="" disabled>
                Chọn khóa học
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.ten} - {c.hoc_phi}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Số tiền
              </label>
              <input
                value={payment.so_tien}
                onChange={(e) =>
                  setPayment((p) => ({ ...p, so_tien: e.target.value }))
                }
                type="number"
                min="0"
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Hình thức
              </label>
              <select
                value={payment.hinh_thuc}
                onChange={(e) =>
                  setPayment((p) => ({ ...p, hinh_thuc: e.target.value }))
                }
                className="w-full rounded border px-3 py-2"
              >
                <option value="tienmat">Tiền mặt</option>
                <option value="chuyenkhoan">Chuyển khoản</option>
                <option value="the">Thẻ</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Số biên lai
              </label>
              <input
                value={payment.so_bien_lai}
                onChange={(e) =>
                  setPayment((p) => ({ ...p, so_bien_lai: e.target.value }))
                }
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Ghi chú
            </label>
            <textarea
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              rows={3}
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onClose?.()}
              className="rounded-xl border border-slate-200 bg-surface px-4 py-2 text-sm hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary-main px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
