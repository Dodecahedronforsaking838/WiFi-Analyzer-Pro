import { useState } from "react";
import {
  Play,
  ArrowDownToLine,
  ArrowUpFromLine,
  Timer,
  Server,
  Globe,
} from "lucide-react";
import api from "../services/api";
import Speedometer from "../components/speedtest/Speedometer";
import SpeedStatCard from "../components/speedtest/SpeedStatCard";
import ErrorState from "../components/ui/ErrorState";

export default function SpeedTest() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | testing | done

  const runTest = async () => {
    setRunning(true);
    setError(null);
    setPhase("testing");
    setResults(null);

    try {
      const response = await api.get("/speedtest", { timeout: 120000 });
      setResults(response.data);
      setPhase("done");
    } catch (err) {
      setError(
        err.response?.data?.message || "Speed test failed. Is the backend running?"
      );
      setPhase("idle");
    } finally {
      setRunning(false);
    }
  };

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          setError(null);
          setPhase("idle");
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-white">Internet Speed Test</h1>
        <p className="text-sm text-gray-400 mt-1">
          Measure your download, upload, and latency
        </p>
      </div>

      {/* Speedometer */}
      <div className="flex justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-md flex flex-col items-center">
          <Speedometer
            value={phase === "done" ? results?.download_value : null}
            max={500}
            label="Download Speed"
          />

          {/* Start Button */}
          <button
            onClick={runTest}
            disabled={running}
            className={`mt-6 flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              running
                ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20"
            }`}
          >
            {running ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-500 border-t-indigo-400 rounded-full animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {phase === "done" ? "Run Again" : "Start Speed Test"}
              </>
            )}
          </button>

          {/* Testing phase animation */}
          {running && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs text-gray-400">Measuring speed... This may take 30-60 seconds.</span>
            </div>
          )}
        </div>
      </div>

      {/* Results Cards */}
      {phase === "done" && results && (
        <div className="space-y-6">
          {/* Speed Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SpeedStatCard
              icon={ArrowDownToLine}
              title="Download Speed"
              value={results.download_value}
              displayValue={results.download}
              color="indigo"
            />
            <SpeedStatCard
              icon={ArrowUpFromLine}
              title="Upload Speed"
              value={results.upload_value}
              displayValue={results.upload}
              color="cyan"
            />
            <SpeedStatCard
              icon={Timer}
              title="Ping"
              value={results.ping_value}
              displayValue={results.ping}
              color="emerald"
            />
          </div>

          {/* Info Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SpeedStatCard
              icon={Server}
              title="Server"
              value={null}
              displayValue={results.server}
              color="purple"
            />
            <SpeedStatCard
              icon={Globe}
              title="ISP"
              value={null}
              displayValue={results.isp}
              color="amber"
            />
          </div>

          {/* Timestamp */}
          <p className="text-center text-xs text-gray-500">
            Test completed at{" "}
            {new Date(results.timestamp).toLocaleString()}
            {results.source === "sample" && (
              <span className="ml-2 text-amber-500">(sample data)</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
