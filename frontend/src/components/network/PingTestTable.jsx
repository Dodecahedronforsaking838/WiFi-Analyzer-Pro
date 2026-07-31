import { CheckCircle2, XCircle, Clock } from "lucide-react";

function StatusBadge({ status }) {
  if (status === "Success") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-3 h-3" />
        Success
      </span>
    );
  }
  if (status === "Timeout") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Clock className="w-3 h-3" />
        Timeout
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
      <XCircle className="w-3 h-3" />
      Failed
    </span>
  );
}

export default function PingTestTable({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-300">Connectivity Tests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Host
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latency
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-150">
                <td className="px-6 py-3.5">
                  <span className="font-medium text-white">{result.label}</span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-gray-400 font-mono text-xs">{result.target}</span>
                </td>
                <td className="px-6 py-3.5">
                  <span
                    className={`font-mono text-sm ${
                      result.status === "Success" ? "text-emerald-400" : "text-gray-500"
                    }`}
                  >
                    {result.latency}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <StatusBadge status={result.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
