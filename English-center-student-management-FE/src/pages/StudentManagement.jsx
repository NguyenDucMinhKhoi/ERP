import React, { useState } from "react";
import StudentList from "../components/StudentManagement/StudentList";
import AddStudentForm from "../components/StudentManagement/AddStudentForm";
import EditStudentForm from "../components/StudentManagement/EditStudentForm";
import StudentProfileModal from "../components/StudentManagement/StudentProfileModal";

export default function StudentManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleAddStudent = () => {
    setShowAddForm(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditForm(true);
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  const handleCloseForms = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowProfileModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Quản lý học viên
          </h1>
          <p className="text-slate-600">
            Quản lý thông tin và theo dõi tình trạng học của học viên
          </p>
        </div>
        <button
          onClick={handleAddStudent}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm học viên
        </button>
      </div>

      {/* Student List */}
      <StudentList
        onEdit={handleEditStudent}
        onViewProfile={handleViewProfile}
      />

      {/* Modals */}
      {showAddForm && (
        <AddStudentForm
          onClose={handleCloseForms}
          onSuccess={handleCloseForms}
        />
      )}

      {showEditForm && selectedStudent && (
        <EditStudentForm
          student={selectedStudent}
          onClose={handleCloseForms}
          onSuccess={handleCloseForms}
        />
      )}

      {showProfileModal && selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={handleCloseForms}
          onEdit={() => {
            setShowProfileModal(false);
            handleEditStudent(selectedStudent);
          }}
        />
      )}
    </div>
  );
}
