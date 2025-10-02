import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ScheduleView } from '../index';

export default function StudentSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // week, month
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with real API call
    const mockSchedule = [
      {
        id: 1,
        course: 'English Grammar Advanced',
        teacher: 'Ms. Sarah Johnson',
        room: 'Room 201',
        date: '2024-01-15',
        startTime: '14:00',
        endTime: '16:00',
        status: 'scheduled', // scheduled, completed, cancelled, in-progress
        attendance: 'present', // present, absent, late
        notes: 'Lesson: Present Perfect Tense'
      },
      {
        id: 2,
        course: 'Speaking Practice',
        teacher: 'Mr. David Smith',
        room: 'Room 105',
        date: '2024-01-16',
        startTime: '09:00',
        endTime: '11:00',
        status: 'completed',
        attendance: 'present',
        notes: 'Practice pronunciation and basic communication'
      },
      {
        id: 3,
        course: 'English Grammar Advanced',
        teacher: 'Ms. Sarah Johnson',
        room: 'Room 201',
        date: '2024-01-17',
        startTime: '14:00',
        endTime: '16:00',
        status: 'scheduled',
        attendance: null,
        notes: 'Lesson: Past Perfect Tense'
      },
      {
        id: 4,
        course: 'Speaking Practice',
        teacher: 'Mr. David Smith',
        room: 'Room 105',
        date: '2024-01-18',
        startTime: '09:00',
        endTime: '11:00',
        status: 'cancelled',
        attendance: null,
        notes: 'Class cancelled due to teacher sickness'
      }
    ];

    setTimeout(() => {
      setSchedule(mockSchedule);
      setLoading(false);
    }, 1000);
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
