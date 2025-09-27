import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-lg font-semibold">English Center</div>
            <p className="mt-2 text-sm text-slate-400">Quality English courses for learners of all ages.</p>
          </div>

          <div>
            <div className="font-semibold">Courses</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-400">
              <li><a href="#courses" className="hover:text-white">All Courses</a></li>
              <li><a href="#" className="hover:text-white">Business English</a></li>
              <li><a href="#" className="hover:text-white">Exam Prep</a></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold">Company</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold">Contact</div>
            <div className="mt-2 text-sm text-slate-400">Email: info@example.com</div>
            <div className="mt-1 text-sm text-slate-400">Phone: +84 123 456 789</div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} English Center. All rights reserved.</div>
      </div>
    </footer>
  );
}
