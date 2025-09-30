import React from 'react';
import { BookOpen, Clock, Users, Star, Play, CheckCircle, Calendar, User } from 'lucide-react';

export default function CourseCard({ course, onViewDetails, onContinueLearning }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'enrolled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'enrolled': return 'In progress';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Course Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{course.description}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
            {getStatusText(course.status)}
          </span>
        </div>

        {/* Course Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {course.teacher}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {course.schedule}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            {course.duration}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {course.students} students
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            {course.rating}/5.0
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Lessons:</h4>
          <div className="space-y-1">
            {course.lessons.slice(0, 3).map((lesson) => (
              <div key={lesson.id} className="flex items-center text-sm">
                {lesson.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <Play className="h-4 w-4 text-gray-400 mr-2" />
                )}
                <span className={lesson.completed ? 'text-gray-600 line-through' : 'text-gray-900'}>
                  {lesson.title}
                </span>
                <span className="ml-auto text-gray-500">{lesson.duration}</span>
              </div>
            ))}
            {course.lessons.length > 3 && (
              <div className="text-sm text-gray-500">
                +{course.lessons.length - 3} more lessons
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button 
            onClick={() => onViewDetails(course)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            View details
          </button>
          {course.status === 'enrolled' && (
            <button 
              onClick={() => onContinueLearning(course)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Continue learning
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
