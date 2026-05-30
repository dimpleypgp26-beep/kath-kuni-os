"use client";
import { Settings } from "lucide-react";

export default function Header({ dataSource, onSettingsOpen }) {
  const isLive = dataSource && dataSource !== "demo";
  const pillLabel = isLive
    ? dataSource === "csv" ? "Live · CSV" : "Live · Google Sheet"
    : "Demo";

  return (
    <header className="border-b border-sand-200 bg-cream-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Wordmark */}
      <div className="flex items-baseline gap-0.5 select-none">
        <span className="text-walnut-700 font-semibold text-xl tracking-tight" style={{ fontFamily: "HankenGroteskVariable, sans-serif" }}>
          काठ
        </span>
        <span className="text-tan-500 text-2xl leading-none" style={{ fontFamily: "FrauncesVariable, serif", fontStyle: "italic" }}>
          kuni
        </span>
        <span className="ml-2 text-xs text-mocha-400 font-medium tracking-widest uppercase">OS</span>
      </div>

      {/* Right: pill + meta + settings */}
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
          isLive
            ? "bg-moss-500/10 text-moss-500 border-moss-500/30"
            : "bg-sand-100 text-mocha-400 border-sand-200"
        }`}>
          {pillLabel}
        </span>
        <span className="hidden sm:block text-xs text-mocha-400">
          Shangarh · Sainj Valley
        </span>
        <button
          onClick={onSettingsOpen}
          className="p-1.5 rounded-lg hover:bg-sand-100 text-mocha-400 hover:text-tan-500 transition-colors"
          title="Data settings"
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}
