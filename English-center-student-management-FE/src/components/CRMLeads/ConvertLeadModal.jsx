import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import crmService from "../../services/crmService";

export default function ConvertLeadModal({ lead, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);

  const submit = async () => {
    if (!lead?.id) {
      setError("Không xác định lead.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await crmService.convertLead(lead.id);
      onSuccess?.();
    } catch (err) {
      console.error("Convert lead error:", err);
      setError(
        (err?.response && (err.response.data?.detail || JSON.stringify(err.response.data))) ||
          err.message ||
          "Có lỗi khi chuyển lead. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Chuyển lead thành học viên</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-slate-700 mb-2">
                Bạn có chắc muốn chuyển{" "}
                <span className="font-semibold text-primary-main whitespace-nowrap">
                  {lead?.name}
                </span>{" "}
                thành học viên?
              </p>
              <p className="text-slate-600 text-sm">
                Dữ liệu sẽ được đồng bộ sang module Quản lý học viên.
              </p>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              onClick={onClose} 
              className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={submit} 
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary-main rounded-lg hover:bg-primary-dark transition-colors"
              disabled={isSubmitting}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}