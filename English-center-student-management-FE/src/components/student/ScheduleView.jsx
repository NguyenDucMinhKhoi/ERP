import React from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ScheduleView({ 
  schedule, 
  currentDate, 
  onDateChange, 
  view = 'week', 
  onViewChange,
  onClassClick 
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'in-progress': return 'In Progress';
      default: return 'Unknown';
    }
  };

  const getAttendanceColor = (attendance) => {
    switch (attendance) {
      case 'present': return 'text-green-600';
      case 'absent': return 'text-red-600';
      case 'late': return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  };

  const getAttendanceIcon = (attendance) => {
    switch (attendance) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      case 'late': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      dates.push(currentDate);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentDate);

  const getScheduleForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return schedule.filter(item => item.date === dateString);
  };

  const upcomingClasses = schedule
    .filter(item => item.status === 'scheduled')
    .sort((a, b) => new Date(a.date + ' ' + a.startTime) - new Date(b.date + ' ' + b.startTime));

  const attendanceStats = {
    present: schedule.filter(item => item.attendance === 'present').length,
    absent: schedule.filter(item => item.attendance === 'absent').length,
    late: schedule.filter(item => item.attendance === 'late').length
  };

  return (
    <div className="space-y-6">
      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() - 7);
                onDateChange(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Calendar className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDateChange(new Date())}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Today
            </button>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() + 7);
                onDateChange(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Calendar className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>

        {/* Week View */}
        {view === 'week' && (
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const daySchedule = getScheduleForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div key={index} className="min-h-[120px]">
                  <div className={`text-center p-2 rounded-lg mb-2 ${
                    isToday ? 'bg-blue-100 text-blue-900' : 'bg-gray-50 text-gray-700'
                  }`}>
                    <div className="text-sm font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-bold">
                      {date.getDate()}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {daySchedule.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-2 bg-white border border-gray-200 rounded text-xs cursor-pointer hover:border-blue-300"
                        onClick={() => onClassClick(item)}
                      >
                        <div className="font-medium text-gray-900">{item.course}</div>
                        <div className="text-gray-600">{item.startTime} - {item.endTime}</div>
                        <div className="text-gray-500">{item.room}</div>
                        {item.attendance && (
                          <div className={`flex items-center mt-1 ${getAttendanceColor(item.attendance)}`}>
                            {getAttendanceIcon(item.attendance)}
                            <span className="ml-1 text-xs">
                              {item.attendance === 'present' ? 'Present' : 
                               item.attendance === 'absent' ? 'Absent' : 'Late'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingClasses.map((item) => (
              <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-gray-900">{item.course}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <User className="h-4 w-4 mr-1" />
                    {item.teacher}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.room}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatDate(item.date)} - {item.startTime} to {item.endTime}
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Attendance Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {attendanceStats.present}
              </div>
              <div className="text-sm text-gray-600">Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {attendanceStats.absent}
              </div>
              <div className="text-sm text-gray-600">Absent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {attendanceStats.late}
              </div>
              <div className="text-sm text-gray-600">Late</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}