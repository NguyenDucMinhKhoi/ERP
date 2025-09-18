import React from "react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top stat cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <CardStat
          title="Today's Money"
          value="$53,000"
          delta="+55%"
          tone="success"
        />
        <CardStat
          title="Today's Users"
          value="2,300"
          delta="+5%"
          tone="success"
        />
        <CardStat title="New Clients" value="3,052" delta="-14%" tone="error" />
        <CardStat
          title="Total Sales"
          value="$173,000"
          delta="+8%"
          tone="success"
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-2 text-sm font-semibold">Built by developers</div>
          <div className="h-40 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-2 text-sm font-semibold">Sales overview</div>
          <div className="h-48 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100" />
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="text-sm font-semibold">Projects</div>
          <div className="mt-4 h-48 rounded-xl bg-slate-50" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">Orders overview</div>
          <div className="mt-4 h-48 rounded-xl bg-slate-50" />
        </div>
      </div>
    </div>
  );
}

function CardStat({ title, value, delta, tone }) {
  const toneMap = {
    success: "text-success-600 bg-success-50",
    error: "text-error-600 bg-error-50",
    info: "text-info-600 bg-info-50",
    warning: "text-warning-600 bg-warning-50",
  };
  const chip = toneMap[tone] || "text-primary-600 bg-primary-50";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
      <div
        className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${chip}`}
      >
        {delta}
      </div>
    </div>
  );
}
