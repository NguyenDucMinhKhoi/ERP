    import React from "react";
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  UserCheck
} from "lucide-react";
import { 
    KPICard, 
    MetricCard, 
    ChartPlaceholder 
} from "../../components/shared";
import HeroSection from "../../components/Mainpage/HeroSection";
import CoursesSection from "../../components/Mainpage/CoursesSection";
import CallToAction from "../../components/Mainpage/CallToAction";

export default function Mainpage() {
    return (
        <div className="space-y-6">
            <HeroSection />

            {/* KPI Cards - Top Level Metrics (kept from original) */}
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Vì sao nên lựa chọn chúng tôi?</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <KPICard
                        title="Tổng Học Viên"
                        value="1,247"
                        delta="+12%"
                        tone="success"
                        icon={<Users className="h-5 w-5" />}
                        description="So với tháng trước"
                    />  
                    <KPICard
                        title="Khóa Học Đang Mở"
                        value="32"
                        delta="+8%"
                        tone="success"
                        icon={<GraduationCap className="h-5 w-5" />}
                        description="So với tháng trước"
                    />
                    <KPICard
                        title="Tỷ Lệ Hoàn Thành"
                        value="87%"
                        delta="+5%"
                        tone="success"
                        icon={<TrendingUp className="h-5 w-5" />}
                        description="Trung bình các khóa"
                    />
                </div>
            </div>

            <CoursesSection />
            <CallToAction />
        </div>
    );
}