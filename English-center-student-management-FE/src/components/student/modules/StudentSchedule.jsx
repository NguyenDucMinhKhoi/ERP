import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ScheduleView } from '../index';

export default function StudentSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // week, month
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('ecsm_access_token') || sessionStorage.getItem('ecsm_access_token');
        const API_BASE_URL = import.meta.env.VITE_API_URL;

        // Fetch enrollments first to get lop_hoc IDs
        const enrollResponse = await fetch(`${API_BASE_URL}/dangky/me/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!enrollResponse.ok) {
          throw new Error('Failed to fetch enrollments');
        }

        const enrollments = await enrollResponse.json();
        
        // Fetch schedule for all classes
        const schedulePromises = enrollments.map(async (enrollment) => {
          if (!enrollment.lop_hoc) return [];
          
          const scheduleResponse = await fetch(
            `${API_BASE_URL}/lichhocs/?lop_hoc=${enrollment.lop_hoc}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          
          if (scheduleResponse.ok) {
            const schedules = await scheduleResponse.json();
            return schedules.map(s => ({
              id: s.id,
              course: enrollment.khoahoc?.ten || 'Course',
              teacher: 'Teacher',
              room: s.phong_hoc || 'TBD',
              date: s.ngay_hoc,
              startTime: s.gio_bat_dau,
              endTime: s.gio_ket_thuc,
              status: new Date(s.ngay_hoc) < new Date() ? 'completed' : 'scheduled',
              attendance: null,
              notes: s.noi_dung || ''
            }));
          }
          return [];
        });

        const allSchedules = await Promise.all(schedulePromises);
        setSchedule(allSchedules.flat());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleClassClick = (classItem) => {
    console.log('Class clicked:', classItem);
    // Open class details or attendance modal
  };

  function ScheduleHeader() {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule & Attendance</h1>
          <p className="text-gray-600">View schedule and attendance tracking</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('week')}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              view === 'week' 
                ? 'bg-primary-main text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              view === 'month' 
                ? 'bg-primary-main text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
        </div>
      </div>
    );
  }

  function ScheduleViewWrapper() {
    return (
      <ScheduleView
        schedule={schedule}
        currentDate={currentDate}
        onDateChange={handleDateChange}
        view={view}
        onViewChange={handleViewChange}
        onClassClick={handleClassClick}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScheduleHeader />
      <ScheduleViewWrapper />
    </div>
  );
}
