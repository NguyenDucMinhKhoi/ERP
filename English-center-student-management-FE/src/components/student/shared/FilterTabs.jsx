import React from 'react';

export default function FilterTabs({ items, value, onChange }) {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
      {items.map((it) => (
        <button
          key={it.value}
          onClick={() => onChange(it.value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            value === it.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}


