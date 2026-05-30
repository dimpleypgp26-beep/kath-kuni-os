"use client";
import { useState } from "react";
import { roomStates } from "@/lib/analytics";
import { ROOMS } from "@/lib/mock";
import RoomGrid from "./RoomGrid";

export default function DateCheck({ bookings }) {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  const states = roomStates(bookings, date);
  const occupiedCount = Object.values(states).filter((s) => s.status === "occupied" || s.status === "checkin").length;
  const vacantCount   = ROOMS.length - occupiedCount;
  const checkoutCount = Object.values(states).filter((s) => s.status === "checkout").length;
  const checkinCount  = Object.values(states).filter((s) => s.status === "checkin").length;
  const pct = Math.round((occupiedCount / ROOMS.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-mocha-400 mb-1.5">Check availability on</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-sand-200 rounded-lg px-3 py-2 text-sm bg-white text-walnut-700 focus:outline-none focus:ring-2 focus:ring-tan-400"
          />
        </div>
        {/* Summary pills */}
        <div className="flex flex-wrap gap-2 pb-0.5">
          <Pill label="Occupancy" value={`${pct}%`} color="tan" />
          <Pill label="Occupied" value={occupiedCount} color="tan" />
          <Pill label="Vacant"   value={vacantCount}   color="sand" />
          <Pill label="Arriving" value={checkinCount}  color="moss" />
          <Pill label="Departing" value={checkoutCount} color="amber" />
        </div>
      </div>

      <RoomGrid states={states} />
    </div>
  );
}

function Pill({ label, value, color }) {
  const styles = {
    tan:   "bg-tan-500/10 text-tan-600 border-tan-300",
    sand:  "bg-sand-100 text-mocha-500 border-sand-200",
    moss:  "bg-moss-500/10 text-moss-500 border-moss-500/30",
    amber: "bg-amber-50 text-amber-600 border-amber-300",
  };
  return (
    <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${styles[color]}`}>
      {label}: <strong>{value}</strong>
    </span>
  );
}
