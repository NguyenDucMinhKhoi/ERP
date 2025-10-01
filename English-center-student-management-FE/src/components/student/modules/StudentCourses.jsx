import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, Star, Play, CheckCircle, Calendar, User } from 'lucide-react';
import { CourseCard, FilterTabs, SectionCard } from '../index';

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, enrolled, completed

  useEffect(() => {
    // Mock data - replace with real API call
    const mockCourses = [
      {
        id: 1,
        title: 'English Grammar Advanced',
        description: 'Advanced English grammar for intermediate learners',
        teacher: 'Ms. Sarah Johnson',
        level: 'Intermediate',
        duration: '12 weeks',
        schedule: 'Mon, Wed, Fri - 14:00-16:00',
        progress: 75,
        status: 'enrolled',
        rating: 4.8,
        students: 25,
        price: '2,500,000 VND',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        lessons: [
          { id: 1, title: 'Present Perfect Tense', completed: true, duration: '2h' },
          { id: 2, title: 'Past Perfect Tense', completed: true, duration: '2h' },
          { id: 3, title: 'Future Perfect Tense', completed: false, duration: '2h' },
          { id: 4, title: 'Conditional Sentences', completed: false, duration: '2h' }
        ]
      },
      {
        id: 2,
        title: 'Speaking Practice',
        description: 'Practice English speaking with native teachers',
        teacher: 'Mr. David Smith',
        level: 'Beginner',
        duration: '8 weeks',
        schedule: 'Tue, Thu - 09:00-11:00',
        progress: 50,
        status: 'enrolled',
        rating: 4.9,
        students: 15,
        price: '1,800,000 VND',
        startDate: '2024-02-01',
        endDate: '2024-03-30',
        lessons: [
          { id: 1, title: 'Basic Conversation', completed: true, duration: '2h' },
          { id: 2, title: 'Pronunciation Practice', completed: true, duration: '2h' },
          { id: 3, title: 'Fluency Building', completed: false, duration: '2h' },
          { id: 4, title: 'Presentation Skills', completed: false, duration: '2h' }
        ]
      },
      {
        id: 3,
        title: 'Business English',
        description: 'Business English for workplace contexts',
        teacher: 'Ms. Emily Brown',
        level: 'Advanced',
        duration: '10 weeks',
        schedule: 'Sat - 14:00-17:00',
        progress: 100,
        status: 'completed',
        rating: 4.7,
        students: 20,
        price: '3,000,000 VND',
        startDate: '2023-10-01',
        endDate: '2023-12-15',
        lessons: [
          { id: 1, title: 'Email Writing', completed: true, duration: '3h' },
          { id: 2, title: 'Meeting Skills', completed: true, duration: '3h' },
          { id: 3, title: 'Presentation Skills', completed: true, duration: '3h' },
          { id: 4, title: 'Negotiation Skills', completed: true, duration: '3h' }
        ]
      }
    ];

    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = courses.filter(course => {
    if (filter === 'enrolled') return course.status === 'enrolled';
    if (filter === 'completed') return course.status === 'completed';
    return true;
  });

  const handleViewDetails = (course) => {
    console.log('View course details:', course);
    // Navigate to course details or open modal
  };

  const handleContinueLearning = (course) => {
    console.log('Continue learning:', course);
    // Navigate to lesson or open learning interface
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  function Header() {
    return (
      <SectionCard
        title="Course Management"
        right={<button className="bg-primary-main text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors">Enroll new course</button>}
      >
        <p className="text-gray-600">View and manage your courses</p>
      </SectionCard>
    );
  }

  function Filters() {
    const items = [
      { value: 'all', label: `All (${courses.length})` },
      { value: 'enrolled', label: `In progress (${courses.filter(c => c.status === 'enrolled').length})` },
      { value: 'completed', label: `Completed (${courses.filter(c => c.status === 'completed').length})` }
    ];
    return <FilterTabs items={items} value={filter} onChange={setFilter} />;
  }

  function CoursesGrid() {
    if (filteredCourses.length === 0) {
      return (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'enrolled' ? 'You have not enrolled any course yet' : filter === 'completed' ? 'You have not completed any course yet' : 'You do not have any course yet'}
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Enroll new course</button>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onViewDetails={handleViewDetails}
            onContinueLearning={handleContinueLearning}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />
      <Filters />
      <CoursesGrid />
    </div>
  );
}
