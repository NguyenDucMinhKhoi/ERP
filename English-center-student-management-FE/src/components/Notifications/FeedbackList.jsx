import React from "react";
import { threads } from "./dummyData";

export default function FeedbackList({ onOpenThread }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="text-slate-700 font-medium mb-3">Feedback gần đây</div>
      <div className="divide-y">
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => onOpenThread(t)}
            className="w-full text-left py-3 hover:bg-slate-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900 cursor-pointer line-clamp-1">
                  {t.studentName}
                </div>
                <div className="text-sm text-slate-600 line-clamp-1">
                  {t.lastMessage}
                </div>
              </div>
              <div className="text-xs text-slate-500">{t.updatedAt}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
