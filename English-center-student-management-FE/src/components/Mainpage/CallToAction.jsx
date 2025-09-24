import React from "react";
import { Mail } from "lucide-react";

export default function CallToAction() {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/5 p-8 text-center backdrop-blur-sm">
          <div className="inline-flex items-center justify-center gap-3 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
            <Mail className="h-4 w-4" />
            Get help from an advisor
          </div>

          <h4 className="mt-4 text-3xl font-bold">Ready to level up your English?</h4>
          <p className="mt-3 text-slate-100">Speak confidently, score higher on exams, or improve at work — we have a plan for you.</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a href="#enroll" className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg hover:shadow-xl">Enroll Now</a>
            <a href="#learn-more" className="inline-block rounded-full border border-white/30 px-5 py-3 text-sm text-white">Learn More</a>
          </div>
        </div>
      </div>
    </section>
  );
}
