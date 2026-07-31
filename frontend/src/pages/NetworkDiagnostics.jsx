import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Copy, CheckCircle2, Globe } from "lucide-react";
import api from "../services/api";
import NetworkInfoCard from "../components/network/NetworkInfoCard";
import PingTestTable from "../components/network/PingTestTable";
import DnsLookupCard from "../components/network/DnsLookupCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";

export default function NetworkDiagnostics() {
  const [networkInfo, setNetworkInfo] = useState(null);
  const [pingResults, setPingResults] = useState([]);
  const [dnsResults, setDnsResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDiagnostics = useCallback(async () => {
    try {
      setError(null);
      const [infoRes, pingRes, dnsRes] = await Promise.all([
        api.get("/network/info"),
        api.get("/network/ping"),
        api.get("/network/dns"),
      ]);
      setNetworkInfo(infoRes.data);
      setPingResults(pingRes.data);
      setDnsResults(dnsRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to run network diagnostics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDiagnostics();
  }, [fetchDiagnostics]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDiagnostics();
  };

  const handleCopyResults = () => {
    const lines = [];
    lines.push("=== Network Diagnostics Report ===");
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push("");

    if (networkInfo) {
      lines.push("--- Network Info ---");
      Object.entries(networkInfo).forEach(([k, v]) => lines.push(`${k}: ${v}`));
      lines.push("");
    }

    if (pingResults.length > 0) {
      lines.push("--- Ping Tests ---");
      pingResults.forEach((p) => lines.push(`${p.label} (${p.target}): ${p.latency} [${p.status}]`));
      lines.push("");
    }

    if (dnsResults.length > 0) {
      lines.push("--- DNS Lookups ---");
      dnsResults.forEach((d) => lines.push(`${d.domain} -> ${d.ip_address} (${d.response_time}) [${d.status}]`));
    }

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Determine internet status from ping results
  const internetStatus = pingResults.some((p) => p.status === "Success") ? "Online" : "Offline";

  if (loading) return <LoadingSpinner message="Running diagnostics..." />;
  if (error) return <ErrorState message={error} onRetry={handleRefresh} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Network Diagnostics</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {lastUpdated && `Last run: ${lastUpdated.toLocaleTimeString()}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyResults}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm border border-gray-700 hover:bg-gray-700 hover:text-white transition-all"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Results"}
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Running..." : "Run Diagnostics"}
          </button>
        </div>
      </div>

      {/* Internet Status Banner */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
        internetStatus === "Online"
          ? "bg-emerald-500/10 border-emerald-500/20"
          : "bg-red-500/10 border-red-500/20"
      }`}>
        <Globe className={`w-5 h-5 ${internetStatus === "Online" ? "text-emerald-400" : "text-red-400"}`} />
        <span className={`text-sm font-medium ${internetStatus === "Online" ? "text-emerald-400" : "text-red-400"}`}>
          Internet: {internetStatus}
        </span>
        <span className="text-xs text-gray-500 ml-auto">
          {pingResults.filter((p) => p.status === "Success").length}/{pingResults.length} targets reachable
        </span>
      </div>

      {/* Network Info */}
      <NetworkInfoCard info={networkInfo} />

      {/* Connectivity Tests */}
      <PingTestTable results={pingResults} />

      {/* DNS Lookup */}
      <DnsLookupCard results={dnsResults} />
    </div>
  );
}
