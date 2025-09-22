import React from "react";
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  MessageSquare 
} from "lucide-react";
import { QuickActionButton } from "../shared";

export default function QuickActions({ onActionClick }) {
  const actions = [
    {
      icon: <Users className="h-4 w-4" />,
      title: "Thêm Học Viên",
      description: "Đăng ký học viên mới",
      color: "bg-primary-main",
      action: "add-student"
    },
    {
      icon: <GraduationCap className="h-4 w-4" />,
      title: "Tạo Khóa Học",
      description: "Thêm khóa học mới",
      color: "bg-info",
      action: "add-course"
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      title: "Ghi Thanh Toán",
      description: "Nhập thanh toán học phí",
      color: "bg-success",
      action: "add-payment"
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      title: "Gửi Thông Báo",
      description: "Thông báo đến học viên",
      color: "bg-warning",
      action: "send-notification"
    }
  ];

  return (
    <div className="card p-6">
      <h3 className="mb-4 text-lg font-semibold">Thao Tác Nhanh</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <QuickActionButton
            key={index}
            icon={action.icon}
            title={action.title}
            description={action.description}
            color={action.color}
            onClick={() => onActionClick?.(action.action, action)}
          />
        ))}
      </div>
    </div>
  );
}
