import React, { useState, useEffect } from "react";

export default function RevenueReport({ filters, payments = [], enrollments = [], courses = [], loading = false }) {
  const [canViewDetail] = useState(true); // Có thể lấy từ user permissions
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    thisMonth: 0,
  });
  const [rows, setRows] = useState([]);

  // Tính toán doanh thu dựa trên data từ props
  useEffect(() => {
    if (!filters.to || loading) return; // Chờ filter được set và data load xong

    try {
      // Tạo map để lookup tên khóa học
      const courseMap = {};
      courses.forEach(course => {
        courseMap[course.id] = course.ten;
      });

      // 1. Tính tổng doanh thu (tất cả thanh toán đến ngày mới nhất)
      const totalRevenue = payments
        .filter(payment => {
          const paymentDate = new Date(payment.ngay_dong);
          const filterToDate = new Date(filters.to);
          return paymentDate <= filterToDate;
        })
        .reduce((sum, payment) => sum + Number(payment.so_tien || 0), 0);

      // 2. Tính doanh thu tháng này (dựa trên filter đến ngày)
      const toDate = new Date(filters.to);
      const fromDateForMonth = new Date(toDate);
      fromDateForMonth.setMonth(toDate.getMonth() - 1); // 1 tháng trước

      const thisMonthRevenue = payments
        .filter(payment => {
          const paymentDate = new Date(payment.ngay_dong);
          return paymentDate >= fromDateForMonth && paymentDate <= toDate;
        })
        .reduce((sum, payment) => sum + Number(payment.so_tien || 0), 0);

      // 3. Lấy danh sách thanh toán trong khoảng thời gian filter
      const fromDate = new Date(filters.from || fromDateForMonth);
      let filteredPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.ngay_dong);
        return paymentDate >= fromDate && paymentDate <= toDate;
      });

      // Filter theo khóa học nếu có
      if (filters.course) {
        // Tìm các học viên đăng ký khóa học này
        const courseStudentIds = enrollments
          .filter(enrollment => enrollment.khoahoc == filters.course)
          .map(enrollment => enrollment.hocvien);

        filteredPayments = filteredPayments.filter(payment => 
          courseStudentIds.includes(payment.hocvien)
        );
      }

      // 4. Format dữ liệu cho bảng
      const formattedRows = filteredPayments
        .sort((a, b) => new Date(b.ngay_dong) - new Date(a.ngay_dong))
        .slice(0, 20) // Giới hạn 20 record gần nhất
        .map(payment => {
          // Tìm khóa học của thanh toán này thông qua học viên
          const studentEnrollments = enrollments.filter(e => e.hocvien === payment.hocvien);
          const courseName = studentEnrollments.length > 0 
            ? courseMap[studentEnrollments[0].khoahoc] || 'Không xác định'
            : 'Không xác định';
          const paymentDate = new Date(payment.ngay_dong);
          
          return {
            date: paymentDate.toISOString().split('T')[0], // Format yyyy-mm-dd
            course: courseName,
            amount: Number(payment.so_tien || 0)
          };
        });

      setSummary({
        totalRevenue,
        thisMonth: thisMonthRevenue,
      });

      setRows(formattedRows);

    } catch (error) {
      console.error("Error calculating revenue data:", error);
      setSummary({
        totalRevenue: 0,
        thisMonth: 0,
      });
      setRows([]);
    }
  }, [filters, payments, enrollments, courses, loading]);

  return (
    <div className="space-y-4">
      {loading && (
        <div className="text-center py-4 text-gray-500">
          Đang tải dữ liệu doanh thu...
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tổng doanh thu</div>
          <div className="text-2xl font-bold">
            {summary.totalRevenue.toLocaleString()} đ
          </div>
          <div className="text-xs text-slate-500 mt-1">Đến {filters.to || 'hiện tại'}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tháng này</div>
          <div className="text-2xl font-bold">
            {summary.thisMonth.toLocaleString()} đ
          </div>
          <div className="text-xs text-slate-500 mt-1">Trong tháng đến {filters.to}</div>
        </div>
      </div>

      <div className="h-56 grid place-items-center text-slate-400 border rounded-lg">
        [Revenue chart placeholder]
      </div>

      {canViewDetail ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Số tiền
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">{r.date}</td>
                  <td className="px-4 py-2">{r.course}</td>
                  <td className="px-4 py-2">{r.amount.toLocaleString()} đ</td>
                </tr>
              ))}
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                    Không có dữ liệu thanh toán trong khoảng thời gian này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-slate-600">
          Nhân viên chỉ xem tổng quan. Chi tiết giao dịch chỉ dành cho Admin.
        </div>
      )}
    </div>
  );
}
