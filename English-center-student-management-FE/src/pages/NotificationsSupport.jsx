import React, { useEffect, useState } from "react";
import Composer from "../components/Notifications/Composer";
import RecipientPicker from "../components/Notifications/RecipientPicker";
import FeedbackList from "../components/Notifications/FeedbackList";
import ConversationModal from "../components/Notifications/ConversationModal";
import authService from "../services/authService";
import { ROLES } from "../utils/permissions";

export default function NotificationsSupport() {
  const [role, setRole] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [recipients, setRecipients] = useState([]);

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

  const isAdmin = role === ROLES.ADMIN;

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

      <Composer
        isAdmin={isAdmin}
        recipients={recipients}
        onRecipientsChange={setRecipients}
      />

      <RecipientPicker
        isAdmin={isAdmin}
        value={recipients}
        onChange={setRecipients}
      />

      <FeedbackList
        onOpenThread={(thread) => {
          setSelectedThread(thread);
          setShowConversation(true);
        }}
      />

      {showConversation && selectedThread && (
        <ConversationModal
          thread={selectedThread}
          onClose={() => setShowConversation(false)}
        />
      )}
    </div>
  );
}
