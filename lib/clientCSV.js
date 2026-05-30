// Client-side CSV parser for owner's Google Sheet schema
// Handles: ordinal dates (19th), CI/CO annotations, DD/MM/YYYY, booking date ranges

const ALIASES = {
  guestName:    ["guest name","guest","name","customer","customer name"],
  bookingDates: ["booking dates","stay dates","dates","duration"],
  room:         ["room","room name","room type","roomtype"],
  perNight:     ["per night","nightly","nightly rate","rate per night","rate"],
  source:       ["source","channel","platform","payment from platform","ota"],
  advance:      ["advance","advanced received","advance received","deposit"],
  status:       ["status"],
  purpose:      ["purpose","comment","comments","notes","remarks"],
};

function resolveHeaders(headers) {
  const map = {};
  headers.forEach((h, i) => {
    const norm = h.toLowerCase().trim();
    for (const [field, aliases] of Object.entries(ALIASES)) {
      if (aliases.includes(norm) && !(field in map)) {
        map[field] = i;
      }
    }
  });
  return map;
}

// "19th Apr(CI) - 20th Apr(CO)" → { checkIn:"2025-04-19", checkOut:"2025-04-20" }
function parseBookingDates(raw) {
  if (!raw) return { checkIn: null, checkOut: null };
  // Strip (CI) / (CO) annotations
  const cleaned = raw.replace(/\([^)]*\)/g, "").trim();
  const parts = cleaned.split(/\s*[-–]\s*/);
  const checkIn  = parseIndianDate(parts[0]);
  const checkOut = parseIndianDate(parts[1] || parts[0]);
  return { checkIn, checkOut };
}

const MONTHS = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12 };

function parseIndianDate(raw) {
  if (!raw) return null;
  // Strip ordinal suffixes: 1st,2nd,3rd,4th..31st
  const cleaned = raw.replace(/(\d+)(st|nd|rd|th)/gi, "$1").trim();

  // Try DD/MM/YYYY
  const dmy = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return `${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`;
  }

  // Try "19 Apr" or "Apr 19" with optional year
  const named = cleaned.match(/^(\d{1,2})\s+([A-Za-z]{3,})(?:\s+(\d{4}))?$/) ||
                cleaned.match(/^([A-Za-z]{3,})\s+(\d{1,2})(?:\s+(\d{4}))?$/);
  if (named) {
    let day, monStr, year;
    if (/^\d/.test(cleaned)) {
      [, day, monStr, year] = cleaned.match(/^(\d{1,2})\s+([A-Za-z]{3,})(?:\s+(\d{4}))?$/) || [];
    } else {
      [, monStr, day, year] = cleaned.match(/^([A-Za-z]{3,})\s+(\d{1,2})(?:\s+(\d{4}))?$/) || [];
    }
    const m = MONTHS[monStr?.toLowerCase().slice(0,3)];
    if (day && m) {
      const y = year || new Date().getFullYear();
      return `${y}-${String(m).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    }
  }

  return null;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      if (inQuotes && line[i+1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (line[i] === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += line[i];
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCSV(csvText, property = "P1") {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const hMap = resolveHeaders(headers);

  const bookings = [];
  let idCounter = 1;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.every((c) => !c)) continue;

    const get = (field) => (hMap[field] !== undefined ? cols[hMap[field]] || "" : "");

    const { checkIn, checkOut } = parseBookingDates(get("bookingDates"));
    if (!checkIn || !checkOut) continue;

    const perNight = parseFloat(get("perNight").replace(/[₹,\s]/g, "")) || 0;
    const startDate = new Date(checkIn);
    const endDate   = new Date(checkOut);
    const nights    = Math.max(1, Math.round((endDate - startDate) / 86400000));
    const revenue   = perNight * nights;

    // room name: prefer explicit room col, else derive from room type
    const roomRaw  = get("room");
    const room     = roomRaw || get("roomType") || "Unknown";
    const roomType = room;

    bookings.push({
      id:        `csv-${property}-${idCounter++}`,
      guestName: get("guestName") || "Guest",
      room,
      roomType,
      nights,
      revenue,
      source:    get("source") || "Direct",
      checkIn,
      checkOut,
      status:    get("status") || "confirmed",
      guestType: "unknown",
      city:      "",
      repeat:    false,
      purpose:   get("purpose") || "",
      property,
    });
  }

  return bookings;
}

// Fetch a Google Sheet as CSV (sheet must be publicly viewable)
export async function fetchGoogleSheetCSV(sheetUrl) {
  // Normalise: accept edit URL or export URL
  let exportUrl = sheetUrl;
  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    const sheetId = match[1];
    // Extract gid if present
    const gidMatch = sheetUrl.match(/[#&]gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : "0";
    exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  }
  const res = await fetch(exportUrl);
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);
  return res.text();
}
