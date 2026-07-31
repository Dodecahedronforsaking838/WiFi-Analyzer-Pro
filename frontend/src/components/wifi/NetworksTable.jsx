import { Wifi, Lock, Unlock, CheckCircle2 } from "lucide-react";

function getSignalColor(percent) {
  if (percent >= 80) return "text-emerald-400";
  if (percent >= 60) return "text-cyan-400";
  if (percent >= 40) return "text-amber-400";
  return "text-red-400";
}

function getSignalLabel(percent) {
  if (percent >= 80) return "Excellent";
  if (percent >= 60) return "Good";
  if (percent >= 40) return "Fair";
  return "Weak";
}

function SignalBars({ percent }) {
  const color = getSignalColor(percent);
  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={`w-1 rounded-sm transition-all ${
            bar * 25 <= percent ? "bg-current" : "bg-gray-700"
          } ${color}`}
          style={{ height: `${4 + bar * 3}px` }}
        />
      ))}
    </div>
  );
}

export default function NetworksTable({ networks }) {
  if (!networks || networks.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-300">
          Nearby Networks
          <span className="ml-2 text-xs font-normal text-gray-500">
            ({networks.length} found)
          </span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Network
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Signal
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Frequency
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Channel
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Security
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {networks.map((network, index) => (
              <tr
                key={index}
                className="hover:bg-gray-800/30 transition-colors duration-150"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <Wifi className={`w-4 h-4 ${getSignalColor(network.signal_percent)}`} />
                    <div>
                      <p className="font-medium text-white flex items-center gap-2">
                        {network.ssid}
                        {network.connected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <SignalBars percent={network.signal_percent} />
                    <span className={`text-xs font-medium ${getSignalColor(network.signal_percent)}`}>
                      {getSignalLabel(network.signal_percent)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({network.signal_strength} dBm)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3.5 hidden md:table-cell">
                  <span className="text-gray-300">{network.frequency}</span>
                </td>
                <td className="px-6 py-3.5 hidden lg:table-cell">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-800 text-xs font-medium text-gray-300">
                    Ch {network.channel}
                  </span>
                </td>
                <td className="px-6 py-3.5 hidden sm:table-cell">
                  <div className="flex items-center gap-1.5">
                    {network.security === "Open" ? (
                      <Unlock className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-gray-500" />
                    )}
                    <span className={`text-xs ${network.security === "Open" ? "text-amber-400" : "text-gray-400"}`}>
                      {network.security}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
