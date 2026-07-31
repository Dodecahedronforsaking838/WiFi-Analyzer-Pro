import { useState, useEffect, useCallback, useRef } from "react";
import {
  RefreshCw,
  Signal,
  Radio,
  Volume2,
  Ratio,
  MapPin,
  Waves,
  MonitorSpeaker,
  Pause,
  Play,
} from "lucide-react";
import api from "../services/api";
import SignalGauge from "../components/signal/SignalGauge";
import SignalCard from "../components/signal/SignalCard";
import QualityBadge from "../components/signal/QualityBadge";
import SignalTrendChart from "../components/signal/SignalTrendChart";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";

const MAX_HISTORY = 30;

export default function SignalAnalyzer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchSignal = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get("/signal");
      const d = response.data;
      setData(d);
      setLastUpdated(new Date());

      // Append to history
      setHistory((prev) => {
        const now = new Date();
        const entry = {
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          percent: d.signal_percent,
          rssi: d.rssi,
        };
        const updated = [...prev, entry];
        return updated.slice(-MAX_HISTORY);
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch signal data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSignal();
  }, [fetchSignal]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchSignal, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, fetchSignal]);

  if (loading) return <LoadingSpinner message="Analyzing signal..." />;
  if (error) return <ErrorState message={error} onRetry={fetchSignal} />;
  if (!data) return <LoadingSpinner message="No signal data available." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Signal Analyzer</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Loading..."}
            {autoRefresh && <span className="ml-2 text-indigo-400">(auto-refresh: 5s)</span>}
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
            onClick={fetchSignal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SignalGauge percent={data.signal_percent} rssi={data.rssi} />

        <div className="grid grid-cols-2 gap-4">
          <SignalCard icon={Signal} title="RSSI" value={data.rssi} unit="dBm" color="indigo" />
          <SignalCard icon={Radio} title="Signal" value={data.signal_percent} unit="%" color="cyan" />
          <SignalCard icon={Volume2} title="Noise" value={data.noise} unit="dBm" color="red" />
          <SignalCard icon={Ratio} title="SNR" value={data.snr} unit="dB" color="emerald" />
        </div>

        <div className="space-y-4">
          <QualityBadge quality={data.quality} />
          <SignalCard icon={MapPin} title="Channel" value={data.channel} color="purple" />
          <SignalCard icon={Waves} title="Frequency" value={data.frequency} color="amber" />
          <SignalCard icon={MonitorSpeaker} title="Bandwidth" value={data.bandwidth} color="cyan" />
        </div>
      </div>

      {/* Live Signal History Chart */}
      <SignalTrendChart history={history} />
    </div>
  );
}
