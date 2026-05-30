import { ROOMS } from "./mock";

// Returns { [roomName]: "occupied"|"vacant"|"checkout"|"checkin" }
export function roomStates(bookings, date) {
  const d = typeof date === "string" ? date : date.toISOString().split("T")[0];
  const states = {};
  ROOMS.forEach((r) => (states[r.name] = { status: "vacant", guest: null, booking: null }));

  bookings.forEach((b) => {
    if (b.checkIn <= d && b.checkOut > d) {
      const isCheckout = b.checkOut === nextDay(d) || b.checkOut === d;
      const isCheckin  = b.checkIn === d;
      let status = "occupied";
      if (isCheckin && isCheckout) status = "occupied"; // edge: 1-night
      else if (isCheckin)          status = "checkin";
      else if (b.checkOut === d)   status = "checkout";
      states[b.room] = { status, guest: b.guestName, booking: b };
    } else if (b.checkOut === d) {
      // Checkout day — room available after checkout
      states[b.room] = { status: "checkout", guest: b.guestName, booking: b };
    }
  });

  return states;
}

function nextDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function todayStats(bookings, rooms, today) {
  const d = typeof today === "string" ? today : today.toISOString().split("T")[0];
  const states = roomStates(bookings, d);

  const occupiedRooms = Object.values(states).filter((s) => s.status === "occupied" || s.status === "checkin").length;
  // For dorms, capacity matters; for suites, 1 room = 1 unit. Simple room-count occupancy:
  const totalRooms = rooms.length;
  const occupancyPct = Math.round((occupiedRooms / totalRooms) * 100);

  const arrivingToday  = bookings.filter((b) => b.checkIn === d).length;
  const departingToday = bookings.filter((b) => b.checkOut === d).length;

  const revenueToday = bookings
    .filter((b) => b.checkIn <= d && b.checkOut > d)
    .reduce((sum, b) => sum + (b.revenue / b.nights || 0), 0);

  return { occupancyPct, arrivingToday, departingToday, revenueToday: Math.round(revenueToday), occupiedRooms, totalRooms };
}

// Returns array of { date, occupancy } for charting
export function occupancySeries(bookings, rooms, from, to) {
  const series = [];
  const cur = new Date(from);
  const end = new Date(to);
  while (cur <= end) {
    const d = cur.toISOString().split("T")[0];
    const states = roomStates(bookings, d);
    const occupied = Object.values(states).filter((s) => s.status === "occupied" || s.status === "checkin").length;
    series.push({ date: d, occupancy: Math.round((occupied / rooms.length) * 100) });
    cur.setDate(cur.getDate() + 1);
  }
  return series;
}

export function sourceSplit(bookings) {
  const counts = {};
  bookings.forEach((b) => {
    const src = b.source || "Unknown";
    counts[src] = (counts[src] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

// Monthly occupancy for trends chart — returns [{ month:"Jan", occupancy:75, season:"peak" }, ...]
export function monthlyOccupancy(bookings, rooms) {
  const today = new Date();
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const from = d.toISOString().split("T")[0];
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const to = lastDay.toISOString().split("T")[0];
    const series = occupancySeries(bookings, rooms, from, to);
    const avg = series.length ? Math.round(series.reduce((s, x) => s + x.occupancy, 0) / series.length) : 0;
    const month = d.getMonth() + 1; // 1-12
    const season =
      [4,5,6,11,12,1].includes(month) ? "peak" :
      month === 2 ? "locals" :
      month === 3 ? "uptrend" : "offpeak";
    months.push({
      month: d.toLocaleString("default", { month: "short" }),
      year: d.getFullYear(),
      occupancy: avg,
      season,
    });
  }
  return months;
}
