import React from "react";
import CourseCard from "./CourseCard";

const sampleCourses = [
  { title: "English Communication - Beginner", level: "Beginner", price: "499K", students: 320 },
  { title: "IELTS 5.5+", level: "Intermediate", price: "1.2M", students: 120 },
  { title: "IELTS 7.0+", level: "Advanced", price: "2.5M", students: 45 },
];

export default function CoursesSection() {
  return (
    <section id="courses" className="bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Featured Courses</h3>
          <p className="text-slate-600 mt-1">Courses designed to match learners' goals and needs.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleCourses.map((c, i) => (
            <CourseCard key={i} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
