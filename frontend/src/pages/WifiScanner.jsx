import { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw, Search, ArrowUpDown, Filter } from "lucide-react";
import api from "../services/api";
import CurrentNetworkCard from "../components/wifi/CurrentNetworkCard";
import NetworksTable from "../components/wifi/NetworksTable";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function WifiScanner() {
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("signal");
  const [filterFreq, setFilterFreq] = useState("all");
  const [filterSecurity, setFilterSecurity] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [currentRes, scanRes] = await Promise.all([
        api.get("/wifi/current"),
        api.get("/wifi/scan"),
      ]);
      setCurrentNetwork(currentRes.data);
      setNetworks(scanRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Wi-Fi data. Is the backend running?");
    } finally {
      setLoading(false);
      setScanning(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setScanning(true);
    fetchData();
  };

  // Filtered + sorted networks
  const filteredNetworks = useMemo(() => {
    let result = [...networks];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((n) => n.ssid.toLowerCase().includes(q));
    }

    // Frequency filter
    if (filterFreq === "2.4") {
      result = result.filter((n) => n.frequency === "2.4 GHz");
    } else if (filterFreq === "5") {
      result = result.filter((n) => n.frequency === "5 GHz");
    }

    // Security filter
    if (filterSecurity === "wpa3") {
      result = result.filter((n) => n.security.includes("WPA3"));
    } else if (filterSecurity === "wpa2") {
      result = result.filter((n) => n.security.includes("WPA2"));
    } else if (filterSecurity === "open") {
      result = result.filter((n) => n.security === "Open");
    }

    // Sort
    if (sortBy === "signal") {
      result.sort((a, b) => b.signal_percent - a.signal_percent);
    } else if (sortBy === "channel") {
      result.sort((a, b) => a.channel - b.channel);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.ssid.localeCompare(b.ssid));
    }

    return result;
  }, [networks, searchQuery, sortBy, filterFreq, filterSecurity]);

  if (loading) return <LoadingSpinner message="Scanning networks..." />;
  if (error) return <ErrorState message={error} onRetry={handleRefresh} />;
  if (!currentNetwork && networks.length === 0) return <EmptyState message="No Wi-Fi networks detected." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Wi-Fi Scanner</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {networks.length} networks detected
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={scanning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning..." : "Refresh Scan"}
        </button>
      </div>

      {/* Current Network */}
      <CurrentNetworkCard network={currentNetwork} />

      {/* Filters Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700 focus-within:border-indigo-500 transition-colors flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search networks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-xs text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="signal">Signal Strength</option>
              <option value="channel">Channel</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Frequency filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterFreq}
              onChange={(e) => setFilterFreq(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-xs text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Bands</option>
              <option value="2.4">2.4 GHz</option>
              <option value="5">5 GHz</option>
            </select>
          </div>

          {/* Security filter */}
          <select
            value={filterSecurity}
            onChange={(e) => setFilterSecurity(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-xs text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Security</option>
            <option value="wpa3">WPA3</option>
            <option value="wpa2">WPA2</option>
            <option value="open">Open</option>
          </select>
        </div>
      </div>

      {/* Networks Table */}
      {filteredNetworks.length > 0 ? (
        <NetworksTable networks={filteredNetworks} />
      ) : (
        <EmptyState message="No networks match your filters." />
      )}
    </div>
  );
}
