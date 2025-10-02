import React, { useState } from "react";
import { X, Save, Calendar } from "lucide-react";
import { careTypes } from "./dummyData";

export default function CareScheduleModal({ lead, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ type: "call", date: "", time: "", note: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      console.log("Schedule care:", { leadId: lead?.id, ...formData });
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Đặt lịch chăm sóc</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hình thức</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300">
                {careTypes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Giờ</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
              <input name="note" value={formData.note} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg border-slate-300" placeholder="Nội dung" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Hủy</button>
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-lg disabled:opacity-50">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

