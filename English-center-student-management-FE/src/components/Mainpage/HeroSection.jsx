import React from "react";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-16">
      <div className="container mx-auto px-4 lg:flex lg:items-center lg:gap-12">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100/60 px-3 py-1 text-sm font-medium text-indigo-700">
          </div>
          <h2 className="mt-4 text-4xl font-extrabold text-slate-900 leading-tight">Learn English effectively — from beginner to advanced</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-xl">Courses with clear curriculum, experienced instructors and progress tracking to help you reach your goals faster.</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                // dispatch event to show courses (without changing URL)
                try {
                  window.dispatchEvent(new CustomEvent('showCourses', { detail: { category: 'All' } }));
                } catch (e) {
                  // fallback for older browsers
                  const ev = document.createEvent('Event');
                  ev.initEvent('showCourses', true, true);
                  window.dispatchEvent(ev);
                }
                const el = document.getElementById('courses');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
            >
              View Courses
            </button>

            <a href="#contact" className="inline-block rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">Contact Us</a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-2xl font-bold text-slate-900">1,200+</div>
              <div className="mt-1 text-sm text-slate-500">Students</div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-2xl font-bold text-slate-900">35</div>
              <div className="mt-1 text-sm text-slate-500">Courses</div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-2xl font-bold text-slate-900">4.8</div>
              <div className="mt-1 text-sm text-slate-500">Rating</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2">
          <div className="rounded-2xl bg-indigo-50 p-8 shadow-inner">
            <img src="/src/assets/react.svg" alt="illustration" className="mx-auto w-72" />
          </div>
        </div>
      </div>
    </section>
  );
}
