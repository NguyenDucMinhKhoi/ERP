import React from "react";
import { 
  UserCheck, 
  CreditCard, 
  AlertCircle, 
  CheckCircle 
} from "lucide-react";
import { ActivityItem } from "../shared";

export default function RecentActivities({ activities = [], onActivityClick }) {
  const defaultActivities = [
    {
      icon: <UserCheck className="h-4 w-4" />,
      title: "Học viên Nguyễn Văn A đăng ký khóa IELTS",
      time: "2 phút trước",
      type: "success"
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      title: "Thanh toán ₫5,000,000 từ học viên Trần Thị B",
      time: "15 phút trước",
      type: "info"
    },
    {
      icon: <AlertCircle className="h-4 w-4" />,
      title: "Học viên Lê Văn C vắng mặt 2 buổi liên tiếp",
      time: "1 giờ trước",
      type: "warning"
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      title: "Khóa TOEIC Basic hoàn thành với 15/18 học viên",
      time: "2 giờ trước",
      type: "success"
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="card p-6">
      <h3 className="mb-4 text-lg font-semibold">Hoạt Động Gần Đây</h3>
      <div className="space-y-3">
        {displayActivities.map((activity, index) => (
          <ActivityItem
            key={index}
            icon={activity.icon}
            title={activity.title}
            time={activity.time}
            type={activity.type}
            onClick={() => onActivityClick?.(activity, index)}
          />
        ))}
      </div>
    </div>
  );
}
