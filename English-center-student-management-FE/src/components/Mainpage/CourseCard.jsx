import React from "react";

export default function CourseCard({ title, level, price, students }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <div className="mt-1 text-sm text-slate-500">{level}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-900">{price}</div>
          <div className="text-sm text-slate-500">{students} students</div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
  <a className="inline-block rounded bg-indigo-600 px-3 py-2 text-sm text-white" href="#enroll">Enroll</a>
  <a className="inline-block rounded border border-slate-200 px-3 py-2 text-sm text-slate-700" href="#details">Details</a>
      </div>
    </div>
  );
}
