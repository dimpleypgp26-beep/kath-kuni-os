"use client";

const TABS = ["Today", "Date Check", "Trends"];

export default function Tabs({ active, onChange }) {
  return (
    <div className="flex gap-1 px-4 pt-3 border-b border-sand-200 bg-cream-50">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-colors ${
            active === tab
              ? "bg-white border-sand-200 text-tan-500"
              : "border-transparent text-mocha-400 hover:text-walnut-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
