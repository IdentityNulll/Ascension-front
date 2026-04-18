import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { History, TrendingUp, TrendingDown, Search } from "lucide-react";
import Loading from "../components/Loading";

const Records = () => {
  const { records, isLoading } = useSelector((state) => state.records);

  const [filterType, setFilterType] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredRecords = useMemo(() => {
    let filtered = [...records];
    const now = new Date();

    if (filterType === "positive") {
      filtered = filtered.filter((record) => record.xpChange >= 0);
    }

    if (filterType === "negative") {
      filtered = filtered.filter((record) => record.xpChange < 0);
    }

    if (timeFilter !== "all") {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.createdAt);

        if (timeFilter === "today") {
          return (
            recordDate.getDate() === now.getDate() &&
            recordDate.getMonth() === now.getMonth() &&
            recordDate.getFullYear() === now.getFullYear()
          );
        }

        if (timeFilter === "week") {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          return recordDate >= oneWeekAgo;
        }

        if (timeFilter === "month") {
          return (
            recordDate.getMonth() === now.getMonth() &&
            recordDate.getFullYear() === now.getFullYear()
          );
        }

        return true;
      });
    }

    if (search.trim()) {
      filtered = filtered.filter((record) =>
        record.details.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filtered;
  }, [records, filterType, timeFilter, search]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex max-h-full flex-col space-y-6">
      <h1 className="text-3xl font-bold tracking-wider text-slate-300">
        RECORDS
      </h1>

      <div className="glass flex min-h-[500px] flex-1 flex-col overflow-hidden rounded-xl">
        <div className="border-b border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center gap-2 font-bold text-slate-300">
            <History size={20} /> History Log
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filterType === "all"
                    ? "border border-primary/30 bg-primary/20 text-primary"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilterType("positive")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filterType === "positive"
                    ? "border border-success/30 bg-success/20 text-success"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                Positive
              </button>

              <button
                onClick={() => setFilterType("negative")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filterType === "negative"
                    ? "border border-danger/30 bg-danger/20 text-danger"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                Negative
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTimeFilter("all")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  timeFilter === "all"
                    ? "border border-primary/30 bg-primary/20 text-primary"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                All Time
              </button>

              <button
                onClick={() => setTimeFilter("today")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  timeFilter === "today"
                    ? "border border-primary/30 bg-primary/20 text-primary"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                Today
              </button>

              <button
                onClick={() => setTimeFilter("week")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  timeFilter === "week"
                    ? "border border-primary/30 bg-primary/20 text-primary"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                This Week
              </button>

              <button
                onClick={() => setTimeFilter("month")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  timeFilter === "month"
                    ? "border border-primary/30 bg-primary/20 text-primary"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                This Month
              </button>
            </div>

            <div className="relative w-full md:max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-primary/30"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {filteredRecords.map((record) => (
            <div
              key={record._id}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-surface/50 p-4 transition-colors hover:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-lg p-2 ${
                    record.xpChange >= 0
                      ? "bg-success/20 text-success"
                      : "bg-danger/20 text-danger"
                  }`}
                >
                  {record.xpChange >= 0 ? (
                    <TrendingUp size={20} />
                  ) : (
                    <TrendingDown size={20} />
                  )}
                </div>

                <div>
                  <p className="font-medium text-slate-200">{record.details}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(record.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div
                className={`text-lg font-bold ${
                  record.xpChange >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {record.xpChange >= 0 ? "+" : ""}
                {record.xpChange} XP
              </div>
            </div>
          ))}

          {filteredRecords.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              No records found for this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Records;
