import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, CreditCard, MessageSquare, TrendingUp, Clock, Users } from 'lucide-react';
import { useStudentContext } from '../../CRM/studentContext';
import MetricCard from '../../shared/MetricCard';
import QuickActionButton from '../../shared/QuickActionButton';
import ActivityItem from '../../shared/ActivityItem';

function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard 
        title="Enrolled courses" 
        value={stats.enrolledCourses} 
        icon={<BookOpen className="h-6 w-6 text-primary-main" />} 
        color=""
      />
      <MetricCard 
        title="Completed lessons" 
        value={stats.completedLessons} 
        icon={<TrendingUp className="h-6 w-6 text-green-600" />} 
        color=""
      />
      <MetricCard 
        title="Upcoming classes" 
        value={stats.upcomingClasses} 
        icon={<Clock className="h-6 w-6 text-orange-600" />} 
        color=""
      />
      <MetricCard 
        title="Total hours" 
        value={`${stats.totalHours}h`} 
        icon={<Users className="h-6 w-6 text-purple-600" />} 
        color=""
      />
    </div>
  );
}

function QuickActionsGrid({ actions }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <QuickActionButton
          key={index}
          onClick={action.onClick}
          icon={action.icon}
          title={action.title}
          description={action.description}
          color={action.color}
        />
      ))}
    </div>
  );
}

function UpcomingClassesCard({ classes }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming classes</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {classes.map((classItem) => (
            <div key={classItem.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{classItem.course}</h3>
                <p className="text-sm text-gray-600">{classItem.teacher}</p>
                <p className="text-sm text-gray-500">{classItem.time} - {classItem.room}</p>
              </div>
              <div className="ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Upcoming
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentActivitiesCard({ activities }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent activities</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              icon={
                activity.type === 'lesson' ? <BookOpen className="h-4 w-4" /> :
                activity.type === 'payment' ? <CreditCard className="h-4 w-4" /> :
                <MessageSquare className="h-4 w-4" />
              }
              title={activity.title}
              time={activity.time}
              type={activity.type === 'lesson' ? 'success' : activity.type === 'payment' ? 'info' : 'warning'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { setCurrentModule } = useStudentContext();
  const [stats, setStats] = useState({
    enrolledCourses: 3,
    completedLessons: 15,
    upcomingClasses: 2,
    totalHours: 45
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'lesson',
      title: 'Completed lesson: Present Perfect',
      time: '2 hours ago',
      course: 'English Grammar Advanced'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Paid tuition for December',
      time: '1 day ago',
      amount: '2,500,000 VNĐ'
    },
    {
      id: 3,
      type: 'notification',
      title: 'Schedule change: Tue, 14:00-16:00',
      time: '2 days ago',
      course: 'Speaking Practice'
    }
  ]);

  const [upcomingClasses] = useState([
    {
      id: 1,
      course: 'English Grammar Advanced',
      teacher: 'Ms. Sarah Johnson',
      time: 'Mon, 14:00-16:00',
      room: 'Room 201'
    },
    {
      id: 2,
      course: 'Speaking Practice',
      teacher: 'Mr. David Smith',
      time: 'Wed, 09:00-11:00',
      room: 'Room 105'
    }
  ]);

  const quickActions = [
    {
      title: 'Manage Courses',
      description: 'View and manage your courses',
      icon: <BookOpen size={24} />,
      color: 'bg-blue-500',
      onClick: () => setCurrentModule('courses')
    },
    {
      title: 'Schedule & Attendance',
      description: 'View schedule and attendance',
      icon: <Calendar size={24} />,
      color: 'bg-green-500',
      onClick: () => setCurrentModule('schedule')
    },
    {
      title: 'Billing & Invoices',
      description: 'View tuition and payments',
      icon: <CreditCard size={24} />,
      color: 'bg-purple-500',
      onClick: () => setCurrentModule('payment')
    },
    {
      title: 'Interactions & Support',
      description: 'Send questions and feedback',
      icon: <MessageSquare size={24} />,
      color: 'bg-orange-500',
      onClick: () => setCurrentModule('support')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Here is an overview of your learning</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick actions</h2>
          </div>
          <div className="p-6">
            <QuickActionsGrid actions={quickActions} />
          </div>
        </div>

        {/* Upcoming Classes */}
        <UpcomingClassesCard classes={upcomingClasses} />
      </div>

      {/* Recent Activities */}
      <RecentActivitiesCard activities={recentActivities} />
    </div>
  );
}
