import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import crmService from "../../services/crmService";

export default function InteractionLogModal({ lead, onClose, onSuccess }) {
  const [log, setLog] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadNote = async () => {
      if (!lead?.id) return;
      setLoading(true);
      try {
        const data = await crmService.getLeadContactNote(lead.id);
        if (!mounted) return;
        // backend returns {} or note object
        const content = data?.content || "";
        setLog(content);
      } catch (err) {
        console.error("Error loading contact note:", err);
        if (mounted) setError("Không thể tải ghi chú liên hệ");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadNote();
    return () => { mounted = false; };
  }, [lead?.id]);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await crmService.saveLeadContactNote(lead.id, { content: log });
      onSuccess?.();
    } catch (err) {
      console.error("Error saving contact note:", err);
      setError("Có lỗi khi lưu ghi chú. Vui lòng thử lại.");
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
          {loading && <div className="text-sm text-slate-600">Đang tải ghi chú...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

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

