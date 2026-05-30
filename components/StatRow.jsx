"use client";

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-xl border border-sand-200 px-5 py-4 flex flex-col gap-1">
      <span className="text-xs text-mocha-400 font-medium uppercase tracking-wider">{label}</span>
      <span
        className={`text-4xl font-bold leading-none ${accent ? "text-tan-500" : "text-walnut-700"}`}
        style={{ fontFamily: "FrauncesVariable, serif", fontStyle: "italic" }}
      >
        {value}
      </span>
      {sub && <span className="text-xs text-mocha-400 mt-0.5">{sub}</span>}
    </div>
  );
}

export default function StatRow({ stats }) {
  const { occupancyPct, arrivingToday, departingToday, occupiedRooms, totalRooms } = stats;
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        label="Occupancy"
        value={`${occupancyPct}%`}
        sub={`${occupiedRooms} of ${totalRooms} rooms`}
        accent
      />
      <StatCard
        label="Arriving Today"
        value={arrivingToday}
        sub="check-ins"
      />
      <StatCard
        label="Departing Today"
        value={departingToday}
        sub="check-outs"
      />
    </div>
  );
}
