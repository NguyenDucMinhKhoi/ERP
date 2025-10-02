import React from 'react';

export default function SectionCard({ title, right, children }) {
  return (
    <div className="bg-white rounded-lg shadow">
      {(title || right) && (
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {right}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}


