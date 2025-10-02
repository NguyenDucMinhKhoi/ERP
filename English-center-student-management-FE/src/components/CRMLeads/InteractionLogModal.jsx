import React, { useState } from "react";
import { X, Save, MessageSquare } from "lucide-react";

export default function InteractionLogModal({ lead, onClose, onSuccess }) {
  const [log, setLog] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      console.log("Add interaction log:", { leadId: lead?.id, log });
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Lưu lịch sử trao đổi</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung</label>
            <textarea value={log} onChange={(e) => setLog(e.target.value)} rows={5} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Kết quả tư vấn, phản hồi của lead..." />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
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

