import React, { useState } from "react";
import CourseList from "../components/CourseManagement/CourseList";
import CreateCourseForm from "../components/CourseManagement/CreateCourseForm";
import ClassList from "../components/CourseManagement/ClassList";
import CreateClassForm from "../components/CourseManagement/CreateClassForm";
import AssignStudentsModal from "../components/CourseManagement/AssignStudentsModal";
import ScheduleManagement from "../components/CourseManagement/ScheduleManagement";
import AttendanceTracking from "../components/CourseManagement/AttendanceTracking";

export default function CourseManagement() {
  const [activeTab, setActiveTab] = useState("courses");
  const [showCreateClassForm, setShowCreateClassForm] = useState(false);
  const [showCreateCourseForm, setShowCreateCourseForm] = useState(false);
  const [showAssignStudentsModal, setShowAssignStudentsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleCreateClass = () => {
    setShowCreateClassForm(true);
  };

  const handleCreateCourse = () => {
    setShowCreateCourseForm(true);
  };

  const handleAssignStudents = (classData) => {
    setSelectedClass(classData);
    setShowAssignStudentsModal(true);
  };

  const handleManageSchedule = (classData) => {
    setSelectedClass(classData);
    setShowScheduleModal(true);
  };

  const handleTrackAttendance = (classData) => {
    setSelectedClass(classData);
    setShowAttendanceModal(true);
  };

  const handleCloseModals = () => {
    setShowCreateClassForm(false);
    setShowCreateCourseForm(false);
    setShowAssignStudentsModal(false);
    setShowScheduleModal(false);
    setShowAttendanceModal(false);
    setSelectedClass(null);
  };

  const tabs = [
    { id: "courses", label: "Khóa học", icon: "📚" },
    { id: "classes", label: "Lớp học", icon: "🏫" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Quản lý khóa học & lớp học
          </h1>
          <p className="text-slate-600">
            Quản lý khóa học, tạo lớp học và theo dõi điểm danh
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCreateCourse}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors cursor-pointer"
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
            Tạo khóa học mới
          </button>
          <button
            onClick={handleCreateClass}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors cursor-pointer"
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
            Tạo lớp học mới
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm interactive-tab cursor-pointer ${
                activeTab === tab.id
                  ? "border-primary-main text-primary-main"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "courses" && <CourseList />}
        {activeTab === "classes" && (
          <ClassList
            onAssignStudents={handleAssignStudents}
            onManageSchedule={handleManageSchedule}
            onTrackAttendance={handleTrackAttendance}
          />
        )}
      </div>

      {/* Modals */}
      {showCreateCourseForm && (
        <CreateCourseForm
          onClose={handleCloseModals}
          onSuccess={handleCloseModals}
        />
      )}

      {showCreateClassForm && (
        <CreateClassForm
          onClose={handleCloseModals}
          onSuccess={handleCloseModals}
        />
      )}

      {showAssignStudentsModal && selectedClass && (
        <AssignStudentsModal
          classData={selectedClass}
          onClose={handleCloseModals}
          onSuccess={handleCloseModals}
        />
      )}

      {showScheduleModal && selectedClass && (
        <ScheduleManagement
          classData={selectedClass}
          onClose={handleCloseModals}
          onSuccess={handleCloseModals}
        />
      )}

      {showAttendanceModal && selectedClass && (
        <AttendanceTracking
          classData={selectedClass}
          onClose={handleCloseModals}
          onSuccess={handleCloseModals}
        />
      )}
    </div>
  );
}
