import React, { useState } from "react";

export default function ConversationModal({ thread, onClose }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    console.log("Reply thread:", { threadId: thread.id, message });
    setMessage("");
    setSending(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-sm text-slate-600">Trò chuyện với</div>
            <div className="text-lg font-semibold">{thread.studentName}</div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            Đóng
          </button>
        </div>
        <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
          <div className="text-sm text-slate-600">{thread.lastMessage}</div>
        </div>
        <div className="p-4 border-t flex items-center gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập trả lời..."
            className="flex-1 px-3 py-2 border rounded-lg border-slate-300"
          />
          <button
            onClick={send}
            disabled={sending}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-lg disabled:opacity-50 cursor-pointer "
          >
            {sending ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
}
