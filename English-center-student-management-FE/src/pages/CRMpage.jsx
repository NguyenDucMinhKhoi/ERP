import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  BarChart3,
  TrendingUp,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { StudentList, StudentProfile, CRMReports, StudentModules } from '../components/CRM';
import CareLogForm from '../components/CRM/CareLogForm';
import authService from '../services/authService';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function CRMpage() {
  const [activeTab, setActiveTab] = useState('students');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCareLogForm, setShowCareLogForm] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (authService.isAuthenticated()) {
          const me = await authService.getMe();
          if (mounted) setRole(me?.role || null);
        }
      } catch {
        if (mounted) setRole(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const tabs = [
    {
      id: 'students',
      label: 'Student List',
      icon: Users,
      description: 'Manage student information'
    },
    {
      id: 'profile',
      label: 'Student Profile',
      icon: UserCheck,
      description: 'Student details and timeline'
    },
    {
      id: 'reports',
      label: 'CRM Reports',
      icon: BarChart3,
      description: 'Performance and conversion analytics'
    }
  ];

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setActiveTab('profile');
  };

  const handleAddCareLog = (student) => {
    setSelectedStudent(student);
    setShowCareLogForm(true);
  };

  const handleSaveCareLog = (careLogData) => {
    // TODO: Implement API call to save care log
    setShowCareLogForm(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <StudentList
            onStudentSelect={handleStudentSelect}
            onAddCareLog={handleAddCareLog}
          />
        );
      case 'profile':
        return <StudentProfile student={selectedStudent} />;
      case 'reports':
        return <CRMReports />;
      default:
        return (
          <StudentList
            onStudentSelect={handleStudentSelect}
            onAddCareLog={handleAddCareLog}
          />
        );
    }
  };

  // If user is student: redirect to /student for correct URL
  if (role === 'hocvien') {
    return <Navigate to="/student" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">CRM - Student Management</h1>
        <p className="text-slate-600 mt-1">Customer care and student management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Students</p>
              <p className="text-2xl font-bold text-slate-800">1,247</p>
            </div>
            <Users className="h-8 w-8 text-primary-main" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">+12%</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Care Tasks Today</p>
              <p className="text-2xl font-bold text-slate-800">23</p>
            </div>
            <MessageSquare className="h-8 w-8 text-info" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">+5%</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-slate-800">30%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-success" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">+2.3%</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Churn Rate</p>
              <p className="text-2xl font-bold text-slate-800">1.8%</p>
            </div>
            <AlertCircle className="h-8 w-8 text-warning" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">-0.3%</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-main text-primary-main'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>

      {showCareLogForm && selectedStudent && (
        <CareLogForm
          isOpen={showCareLogForm}
          onClose={() => setShowCareLogForm(false)}
          studentId={selectedStudent.id}
          studentName={selectedStudent.ten}
          onSave={handleSaveCareLog}
        />
      )}
    </div>
  );
}


