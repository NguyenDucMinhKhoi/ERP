import React, { useState } from "react";

export default function Composer({ isAdmin, recipients, onRecipientsChange }) {
  const [channel, setChannel] = useState("app");
  const [scope, setScope] = useState(isAdmin ? "all" : "students");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    console.log("Send notification:", {
      channel,
      scope,
      title,
      content,
      recipients,
    });
    setSending(false);
    setTitle("");
    setContent("");
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kênh
          </label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-slate-300"
          >
            <option value="app">App</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </div>
        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phạm vi
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-slate-300"
            >
              <option value="all">Toàn trung tâm</option>
              <option value="students">Chỉ học viên</option>
            </select>
          </div>
        )}
        {!isAdmin && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phạm vi
            </label>
            <input
              disabled
              value="Chỉ học viên"
              className="w-full px-3 py-2 border rounded-lg border-slate-300 bg-slate-50"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tiêu đề
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-slate-300"
            placeholder="VD: Lịch khai giảng"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nội dung
          </label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-slate-300"
            placeholder="Nội dung thông báo"
          />
        </div>
      </div>

      <div className="flex items-center justify-end mt-4">
        <button
          onClick={send}
          disabled={sending}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-lg disabled:opacity-50"
        >
          {sending ? "Đang gửi..." : "Gửi thông báo"}
        </button>
      </div>
    </div>
  );
}
