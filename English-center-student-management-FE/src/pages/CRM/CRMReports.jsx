import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  UserCheck, 
  UserX,
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

export default function CRMReports() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [reportData, setReportData] = useState(null);

  // Mock data - sẽ thay thế bằng API call
  useEffect(() => {
    const mockData = {
      conversionFunnel: {
        leads: 150,
        contacted: 120,
        interested: 85,
        enrolled: 45,
        conversionRate: 30.0
      },
      churnRate: {
        totalStudents: 1247,
        churnedThisMonth: 23,
        churnRate: 1.8,
        previousMonthChurn: 2.1,
        trend: 'down'
      },
      leadSources: [
        { source: 'Website', count: 45, percentage: 30.0 },
        { source: 'Facebook', count: 38, percentage: 25.3 },
        { source: 'Google Ads', count: 32, percentage: 21.3 },
        { source: 'Referral', count: 20, percentage: 13.3 },
        { source: 'Other', count: 15, percentage: 10.0 }
      ],
      monthlyTrends: [
        { month: 'T1', leads: 120, enrollments: 35, churn: 18 },
        { month: 'T2', leads: 135, enrollments: 42, churn: 21 },
        { month: 'T3', leads: 150, enrollments: 45, churn: 23 },
        { month: 'T4', leads: 142, enrollments: 38, churn: 19 },
        { month: 'T5', leads: 168, enrollments: 52, churn: 25 },
        { month: 'T6', leads: 155, enrollments: 48, churn: 22 }
      ]
    };

    setTimeout(() => {
      setReportData(mockData);
      setLoading(false);
    }, 1000);
  }, [dateRange]);

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-error" />
    );
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Báo Cáo CRM</h1>
          <p className="text-slate-600 mt-1">Phân tích hiệu suất chăm sóc khách hàng và chuyển đổi</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
            <option value="1year">1 năm qua</option>
          </select>
          <button className="btn btn-outline flex items-center gap-2">
            <Download className="h-4 w-4" />
            Xuất Báo Cáo
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Làm Mới
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Tỷ Lệ Chuyển Đổi</p>
              <p className="text-2xl font-bold text-slate-800">
                {reportData.conversionFunnel.conversionRate}%
              </p>
            </div>
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary-main" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">Lead → Đăng ký</span>
            <span className="text-sm text-success font-medium">+2.3%</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Tỷ Lệ Rời Bỏ</p>
              <p className="text-2xl font-bold text-slate-800">
                {reportData.churnRate.churnRate}%
              </p>
            </div>
            <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-success" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">So với tháng trước</span>
            <span className="text-sm text-success font-medium">-0.3%</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Lead Mới</p>
              <p className="text-2xl font-bold text-slate-800">
                {reportData.conversionFunnel.leads}
              </p>
            </div>
            <div className="h-12 w-12 bg-info-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-info" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">Tháng này</span>
            <span className="text-sm text-success font-medium">+12%</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Học Viên Mới</p>
              <p className="text-2xl font-bold text-slate-800">
                {reportData.conversionFunnel.enrolled}
              </p>
            </div>
            <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-success" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">Đã đăng ký</span>
            <span className="text-sm text-success font-medium">+8%</span>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-6">Phễu Chuyển Đổi (Conversion Funnel)</h3>
        <div className="space-y-4">
          {[
            { 
              stage: 'Lead', 
              count: reportData.conversionFunnel.leads, 
              percentage: 100,
              color: 'bg-primary-main'
            },
            { 
              stage: 'Đã Liên Hệ', 
              count: reportData.conversionFunnel.contacted, 
              percentage: (reportData.conversionFunnel.contacted / reportData.conversionFunnel.leads * 100).toFixed(1),
              color: 'bg-info'
            },
            { 
              stage: 'Quan Tâm', 
              count: reportData.conversionFunnel.interested, 
              percentage: (reportData.conversionFunnel.interested / reportData.conversionFunnel.leads * 100).toFixed(1),
              color: 'bg-warning'
            },
            { 
              stage: 'Đăng Ký', 
              count: reportData.conversionFunnel.enrolled, 
              percentage: (reportData.conversionFunnel.enrolled / reportData.conversionFunnel.leads * 100).toFixed(1),
              color: 'bg-success'
            }
          ].map((stage) => (
            <div key={stage.stage} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-slate-700">
                {stage.stage}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{stage.count} người</span>
                  <span className="text-sm font-medium text-slate-800">{stage.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${stage.color}`}
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Nguồn Lead</h3>
          <div className="space-y-4">
            {reportData.leadSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${
                    ['bg-primary-main', 'bg-info', 'bg-success', 'bg-warning', 'bg-slate-500'][index]
                  }`}></div>
                  <span className="text-sm font-medium">{source.source}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{source.count}</div>
                  <div className="text-xs text-slate-500">{source.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Xu Hướng Churn Rate</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Tháng hiện tại</p>
                <p className="text-2xl font-bold text-slate-800">
                  {reportData.churnRate.churnRate}%
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {getTrendIcon(reportData.churnRate.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(reportData.churnRate.trend)}`}>
                    {reportData.churnRate.trend === 'down' ? '-' : '+'}
                    {Math.abs(reportData.churnRate.churnRate - reportData.churnRate.previousMonthChurn).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-slate-500">vs tháng trước</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">Tổng học viên</p>
                <p className="text-lg font-semibold">{reportData.churnRate.totalStudents}</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">Rời bỏ tháng này</p>
                <p className="text-lg font-semibold text-error">{reportData.churnRate.churnedThisMonth}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart Placeholder */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-6">Xu Hướng 6 Tháng Gần Đây</h3>
        <div className="h-64 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-primary-main mx-auto mb-2" />
            <p className="text-slate-600">Biểu đồ xu hướng sẽ được hiển thị ở đây</p>
            <p className="text-sm text-slate-500 mt-1">
              Dữ liệu: {reportData.monthlyTrends.length} tháng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
