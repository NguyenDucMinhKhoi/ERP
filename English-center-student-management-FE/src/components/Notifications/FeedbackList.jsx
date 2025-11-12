import React, { useMemo } from "react";
import { students, staff } from "./dummyData";

export default function FeedbackList({ onOpenThread, selectedRecipients, notificationHistory }) {
  const filteredNotifications = useMemo(() => {
    if (!selectedRecipients || selectedRecipients.length === 0) {
      return [];
    }
    
    // Lọc notifications chỉ gửi đến những người được chọn
    return notificationHistory.filter(notif => 
      notif.recipients.some(recipientId => selectedRecipients.includes(recipientId))
    );
  }, [selectedRecipients, notificationHistory]);

  // Hàm lấy tên người nhận
  const getRecipientNames = (recipientIds) => {
    const allPeople = [...students, ...staff];
    const names = recipientIds
      .map(id => {
        const person = allPeople.find(p => p.id === id);
        return person ? person.name : null;
      })
      .filter(Boolean);
    
    if (names.length === 0) return "Không xác định";
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} và ${names[1]}`;
    return `${names[0]} và ${names.length - 1} người khác`;
  };

  if (!selectedRecipients || selectedRecipients.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="text-slate-700 font-medium mb-3">Lịch sử thông báo</div>
        <div className="text-center py-8 text-slate-500 text-sm">
          Chọn người nhận để xem lịch sử thông báo đã gửi
        </div>
      </div>
    );
  }

  if (filteredNotifications.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="text-slate-700 font-medium mb-3">Lịch sử thông báo</div>
        <div className="text-center py-8 text-slate-500 text-sm">
          Chưa có thông báo nào được gửi đến {selectedRecipients.length} người được chọn
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-slate-700 font-medium">Lịch sử thông báo</div>
        <div className="text-xs text-slate-500">
          {filteredNotifications.length} thông báo
        </div>
      </div>
      <div className="divide-y">
        {filteredNotifications.map((notif) => (
          <button
            key={notif.id}
            onClick={() => onOpenThread(notif)}
            className="w-full text-left py-3 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-semibold text-slate-900 line-clamp-1">
                    {notif.title}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                    {notif.channel === 'app' ? 'App' : notif.channel === 'sms' ? 'SMS' : 'Email'}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mb-1 line-clamp-1">
                  {notif.content}
                </div>
                <div className="text-xs text-slate-500">
                  Đến: {getRecipientNames(notif.recipients)}
                </div>
              </div>
              <div className="text-xs text-slate-500 ml-3 flex-shrink-0">{notif.sentAt}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
