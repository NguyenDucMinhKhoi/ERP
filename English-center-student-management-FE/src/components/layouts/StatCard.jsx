import React from "react";

export default function StatCard({ title, value, delta, tone = "primary" }) {
  const toneMap = {
    primary: {
      ring: "ring-primary-200",
      chip: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    },
    success: {
      ring: "ring-success-200",
      chip: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300",
    },
    error: {
      ring: "ring-error-200",
      chip: "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300",
    },
    info: {
      ring: "ring-info-200",
      chip: "bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300",
    },
    warning: {
      ring: "ring-warning-200",
      chip: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300",
    },
  };

  const { ring, chip } = toneMap[tone] || toneMap.primary;

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-transparent transition-shadow hover:${ring} dark:border-slate-800 dark:bg-slate-900`}
    >
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-2 inline-flex items-center gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-semibold ${chip}`}>
          {delta}
        </span>
        <span className="text-slate-400">than last week</span>
      </div>
    </div>
  );
}
