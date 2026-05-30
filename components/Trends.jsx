"use client";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { sourceSplit, monthlyOccupancy } from "@/lib/analytics";
import { ROOMS } from "@/lib/mock";

const SEASON_COLORS = {
  peak:    "#A47148", // tan-500
  locals:  "#5F8A5A", // moss-500
  uptrend: "#C4955A", // tan-300
  offpeak: "#DEC49E", // sand-200
};

const SEASON_LABELS = {
  peak:    "Peak (Apr–Jun, Nov–Jan)",
  locals:  "Locals (Feb)",
  uptrend: "Uptrend (Mar)",
  offpeak: "Off-peak (Jul–Oct)",
};

const SOURCE_COLORS = ["#A47148","#5F8A5A","#C4955A","#9C7B5C","#DEC49E"];

export default function Trends({ bookings }) {
  const [view, setView] = useState("monthly");

  const sources = sourceSplit(bookings);
  const monthly = monthlyOccupancy(bookings, ROOMS);

  // Quarterly: group monthly into quarters
  const quarterly = (() => {
    const qs = [];
    for (let i = 0; i < monthly.length; i += 3) {
      const chunk = monthly.slice(i, i+3);
      const avg = Math.round(chunk.reduce((s,x) => s+x.occupancy,0) / chunk.length);
      const label = `Q${Math.floor(i/3)+1} ${chunk[0].year}`;
      // dominant season
      const seasons = chunk.map(c=>c.season);
      const dominant = ["peak","locals","uptrend","offpeak"].find(s=>seasons.includes(s)) || seasons[0];
      qs.push({ month: label, occupancy: avg, season: dominant });
    }
    return qs;
  })();

  const chartData = view === "monthly" ? monthly : quarterly;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Donut: Booking Sources */}
      <div className="bg-white rounded-xl border border-sand-200 p-5 lg:w-72 flex-shrink-0">
        <h3 className="text-sm font-semibold text-walnut-700 mb-4">Booking Sources</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={sources}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={2}
            >
              {sources.map((_, i) => (
                <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, n) => [`${v} bookings`, n]}
              contentStyle={{ borderRadius: 8, border: "1px solid #DEC49E", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5 mt-3">
          {sources.map((s, i) => (
            <div key={s.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                <span className="text-walnut-600">{s.name}</span>
              </div>
              <span className="font-medium text-walnut-700">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar: Occupancy chart */}
      <div className="bg-white rounded-xl border border-sand-200 p-5 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-walnut-700">Occupancy</h3>
          <div className="flex rounded-lg border border-sand-200 overflow-hidden text-xs">
            {["monthly","quarterly"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  view === v ? "bg-tan-500 text-white" : "bg-white text-mocha-400 hover:bg-sand-100"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={view === "monthly" ? 14 : 26}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9C7B5C" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0,100]} tick={{ fontSize: 11, fill: "#9C7B5C" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              formatter={(v) => [`${v}%`, "Occupancy"]}
              contentStyle={{ borderRadius: 8, border: "1px solid #DEC49E", fontSize: 12 }}
            />
            <Bar dataKey="occupancy" radius={[4,4,0,0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={SEASON_COLORS[entry.season]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Season legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {Object.entries(SEASON_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5 text-[11px] text-mocha-400">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: SEASON_COLORS[key] }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
