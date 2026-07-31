import { CheckCircle2, XCircle } from "lucide-react";

export default function DnsLookupCard({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-300">DNS Lookup Results</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Domain
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resolved IP
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Response Time
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {results.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-150">
                <td className="px-6 py-3.5">
                  <span className="font-medium text-white">{entry.domain}</span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-gray-400 font-mono text-xs">{entry.ip_address}</span>
                </td>
                <td className="px-6 py-3.5 hidden sm:table-cell">
                  <span className="text-gray-400 font-mono text-xs">
                    {entry.response_time}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  {entry.status === "Resolved" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
                      <XCircle className="w-3.5 h-3.5" />
                      Failed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
