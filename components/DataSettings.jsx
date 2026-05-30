"use client";
import { useState, useRef } from "react";
import { X, Upload, Link, RotateCcw } from "lucide-react";
import { parseCSV, fetchGoogleSheetCSV } from "@/lib/clientCSV";
import { getMockData } from "@/lib/mock";

const LS_KEY = "kk-data-source-v1";

export default function DataSettings({ onClose, onDataLoaded }) {
  const [tab, setTab] = useState("csv");
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetUrl2, setSheetUrl2] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "ok" | "error"
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  function handleReset() {
    localStorage.removeItem(LS_KEY);
    onDataLoaded(getMockData(), "demo");
    onClose();
  }

  async function processCSVText(text, property) {
    const bookings = parseCSV(text, property);
    return bookings;
  }

  async function handleFiles(files) {
    setStatus("loading");
    setErrorMsg("");
    try {
      let allBookings = [];
      for (const file of files) {
        const text = await file.text();
        // Guess property from filename: if "p2" or "property2" or "prop2" in name → P2
        const prop = /p2|property.?2|prop.?2/i.test(file.name) ? "P2" : "P1";
        const bookings = await processCSVText(text, prop);
        allBookings = allBookings.concat(bookings);
      }
      const data = { bookings: allBookings, cafe: [], notes: [] };
      const saved = { type: "csv", data };
      localStorage.setItem(LS_KEY, JSON.stringify(saved));
      setStatus("ok");
      onDataLoaded(data, "csv");
      setTimeout(onClose, 800);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e.message);
    }
  }

  async function handleSheetLoad() {
    if (!sheetUrl.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      let allBookings = [];
      const text1 = await fetchGoogleSheetCSV(sheetUrl);
      allBookings = allBookings.concat(parseCSV(text1, "P1"));
      if (sheetUrl2.trim()) {
        const text2 = await fetchGoogleSheetCSV(sheetUrl2);
        allBookings = allBookings.concat(parseCSV(text2, "P2"));
      }
      const data = { bookings: allBookings, cafe: [], notes: [] };
      const saved = { type: "sheet", urls: [sheetUrl, sheetUrl2].filter(Boolean), data };
      localStorage.setItem(LS_KEY, JSON.stringify(saved));
      setStatus("ok");
      onDataLoaded(data, "sheet");
      setTimeout(onClose, 800);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-sand-200 w-full max-w-lg">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sand-200">
          <h2 className="font-semibold text-walnut-700">Data Settings</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-sand-100 text-mocha-400"><X size={16}/></button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-sand-200 px-5">
          {[["csv","CSV Upload"],["sheet","Google Sheet"]].map(([key,label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`py-3 px-1 mr-5 text-sm font-medium border-b-2 transition-colors ${
                tab===key ? "border-tan-500 text-tan-500" : "border-transparent text-mocha-400 hover:text-walnut-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {tab === "csv" && (
            <>
              <p className="text-sm text-mocha-400">
                Upload one or two CSV files exported from your booking sheet.
                Files with <code className="bg-sand-100 px-1 rounded text-xs">p2</code> or <code className="bg-sand-100 px-1 rounded text-xs">property2</code> in the name are treated as Property 2.
              </p>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles([...e.dataTransfer.files]); }}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragging ? "border-tan-400 bg-tan-500/5" : "border-sand-200 hover:border-tan-300 hover:bg-sand-100/50"
                }`}
              >
                <Upload className="mx-auto mb-2 text-mocha-400" size={24}/>
                <p className="text-sm text-mocha-400">Drag & drop CSV files here, or <span className="text-tan-500 font-medium">browse</span></p>
                <p className="text-xs text-mocha-400/60 mt-1">Supports multiple files (P1 + P2)</p>
                <input ref={fileRef} type="file" accept=".csv,text/csv" multiple className="hidden" onChange={(e)=>handleFiles([...e.target.files])} />
              </div>
            </>
          )}

          {tab === "sheet" && (
            <>
              <p className="text-sm text-mocha-400">
                Share your Google Sheet with "Anyone with the link can view", then paste the URL below.
              </p>
              <div className="space-y-2">
                <label className="text-xs font-medium text-mocha-400">Property 1 sheet URL</label>
                <div className="flex gap-2">
                  <Link size={14} className="mt-2.5 text-mocha-400 flex-shrink-0"/>
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={(e)=>setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="flex-1 border border-sand-200 rounded-lg px-3 py-2 text-sm bg-cream-50 focus:outline-none focus:ring-2 focus:ring-tan-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-mocha-400">Property 2 sheet URL <span className="text-mocha-400/50">(optional)</span></label>
                <div className="flex gap-2">
                  <Link size={14} className="mt-2.5 text-mocha-400 flex-shrink-0"/>
                  <input
                    type="url"
                    value={sheetUrl2}
                    onChange={(e)=>setSheetUrl2(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="flex-1 border border-sand-200 rounded-lg px-3 py-2 text-sm bg-cream-50 focus:outline-none focus:ring-2 focus:ring-tan-400"
                  />
                </div>
              </div>
              <button
                onClick={handleSheetLoad}
                disabled={!sheetUrl.trim() || status==="loading"}
                className="w-full py-2.5 rounded-lg bg-tan-500 text-white text-sm font-medium hover:bg-tan-600 disabled:opacity-50 transition-colors"
              >
                {status==="loading" ? "Loading…" : "Load from Sheet"}
              </button>
            </>
          )}

          {/* Status messages */}
          {status==="ok"    && <p className="text-sm text-moss-500 font-medium">✓ Data loaded successfully!</p>}
          {status==="error" && <p className="text-sm text-red-500">Error: {errorMsg}</p>}

          {/* Reset */}
          <div className="pt-2 border-t border-sand-200">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-mocha-400 hover:text-walnut-600 transition-colors"
            >
              <RotateCcw size={14}/> Reset to Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
