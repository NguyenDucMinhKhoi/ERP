import React, { useMemo, useState } from 'react';
import { BookOpen, Calendar, CreditCard, MessageSquare, User } from 'lucide-react';
import { StudentContext } from './studentContext';
import {
  StudentDashboard,
  StudentCourses,
  StudentSchedule,
  StudentPayment,
  StudentProfile,
  StudentSupport
} from '../student/modules';

export default function StudentModules({ initialModule = 'dashboard', visibleTabs }) {
  const [activeSubTab, setActiveSubTab] = useState(initialModule);

  const allSubTabs = useMemo(() => ([
    { id: 'dashboard', label: 'Overview', icon: User },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'payment', label: 'Billing', icon: CreditCard },
    { id: 'profile', label: 'Account', icon: User },
    { id: 'support', label: 'Support', icon: MessageSquare }
  ]), []);

  const subTabs = useMemo(() => {
    if (!visibleTabs || visibleTabs.length === 0) return allSubTabs;
    const set = new Set(visibleTabs);
    return allSubTabs.filter(t => set.has(t.id));
  }, [allSubTabs, visibleTabs]);

  const renderContent = () => {
    switch (activeSubTab) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'courses':
        return <StudentCourses />;
      case 'schedule':
        return <StudentSchedule />;
      case 'payment':
        return <StudentPayment />;
      case 'profile':
        return <StudentProfile />;
      case 'support':
        return <StudentSupport />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <StudentContext.Provider value={{ currentModule: activeSubTab, setCurrentModule: setActiveSubTab }}>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Student</h2>
          <p className="text-slate-600 mt-1">Student experience integrated into CRM</p>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSubTab === tab.id
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
          {renderContent()}
        </div>
      </div>
    </StudentContext.Provider>
  );
}


