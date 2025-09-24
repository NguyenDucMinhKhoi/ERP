import React from "react";

export default function ReviewCard({ review }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <img src={review.avatar || '/src/assets/react.svg'} alt={review.name} className="h-12 w-12 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">{review.name}</div>
            <div className="text-xs text-slate-500">{review.date}</div>
          </div>
          <p className="mt-2 text-sm text-slate-700">{review.text}</p>
        </div>
      </div>
    </div>
  );
}
