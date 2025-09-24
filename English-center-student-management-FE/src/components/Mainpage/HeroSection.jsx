import React from "react";

export default function HeroSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 lg:flex lg:items-center lg:gap-12">
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">Learn English effectively — from beginner to advanced</h2>
          <p className="mt-4 text-slate-600">Courses designed with a clear curriculum, experienced teachers, and a progress tracking system.</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#courses" className="inline-block rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">View Courses</a>
            <a href="#contact" className="inline-block rounded-md border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Contact Us</a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900">1,200+</div>
              <div className="text-sm text-slate-500">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">35</div>
              <div className="text-sm text-slate-500">Courses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">4.8</div>
              <div className="text-sm text-slate-500">Rating</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2">
          <div className="rounded-xl bg-indigo-50 p-8">
            <img src="/src/assets/react.svg" alt="illustration" className="mx-auto w-64" />
          </div>
        </div>
      </div>
    </section>
  );
}
