import React from "react";
import "./App.css";
import { fetchNeo, NeoItem } from "./api";

type SortKey = "sizeMeters" | "missDistanceKm" | "relativeVelocityKps";

function App() {
  const [date, setDate] = React.useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [items, setItems] = React.useState<NeoItem[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<SortKey>("missDistanceKm");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const load = React.useCallback(async (d: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchNeo(d);
      setItems(res.objects);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
      setItems(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load(date);
  }, [date, load]);

  const sorted = React.useMemo(() => {
    if (!items) return [] as NeoItem[];
    const copy = [...items];
    copy.sort((a, b) => {
      const va = a[sortBy];
      const vb = b[sortBy];
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [items, sortBy, sortDir]);

  // Sort the data
  function onSort(key: SortKey) {
    if (key === sortBy) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-nasa-blue">NASA</span> Near Earth Objects
          </h1>
          <p className="text-blue-200 text-lg">
            Track asteroids and comets approaching Earth
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex items-center gap-3">
              <label className="text-white font-medium">Select Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-nasa-blue focus:border-transparent"
              />
            </div>
            <button
              onClick={() => load(date)}
              disabled={loading}
              className="px-6 py-2 bg-nasa-blue hover:bg-blue-700 disabled:bg-gray-500 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-200 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Object Name
                    </th>
                    <th
                      className="px-6 py-4 text-right text-xs font-medium text-blue-200 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => onSort("sizeMeters")}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Size (meters)
                        {sortBy === "sizeMeters" && (
                          <span className="text-nasa-blue">
                            {sortDir === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-right text-xs font-medium text-blue-200 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => onSort("missDistanceKm")}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Closest Approach (km)
                        {sortBy === "missDistanceKm" && (
                          <span className="text-nasa-blue">
                            {sortDir === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-right text-xs font-medium text-blue-200 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => onSort("relativeVelocityKps")}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Relative Velocity (km/s)
                        {sortBy === "relativeVelocityKps" && (
                          <span className="text-nasa-blue">
                            {sortDir === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sorted.map((it, index) => (
                    <tr
                      key={it.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-nasa-blue rounded-full"></div>
                          <span className="text-white font-medium">
                            {it.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-blue-200 font-mono">
                          {it.sizeMeters.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-green-200 font-mono">
                          {it.missDistanceKm.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-yellow-200 font-mono">
                          {it.relativeVelocityKps.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sorted.length === 0 && (
              <div className="text-center py-12">
                <div className="text-blue-200 text-lg">
                  No Near Earth Objects found for this date
                </div>
                <div className="text-blue-300 text-sm mt-2">
                  Try selecting a different date
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-300 text-sm">
            Project by{" "}
            <a
              href="https://www.linkedin.com/in/reid-vanwagner/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 underline"
            >
              Reid Van Wagner
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
