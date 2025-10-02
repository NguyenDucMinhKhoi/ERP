import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Calendar 
} from "lucide-react";
import { ModuleCard } from "../shared";
import { ConvertLeadModal, PendingEnrollmentsModal } from "../CRM";

export default function ModuleOverview({ onModuleAction }) {
  const navigate = useNavigate();
  // const [showConvert, setShowConvert] = React.useState(false);
  const [showPending, setShowPending] = React.useState(false);
  const [pendingCount] = React.useState(3); // UI-only mock count
  const modules = [
    {
      title: "CRM - Quản Lý Học Viên",
      icon: <Users className="h-6 w-6" />,
      color: "bg-primary-main",
      stats: [
        { label: "Tổng học viên", value: "1,247" },
        { label: "Lead mới", value: "89" },
        { label: "Chuyển đổi", value: "23%" }
      ],
      actions: [
        "Xem danh sách học viên",
        "Xác nhận học viên chờ",
        "Chăm sóc học viên"
      ],
      navigate: () => navigate('/crm')
    },
    {
      title: "Academic - Quản Lý Khóa Học",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-info",
      stats: [
        { label: "Khóa đang mở", value: "24" },
        { label: "Buổi học hôm nay", value: "12" },
        { label: "Tỷ lệ điểm danh", value: "94%" }
      ],
      actions: [
        "Quản lý lịch học",
        "Điểm danh",
        "Xem tiến độ"
      ]
    },
    {
      title: "Finance - Quản Lý Tài Chính",
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-success",
      stats: [
        { label: "Doanh thu tháng", value: "₫2.4B" },
        { label: "Học viên nợ phí", value: "23" },
        { label: "Tỷ lệ thu phí", value: "97%" }
      ],
      actions: [
        "Ghi thanh toán",
        "Xuất hóa đơn",
        "Báo cáo doanh thu"
      ]
    },
    {
      title: "Operations - Vận Hành",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-warning",
      stats: [
        { label: "Đăng ký mới", value: "45" },
        { label: "Hoàn thành", value: "32" },
        { label: "Tỷ lệ hoàn thành", value: "87%" }
      ],
      actions: [
        "Quản lý đăng ký",
        "Phân lớp học viên",
        "Báo cáo tổng hợp"
      ]
    }
  ];

  // Disable whole-card navigation; actions control behavior

  const handleAction = (title, action, idx) => {
    if (title === 'CRM - Quản Lý Học Viên' && action === 'Xem danh sách học viên') {
      navigate('/crm');
      return;
    }
    if (title === 'CRM - Quản Lý Học Viên' && action === 'Xác nhận học viên chờ') {
      setShowPending(true);
      return;
    }
    onModuleAction?.(title, action, idx);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {modules.map((module, index) => (
        <div key={index} className="cursor-default">
          <ModuleCard
            title={module.title}
            icon={module.icon}
            color={module.color}
            stats={module.stats}
            actions={module.actions}
            actionBadges={{ 'Xác nhận học viên chờ': pendingCount }}
            onActionClick={(action, actionIndex) => handleAction(module.title, action, actionIndex)}
          />
        </div>
      ))}
      {/* {showConvert && (
        <ConvertLeadModal isOpen={showConvert} onClose={() => setShowConvert(false)} />
      )} */}
      {showPending && (
        <PendingEnrollmentsModal
          isOpen={showPending}
          onClose={() => setShowPending(false)}
        />
      )}
    </div>
  );
}
