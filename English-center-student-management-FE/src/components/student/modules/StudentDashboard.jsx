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
    enrolledCourses: 0,
    completedLessons: 0,
    upcomingClasses: 0,
    totalHours: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch enrollments for stats
        const enrollmentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/dangky/me/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('ecsm_access_token')}`,
          },
        });
        const enrollments = await enrollmentsResponse.json();
        
        // Calculate stats
        const enrolledCount = enrollments.length;
        const completedCount = enrollments.filter(e => e.trang_thai === 'hoan_thanh').length;
        const totalHrs = enrolledCount * 15; // Estimate 15 hours per course
        
        // Fetch upcoming schedules
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const upcomingSchedules = [];
        for (const enroll of enrollments.slice(0, 2)) {
          if (enroll.lop_hoc && enroll.trang_thai === 'dang_hoc') {
            try {
              const scheduleResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/lichhocs/?lop_hoc=${enroll.lop_hoc.id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('ecsm_access_token')}`,
                  },
                }
              );
              const schedules = await scheduleResponse.json();
              const upcoming = schedules.filter(s => new Date(s.ngay_hoc) >= today);
              if (upcoming.length > 0) {
                upcomingSchedules.push({
                  id: upcoming[0].id,
                  course: enroll.khoahoc?.ten || 'Unknown Course',
                  teacher: enroll.lop_hoc?.giang_vien?.ten || 'TBA',
                  time: `${new Date(upcoming[0].ngay_hoc).toLocaleDateString('vi-VN')}, ${upcoming[0].gio_bat_dau?.slice(0,5)}-${upcoming[0].gio_ket_thuc?.slice(0,5)}`,
                  room: upcoming[0].phong_hoc || 'TBA'
                });
              }
            } catch (err) {
              console.error('Error fetching schedule:', err);
            }
          }
        }
        
        // Fetch recent activities (payments + enrollments)
        const paymentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/thanhtoans/me/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('ecsm_access_token')}`,
          },
        });
        const payments = await paymentsResponse.json();
        
        const activities = [
          ...enrollments.slice(0, 2).map(e => ({
            id: `enroll-${e.id}`,
            type: 'lesson',
            title: `Đăng ký khóa học: ${e.khoahoc?.ten || 'Unknown'}`,
            time: new Date(e.created_at).toLocaleString('vi-VN'),
            course: e.khoahoc?.ten || 'Unknown'
          })),
          ...payments.slice(0, 2).map(p => ({
            id: `payment-${p.id}`,
            type: 'payment',
            title: `Thanh toán học phí: ${p.so_tien_thanh_toan?.toLocaleString('vi-VN')} VNĐ`,
            time: new Date(p.ngay_thanh_toan || p.created_at).toLocaleString('vi-VN'),
            amount: `${p.so_tien_thanh_toan?.toLocaleString('vi-VN')} VNĐ`
          }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
        
        setStats({
          enrolledCourses: enrolledCount,
          completedLessons: completedCount,
          upcomingClasses: upcomingSchedules.length,
          totalHours: totalHrs
        });
        setRecentActivities(activities);
        setUpcomingClasses(upcomingSchedules);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

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
