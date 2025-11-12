import React, { useEffect, useState } from "react";
import RecipientPicker from "../components/Notifications/RecipientPicker";
import FeedbackList from "../components/Notifications/FeedbackList";
import ConversationModal from "../components/Notifications/ConversationModal";
import authService from "../services/authService";
import notificationsService from "../services/notificationsService";
import { ROLES } from "../utils/permissions";

export default function NotificationsSupport() {
  const [role, setRole] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (authService.isAuthenticated()) {
          const me = await authService.getMe();
          if (mounted) setRole(me?.role || null);
        }
      } catch {
        if (mounted) setRole(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load notification history from API
  useEffect(() => {
    let mounted = true;
    const loadNotifications = async () => {
      if (recipients.length === 0) {
        setNotificationHistory([]);
        return;
      }

      setLoading(true);
      try {
        const data = await notificationsService.getNotificationsByRecipients(recipients);
        if (mounted) {
          // Transform API data to UI format
          const formattedData = data.map(notif => ({
            id: notif.id,
            title: notif.tieu_de,
            content: notif.noi_dung,
            channel: notif.kenh,
            recipients: notif.nguoi_nhan,
            timestamp: notif.created_at,
            sentAt: new Date(notif.created_at).toLocaleString('vi-VN'),
            isReply: notif.is_reply || false,
          }));
          setNotificationHistory(formattedData);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
        if (mounted) setNotificationHistory([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadNotifications();
    return () => {
      mounted = false;
    };
  }, [recipients]);

  const isAdmin = role === ROLES.ADMIN;

  const handleNotificationSent = (notificationData) => {
    // Thêm thông báo mới vào lịch sử
    setNotificationHistory(prev => [notificationData, ...prev]);
  };

  const handleReply = (replyData) => {
    // Xử lý phản hồi - có thể gửi API hoặc lưu vào state
    console.log("Reply received:", replyData);
    // Có thể thêm vào notification history nếu cần
    const replyNotification = {
      id: replyData.id,
      title: `Re: ${selectedThread?.title || 'Phản hồi'}`,
      content: replyData.replyMessage,
      channel: 'app',
      recipients: replyData.recipientIds,
      timestamp: replyData.timestamp,
      sentAt: replyData.sentAt,
      isReply: true,
    };
    setNotificationHistory(prev => [replyNotification, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Thông báo & Hỗ trợ
        </h1>
        <p className="text-slate-600">
          Soạn thông báo, gửi đến học viên và quản lý phản hồi
        </p>
      </div>

      <RecipientPicker
        isAdmin={isAdmin}
        value={recipients}
        onChange={setRecipients}
        onNotificationSent={handleNotificationSent}
      />

      <FeedbackList
        notificationHistory={notificationHistory}
        selectedRecipients={recipients}
        onOpenThread={(thread) => {
          setSelectedThread(thread);
          setShowConversation(true);
        }}
      />

      {showConversation && selectedThread && (
        <ConversationModal
          thread={selectedThread}
          onClose={() => setShowConversation(false)}
          onReply={handleReply}
        />
      )}
    </div>
  );
}
