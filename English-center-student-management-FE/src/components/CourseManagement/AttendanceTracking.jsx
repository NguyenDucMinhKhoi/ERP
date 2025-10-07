import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  CheckSquare,
  Users,
  Clock,
  Calendar,
  User,
} from "lucide-react";
import courseService from "../../services/courseService";

// Attendance status options
const attendanceStatusOptions = [
  { value: "Có mặt", label: "Có mặt" },
  { value: "Vắng mặt", label: "Vắng mặt" },
  { value: "Đi muộn", label: "Đi muộn" },
  { value: "Về sớm", label: "Về sớm" },
];

export default function AttendanceTracking({ classData, onClose, onSuccess }) {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schedules] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load schedules for this class
        const classSchedules = await courseService.getClassSchedules(classData.id);
        
        if (classSchedules.length > 0) {
          setSelectedSchedule(classSchedules[0]);
        }

        // Load students for this class
        const studentsResponse = await courseService.getStudents();
        const allStudents = studentsResponse.results || [];
        
        // Filter students who are enrolled in this class
        const classStudents = allStudents.filter(student => 
          classData.students && classData.students.includes(student.id)
        );
        setStudents(classStudents);

      } catch (error) {
        console.error('Error loading attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [classData.id, classData.students]);

  useEffect(() => {
    // Initialize attendance data when schedule or students change
    if (selectedSchedule && students.length > 0) {
      const attendance = {};
      students.forEach((student) => {
        attendance[student.id] = {
          status: "Có mặt",
          checkInTime: "",
          notes: "",
        };
      });
      setAttendanceData(attendance);
    }
  }, [selectedSchedule, students]);

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSelectAll = (status) => {
    const newAttendance = { ...attendanceData };
    Object.keys(newAttendance).forEach((studentId) => {
      newAttendance[studentId].status = status;
    });
    setAttendanceData(newAttendance);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Save attendance via API
      await courseService.saveAttendance({
        scheduleId: selectedSchedule.id,
        classId: classData.id,
        attendance: attendanceData,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Có lỗi xảy ra khi lưu điểm danh. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAttendanceStats = () => {
    const total = Object.keys(attendanceData).length;
    const present = Object.values(attendanceData).filter(
      (a) => a.status === "Có mặt"
    ).length;
    const absent = Object.values(attendanceData).filter(
      (a) => a.status === "Vắng mặt"
    ).length;
    const late = Object.values(attendanceData).filter(
      (a) => a.status === "Đi muộn"
    ).length;

    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Điểm danh học viên
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Lớp: {classData?.name} - {classData?.courseName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded interactive-element"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-600">Đang tải dữ liệu...</div>
            </div>
          )}

          {!loading && students.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Không có học viên nào trong lớp này
            </div>
          )}

          {!loading && students.length > 0 && (
            <>
        
          {/* Class Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-slate-500">
                  Giáo viên
                </div>
                <div className="text-sm text-slate-900">
                  {classData?.teacherName}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500">
                  Phòng học
                </div>
                <div className="text-sm text-slate-900">{classData?.room}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500">
                  Số học viên
                </div>
                <div className="text-sm text-slate-900">
                  {classData?.currentStudents} học viên
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Selection */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <div className="text-lg font-medium text-slate-900">
                  {selectedSchedule
                    ? formatDate(selectedSchedule.date)
                    : "Chọn buổi học"}
                </div>
                {selectedSchedule && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>{selectedSchedule.time}</span>
                    <span>•</span>
                    <span>{selectedSchedule.topic}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSelectAll("Có mặt")}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 transition-colors cursor-pointer"
            >
              <CheckSquare className="h-4 w-4" />
              Tất cả có mặt
            </button>
            <button
              onClick={() => handleSelectAll("Vắng mặt")}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
            >
              <Users className="h-4 w-4" />
              Tất cả vắng mặt
            </button>
          </div>

          {/* Attendance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">
                {stats.total}
              </div>
              <div className="text-sm text-slate-600">Tổng số</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.present}
              </div>
              <div className="text-sm text-green-600">Có mặt</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.absent}
              </div>
              <div className="text-sm text-red-600">Vắng mặt</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.late}
              </div>
              <div className="text-sm text-yellow-600">Đi muộn</div>
            </div>
          </div>

          {/* Attendance List */}
          <div className="border border-slate-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Học viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Giờ vào
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Ghi chú
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {students.map((student) => {
                    const attendance = attendanceData[student.id];

                    if (!attendance) return null;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-slate-600">
                                {student.ten?.charAt(0) || student.ho_ten?.charAt(0) || 'N'}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {student.ten || student.ho_ten || 'Chưa có tên'}
                              </div>
                              <div className="text-sm text-slate-500">
                                {student.so_dien_thoai || student.phone || 'Chưa có SĐT'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={attendance.status}
                            onChange={(e) =>
                              handleAttendanceChange(
                                student.id,
                                "status",
                                e.target.value
                              )
                            }
                            className="px-3 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent text-sm"
                          >
                            {attendanceStatusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="time"
                            value={attendance.checkInTime}
                            onChange={(e) =>
                              handleAttendanceChange(
                                student.id,
                                "checkInTime",
                                e.target.value
                              )
                            }
                            className="px-3 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={attendance.notes}
                            onChange={(e) =>
                              handleAttendanceChange(
                                student.id,
                                "notes",
                                e.target.value
                              )
                            }
                            placeholder="Ghi chú..."
                            className="px-3 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent text-sm w-full"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-primary-main focus:border-transparent cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary-main focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Đang lưu..." : "Lưu điểm danh"}
          </button>
        </div>
      </div>
    </div>
  );
}
