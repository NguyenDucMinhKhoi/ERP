import React, { useState, useEffect } from 'react';
import { X, Save, Users, Search, UserPlus, UserMinus } from 'lucide-react';
import courseService from '../../services/courseService';

export default function AssignStudentsModal({ classData, onClose, onSuccess }) {
  console.log('classData in AssignStudentsModal: ', classData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await courseService.getStudents();
        setStudents(response || []);

        // Initialize with current class students
        if (classData && classData.students) {
          setSelectedStudents(classData.students);
        }
      } catch (err) {
        console.error('Error loading students:', err);
        setError('Không thể tải danh sách học viên. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [classData]);

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (student.ten || '').toLowerCase().includes(searchLower) ||
      (student.sdt || '').includes(searchTerm) ||
      (student.email || '').toLowerCase().includes(searchLower);
    return matchesSearch;
  });
  console.log('filteredStudents ', filteredStudents);
  const handleStudentToggle = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    const allStudentIds = filteredStudents.map((student) => student.id);
    setSelectedStudents(allStudentIds);
  };

  const handleDeselectAll = () => {
    setSelectedStudents([]);
  };

  const handleSubmit = async (classId, studentObjsOrIds) => {
    setIsSubmitting(true);

    const studentIds = (studentObjsOrIds || [])
      .map((s) => (typeof s === 'string' ? s : s?.id))
      .filter(Boolean);

    try {
      await courseService.addStudentToClass(classId, studentIds);

      // Update parent with new students count and list
      onSuccess({
        ...classData,
        currentStudents: studentIds.length,
        students: studentIds,
      });
    } catch (error) {
      console.error('Error assigning students:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStudentStatus = (student) => {
    if (student.status === 'Đang học') {
      return 'bg-green-100 text-green-800';
    } else if (student.status === 'Chờ lớp') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (student.status === 'Tạm dừng') {
      return 'bg-orange-100 text-orange-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Gán học viên vào lớp
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
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-600">
                Đang tải danh sách học viên...
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
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
                    <div className="text-sm text-slate-900">
                      {classData?.room}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Số học viên hiện tại
                    </div>
                    <div className="text-sm text-slate-900">
                      {selectedStudents.length}/{classData?.maxStudents}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Actions */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm học viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-main bg-primary-light border border-primary-main rounded-lg hover:bg-primary-main hover:text-white transition-colors cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4" />
                    Chọn tất cả
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer "
                  >
                    <UserMinus className="h-4 w-4" />
                    Bỏ chọn tất cả
                  </button>
                </div>
              </div>

              {/* Students List */}
              <div className="border border-slate-200 rounded-lg">
                <div className="max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  {filteredStudents.map((student) => {
                    const isSelected = selectedStudents.includes(student.id);
                    // Use student.already_in_class for badge
                    return (
                      <div
                        key={student.id}
                        className={`flex items-center gap-4 p-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 ${
                          isSelected ? 'bg-primary-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleStudentToggle(student.id)}
                          className="h-4 w-4 text-primary-main focus:ring-primary-main border-slate-300 rounded"
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-slate-600">
                                {(student.ten || 'N').charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {student.ten || 'Chưa có tên'}
                              </div>
                              <div className="text-sm text-slate-500">
                                {student.sdt || 'Chưa có SĐT'} •{' '}
                                {student.email || 'Chưa có email'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStudentStatus(
                              student
                            )}`}
                          >
                            {student.status}
                          </span>
                          {student.already_in_class && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Đã có trong lớp
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      Đã chọn {selectedStudents.length} học viên
                    </div>
                    <div className="text-sm text-slate-600">
                      Tối đa {classData?.maxStudents} học viên
                    </div>
                  </div>
                  {selectedStudents.length > classData?.maxStudents && (
                    <div className="text-sm text-red-600 font-medium">
                      Vượt quá số lượng cho phép
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-primary-main focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={() => handleSubmit(classData.id, selectedStudents)}
            disabled={
              isSubmitting ||
              loading ||
              selectedStudents.length > classData?.maxStudents
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary-main focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}