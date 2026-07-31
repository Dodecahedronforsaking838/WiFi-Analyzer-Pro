import { useState, useEffect, useCallback, useRef } from "react";
import {
  RefreshCw,
  ArrowDownToLine,
  ArrowUpFromLine,
  Timer,
  Signal,
  Pause,
  Play,
} from "lucide-react";
import api from "../services/api";
import AnalyticsCard from "../components/analytics/AnalyticsCard";
import PerformanceCard from "../components/analytics/PerformanceCard";
import SpeedHistoryChart from "../components/analytics/SpeedHistoryChart";
import SignalHistoryChart from "../components/analytics/SignalHistoryChart";
import PingHistoryChart from "../components/analytics/PingHistoryChart";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get("/analytics");
      setData(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchAnalytics, 10000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, fetchAnalytics]);

  if (loading) return <LoadingSpinner message="Loading analytics..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAnalytics} />;
  if (!data) return <LoadingSpinner message="No analytics data available." />;

  const { summary, speed_history, signal_history, ping_history } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {lastUpdated && `Updated: ${lastUpdated.toLocaleTimeString()}`}
            {autoRefresh && <span className="ml-2 text-indigo-400">(auto-refresh: 10s)</span>}
            {summary.total_readings > 0 && (
              <span className="ml-2">• {summary.total_readings} readings collected</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh((p) => !p)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
              autoRefresh
                ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400"
                : "bg-gray-800 border-gray-700 text-gray-400"
            }`}
          >
            {autoRefresh ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {autoRefresh ? "Pause" : "Resume"}
          </button>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards + Performance Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AnalyticsCard icon={ArrowDownToLine} title="Avg Download" value={summary.avg_download} unit="Mbps" color="indigo" />
        <AnalyticsCard icon={ArrowUpFromLine} title="Avg Upload" value={summary.avg_upload} unit="Mbps" color="cyan" />
        <AnalyticsCard icon={Timer} title="Avg Ping" value={summary.avg_ping} unit="ms" color="emerald" />
        <AnalyticsCard icon={Signal} title="Avg Signal" value={summary.avg_signal} unit="%" color="amber" />
        <PerformanceCard score={summary.performance_score} />
      </div>

      {/* Speed History Chart */}
      <SpeedHistoryChart data={speed_history} />

      {/* Signal + Ping Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignalHistoryChart data={signal_history} />
        <PingHistoryChart data={ping_history} />
      </div>
    </div>
  );
}
