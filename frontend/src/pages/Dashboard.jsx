import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wifi,
  Signal,
  ArrowDownToLine,
  ArrowUpFromLine,
  Timer,
  Globe,
  Network,
  Shield,
  Activity,
  RefreshCw,
  Gauge,
  FileText,
  Radio,
} from "lucide-react";
import api from "../services/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";

function StatCard({ icon: Icon, title, value, subtitle, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-600/10 border-indigo-500/20 text-indigo-400",
    cyan: "bg-cyan-600/10 border-cyan-500/20 text-cyan-400",
    emerald: "bg-emerald-600/10 border-emerald-500/20 text-emerald-400",
    amber: "bg-amber-600/10 border-amber-500/20 text-amber-400",
    red: "bg-red-600/10 border-red-500/20 text-red-400",
    purple: "bg-purple-600/10 border-purple-500/20 text-purple-400",
  };
  const c = colors[color] || colors.indigo;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${c} border flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-400 truncate">{title}</p>
          <p className="text-lg font-bold text-white mt-0.5 truncate">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function HealthGauge({ score, label }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = "text-emerald-400";
  if (score < 50) color = "text-red-400";
  else if (score < 70) color = "text-amber-400";
  else if (score < 85) color = "text-cyan-400";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Network Health</h3>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#1f2937" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={radius} fill="none"
            stroke="currentColor" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{score}%</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-medium ${color}`}>{label}</span>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200 group w-full"
    >
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboard} />;
  if (!data) return <LoadingSpinner message="No data available." />;

  const { connection, signal, network, health, last_updated } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Last updated: {new Date(last_updated).toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm border border-gray-700 hover:bg-gray-700 hover:text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Connection + Signal Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard icon={Wifi} title="SSID" value={connection.ssid} subtitle={connection.status} color="indigo" />
        <StatCard icon={Signal} title="Signal Strength" value={`${signal.signal_percent}%`} subtitle={`${signal.rssi} dBm`} color={signal.signal_percent >= 70 ? "emerald" : "amber"} />
        <StatCard icon={Radio} title="Frequency" value={connection.frequency} subtitle={`Ch ${connection.channel}`} color="cyan" />
        <StatCard icon={Shield} title="Security" value={connection.security} subtitle={connection.link_speed} color="purple" />
        <StatCard icon={Activity} title="SNR" value={`${signal.snr} dB`} subtitle={`Noise: ${signal.noise} dBm`} color="emerald" />
        <StatCard icon={Timer} title="Quality" value={signal.quality} color={signal.quality === "Excellent" ? "emerald" : "amber"} />
      </div>

      {/* Network Info + Health */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Network Info */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Network Information</h3>
          <div className="space-y-0">
            {[
              { label: "Local IP", value: network.local_ip, icon: Network },
              { label: "Public IP", value: network.public_ip, icon: Globe },
              { label: "Gateway", value: network.gateway, icon: ArrowUpFromLine },
              { label: "DNS Server", value: network.dns_server, icon: ArrowDownToLine },
              { label: "Hostname", value: network.hostname, icon: Activity },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm text-gray-400">{item.label}</span>
                </div>
                <span className="text-sm font-mono text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Gauge */}
        <HealthGauge score={health.score} label={health.label} />

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <QuickActionButton icon={Wifi} label="Scan Wi-Fi" onClick={() => navigate("/wifi-scanner")} color="from-indigo-600 to-indigo-500" />
            <QuickActionButton icon={Gauge} label="Speed Test" onClick={() => navigate("/speed-test")} color="from-cyan-600 to-cyan-500" />
            <QuickActionButton icon={Network} label="Diagnostics" onClick={() => navigate("/network-diagnostics")} color="from-emerald-600 to-emerald-500" />
            <QuickActionButton icon={FileText} label="Generate Report" onClick={() => navigate("/reports")} color="from-amber-600 to-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
