import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, Star, Play, CheckCircle, Calendar, User } from 'lucide-react';
import { CourseCard, FilterTabs, SectionCard } from '../index';

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, enrolled, completed

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/dangky/me/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('ecsm_access_token')}`,
          },
        });
        const enrollments = await response.json();
        
        const formattedCourses = enrollments.map(enroll => ({
          id: enroll.id,
          title: enroll.khoahoc?.ten || 'Unknown Course',
          description: enroll.khoahoc?.mo_ta || 'No description',
          teacher: enroll.lop_hoc?.giang_vien?.ten || 'TBA',
          level: enroll.khoahoc?.trinh_do || 'N/A',
          duration: `${enroll.khoahoc?.so_tuan || 0} tuần`,
          schedule: enroll.lop_hoc?.ten || 'TBA',
          progress: enroll.phan_tram_hoan_thanh || 0,
          status: enroll.trang_thai === 'hoan_thanh' ? 'completed' : 'enrolled',
          rating: 4.5,
          students: 20,
          price: enroll.khoahoc?.hoc_phi ? `${enroll.khoahoc.hoc_phi.toLocaleString('vi-VN')} VND` : 'N/A',
          startDate: enroll.ngay_dang_ky,
          endDate: enroll.ngay_ket_thuc || 'N/A',
          lessons: []
        }));
        
        setCourses(formattedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
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
        right={<button className="rounded-xl border border-transparent bg-primary-main px-8 py-3 text-xs font-medium text-white hover:opacity-90 transition-colors">Enroll new course</button>}
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
