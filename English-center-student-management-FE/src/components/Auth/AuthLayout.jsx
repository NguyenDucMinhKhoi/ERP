import React from "react";

export default function AuthLayout({ left, right }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-sm md:grid-cols-2">
        <div className="p-8 md:p-12 flex items-center justify-center">
          {left}
        </div>
        <div className="hidden md:block bg-primary-main/80">{right}</div>
      </div>
    </div>
  );
}
