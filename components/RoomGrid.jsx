"use client";
import { ROOMS } from "@/lib/mock";

const STATUS_STYLES = {
  occupied: "bg-tan-500/10 border-tan-400 text-tan-600",
  checkin:  "bg-moss-500/10 border-moss-500 text-moss-500",
  checkout: "bg-amber-50 border-amber-400 text-amber-600",
  vacant:   "bg-white border-sand-200 text-mocha-400",
};

const STATUS_LABEL = {
  occupied: "Occupied",
  checkin:  "Arriving",
  checkout: "Departing",
  vacant:   "Vacant",
};

function RoomCard({ room, state }) {
  const { status, guest } = state;
  return (
    <div className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${STATUS_STYLES[status]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-walnut-700">{room.name}</span>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
          status === "occupied" ? "bg-tan-500/20 text-tan-600" :
          status === "checkin"  ? "bg-moss-500/20 text-moss-500" :
          status === "checkout" ? "bg-amber-100 text-amber-600" :
          "bg-sand-100 text-mocha-400"
        }`}>
          {STATUS_LABEL[status]}
        </span>
      </div>
      <div className="text-xs mt-1 text-mocha-400">{room.category} · ₹{room.rate.toLocaleString("en-IN")}/night</div>
      {guest && <div className="text-xs mt-1 font-medium text-walnut-600 truncate">{guest}</div>}
    </div>
  );
}

// Display order: P1 King Suites → P1 Dorms → P2 Queen Suites → P2 Twin → P2 Dorms
const PROPERTY_ORDER = ["P1", "P2"];
const CATEGORY_ORDER = ["King Suite", "Queen Suite", "Twin Room", "Dorm"];

function groupRooms(rooms) {
  const grouped = {};
  PROPERTY_ORDER.forEach((p) => {
    grouped[p] = {};
    CATEGORY_ORDER.forEach((c) => {
      grouped[p][c] = rooms.filter((r) => r.property === p && r.category === c);
    });
  });
  return grouped;
}

const P_LABELS = { P1: "Property 1", P2: "Property 2" };

export default function RoomGrid({ states }) {
  const grouped = groupRooms(ROOMS);

  return (
    <div className="space-y-5">
      {PROPERTY_ORDER.map((p) => {
        const hasRooms = CATEGORY_ORDER.some((c) => grouped[p][c].length > 0);
        if (!hasRooms) return null;
        return (
          <div key={p}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-mocha-400 mb-2">{P_LABELS[p]}</h3>
            <div className="space-y-3">
              {CATEGORY_ORDER.map((cat) => {
                const rooms = grouped[p][cat];
                if (!rooms.length) return null;
                return (
                  <div key={cat}>
                    <div className="text-[11px] font-medium text-mocha-400 mb-1.5 pl-0.5">{cat}s</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                      {rooms.map((room) => (
                        <RoomCard key={room.name} room={room} state={states[room.name] || { status: "vacant", guest: null }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
