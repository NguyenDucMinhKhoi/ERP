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
import { dummyStudents } from "../StudentManagement/dummyData";
import { dummySchedules, attendanceStatusOptions } from "./dummyData";

export default function AttendanceTracking({ classData, onClose, onSuccess }) {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load schedules for this class
    const classSchedules = dummySchedules.filter(
      (s) => s.classId === classData.id
    );
    if (classSchedules.length > 0) {
      setSelectedSchedule(classSchedules[0]);
    }
  }, [classData.id]);

  useEffect(() => {
    // Load attendance data for selected schedule
    if (selectedSchedule) {
      // In real app, this would be an API call
      const attendance = {};
      classData.students.forEach((studentId) => {
        const student = dummyStudents.find((s) => s.id === studentId);
        if (student) {
          attendance[studentId] = {
            status: "Có mặt",
            checkInTime: "",
            notes: "",
          };
        }
      });
      setAttendanceData(attendance);
    }
  }, [selectedSchedule, classData.students]);

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would be an API call
      console.log("Saving attendance:", {
        scheduleId: selectedSchedule.id,
        attendance: attendanceData,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving attendance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      "Có mặt": "bg-green-100 text-green-800",
      "Vắng mặt": "bg-red-100 text-red-800",
      "Đi muộn": "bg-yellow-100 text-yellow-800",
      "Về sớm": "bg-orange-100 text-orange-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
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
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 transition-colors"
            >
              <CheckSquare className="h-4 w-4" />
              Tất cả có mặt
            </button>
            <button
              onClick={() => handleSelectAll("Vắng mặt")}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-colors"
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
                  {classData.students.map((studentId) => {
                    const student = dummyStudents.find(
                      (s) => s.id === studentId
                    );
                    const attendance = attendanceData[studentId];

                    if (!student || !attendance) return null;

                    return (
                      <tr key={studentId} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-slate-600">
                                {student.fullName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {student.fullName}
                              </div>
                              <div className="text-sm text-slate-500">
                                {student.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={attendance.status}
                            onChange={(e) =>
                              handleAttendanceChange(
                                studentId,
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
                                studentId,
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
                                studentId,
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-primary-main focus:border-transparent"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary-main focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Đang lưu..." : "Lưu điểm danh"}
          </button>
        </div>
      </div>
    </div>
  );
}
