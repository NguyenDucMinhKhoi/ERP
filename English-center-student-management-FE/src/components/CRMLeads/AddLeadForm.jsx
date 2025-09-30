import React, { useState } from "react";
import { X, Save, Phone, Mail, User, Tag } from "lucide-react";
import { leadStages } from "./dummyData";

export default function AddLeadForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    stage: "new",
    source: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Tên là bắt buộc";
    if (!formData.phone.trim()) e.phone = "Số điện thoại là bắt buộc";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Email không hợp lệ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      console.log("Create lead:", formData);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Thêm lead mới</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên *</label>
              <input name="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.name ? "border-red-300" : "border-slate-300"}`} placeholder="Nguyễn Văn A" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại *</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.phone ? "border-red-300" : "border-slate-300"}`} placeholder="0901234567" />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input name="email" value={formData.email} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.email ? "border-red-300" : "border-slate-300"}`} placeholder="example@gmail.com" />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nguồn</label>
              <input name="source" value={formData.source} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300" placeholder="Facebook, Website..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nhu cầu học</label>
            <input name="interest" value={formData.interest} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300" placeholder="IELTS, TOEIC..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mức độ quan tâm</label>
              <select name="stage" value={formData.stage} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300">
                {leadStages.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
              <input name="note" value={formData.note} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300" placeholder="Ghi chú thêm..." />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Hủy</button>
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark disabled:opacity-50">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

