import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CourseCard from "./CourseCard";

const sampleCourses = [
  { title: "Beginner English", level: "Beginner", price: "499K", students: 320, tag: "New", description: "Start with core vocabulary and simple conversation." },
  { title: "IELTS 5.5+", level: "Intermediate", price: "1.2M", students: 120, tag: "Popular", description: "Targeted skills for improving IELTS band to 5.5+." },
  { title: "IELTS 7.0+", level: "Advanced", price: "2.5M", students: 45, tag: "Pro", description: "Advanced practice for achieving 7.0+ in IELTS." },
  { title: "Business English", level: "Intermediate", price: "1.8M", students: 85, tag: "Business", description: "Communication and presentation skills for work." },
  { title: "Kids English", level: "Beginner", price: "299K", students: 410, tag: "Kids", description: "Fun, interactive lessons for young learners." },
  { title: "Conversation Club", level: "All Levels", price: "199K", students: 220, tag: "Club", description: "Weekly speaking practice with coaches." },
];

export default function CoursesSection() {
  const categories = ["All", "Beginner", "Intermediate", "Advanced", "Business"];
  const [selected, setSelected] = useState("All");
  const location = useLocation();

  useEffect(() => {
    // If user navigates to #courses (e.g. via a CTA), reset to All
    if (location.hash === "#courses") setSelected("All");
  }, [location.hash]);

  useEffect(() => {
    const handler = (e) => {
      // detail may contain category; default to All
      const cat = e?.detail?.category || "All";
      setSelected(cat);
      const el = document.getElementById("courses");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("showCourses", handler);
    return () => window.removeEventListener("showCourses", handler);
  }, []);

  const filtered = sampleCourses.filter((c) => {
    if (selected === "All") return true;
    if (selected === "Business") return (c.tag && c.tag.toLowerCase() === "business") || (c.level && c.level.toLowerCase() === "business");
    return c.level && c.level.toLowerCase() === selected.toLowerCase();
  });

  return (
    <section id="courses" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Featured Courses</h3>
            <p className="mt-2 text-slate-600">Explore our popular and recommended courses tailored to different goals.</p>
          </div>

          <div className="hidden sm:flex gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelected(c)}
                className={`rounded-full border px-3 py-1 text-sm ${selected === c ? "bg-primary-light text-primary-dark border-primary-light" : "border-slate-200 text-slate-700 hover:bg-white"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <CourseCard key={i} course={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
