import React from "react";
import { User } from "lucide-react";

export default function CourseCard(props) {
  // Accept either a course object or flattened props for backwards compatibility
  const course = props.course || {
    title: props.title,
    level: props.level,
    price: props.price,
    students: props.students,
    tag: props.tag || "Popular",
    description: props.description || "Short course description goes here.",
  };

  return (
    <div className="relative transform rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="absolute -top-3 left-4 inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-700">{course.tag}</div>

      <div className="flex items-start gap-4">
        <img src="/src/assets/react.svg" alt="course" className="h-14 w-14 rounded-md object-cover" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">{course.title}</div>
            <div className="text-sm text-slate-500">{course.level}</div>
          </div>

          <p className="mt-2 text-sm text-slate-600 line-clamp-3">{course.description}</p>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="h-4 w-4 text-slate-400" />
              <span>{course.students} students</span>
            </div>
            <div className="text-indigo-600 font-semibold">{course.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
