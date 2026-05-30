"use client";
import { useState, useEffect } from "react";
import Header from "./Header";
import Tabs from "./Tabs";
import StatRow from "./StatRow";
import RoomGrid from "./RoomGrid";
import DateCheck from "./DateCheck";
import Trends from "./Trends";
import DataSettings from "./DataSettings";
import { todayStats, roomStates } from "@/lib/analytics";
import { ROOMS } from "@/lib/mock";

const LS_KEY = "kk-data-source-v1";

export default function Dashboard({ initialData }) {
  const [data, setData] = useState(initialData);
  const [dataSource, setDataSource] = useState("demo");
  const [activeTab, setActiveTab] = useState("Today");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // On mount, check localStorage for override
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.data) {
          setData(saved.data);
          setDataSource(saved.type === "sheet" ? "sheet" : "csv");
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  function handleDataLoaded(newData, source) {
    setData(newData);
    setDataSource(source);
  }

  const today = new Date().toISOString().split("T")[0];
  const stats  = todayStats(data.bookings, ROOMS, today);
  const states = roomStates(data.bookings, today);

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Header dataSource={dataSource} onSettingsOpen={() => setSettingsOpen(true)} />
      <Tabs active={activeTab} onChange={setActiveTab} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-5 space-y-5">
        {activeTab === "Today" && (
          <>
            <StatRow stats={stats} />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-mocha-400 mb-3">Rooms</h2>
              <RoomGrid states={states} />
            </div>
          </>
        )}

        {activeTab === "Date Check" && (
          <DateCheck bookings={data.bookings} />
        )}

        {activeTab === "Trends" && (
          <Trends bookings={data.bookings} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-mocha-400/60 py-4 border-t border-sand-200">
        Kath Kuni Cafe & Stay · Shangarh, Sainj Valley · kathkunicafe.com
      </footer>

      {settingsOpen && (
        <DataSettings
          onClose={() => setSettingsOpen(false)}
          onDataLoaded={handleDataLoaded}
        />
      )}
    </div>
  );
}
