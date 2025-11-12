import React, { useState } from "react";
import notificationsService from "../../services/notificationsService";

export default function ConversationModal({ thread, onClose, onReply }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!message.trim()) {
      alert("Vui lòng nhập nội dung trả lời");
      return;
    }

    setSending(true);
    try {
      // Gửi phản hồi qua API
      const apiData = await notificationsService.sendReply({
        originalNotificationId: thread.id,
        replyMessage: message,
        recipientIds: thread.recipients,
      });
      
      const replyData = {
        id: apiData.id || Date.now(),
        originalNotificationId: thread.id,
        recipientIds: thread.recipients, // Gửi ngược lại cho người gửi thông báo A
        replyMessage: message,
        timestamp: apiData.created_at || new Date().toISOString(),
        sentAt: new Date(apiData.created_at || new Date()).toLocaleString('vi-VN'),
      };
      
      console.log("Reply notification:", replyData);
      
      // Gọi callback để lưu reply
      if (onReply) {
        onReply(replyData);
      }
      
      alert("Đã gửi phản hồi thành công!");
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert(`Có lỗi xảy ra khi gửi phản hồi: ${error.response?.data?.message || error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1">
            <div className="text-sm text-slate-600">Thông báo</div>
            <div className="text-lg font-semibold">{thread.title}</div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 cursor-pointer text-2xl leading-none px-2"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Thông báo gốc */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-blue-700">Thông báo gốc</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {thread.channel === 'app' ? 'App' : thread.channel === 'sms' ? 'SMS' : 'Email'}
              </span>
            </div>
            <div className="text-sm text-slate-700 whitespace-pre-wrap">
              {thread.content}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Gửi lúc: {thread.sentAt}
            </div>
          </div>

          {/* Form trả lời */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phản hồi của bạn
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung phản hồi..."
              rows={4}
              className="w-full px-3 py-2 border rounded-lg border-slate-300 resize-vertical"
            />
            <div className="text-xs text-slate-500 mt-1">
              Phản hồi này sẽ được gửi đến người đã gửi thông báo ban đầu
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={send}
            disabled={sending || !message.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-primary-dark"
          >
            {sending ? "Đang gửi..." : "Gửi phản hồi"}
          </button>
        </div>
      </div>
    </div>
  );
}
