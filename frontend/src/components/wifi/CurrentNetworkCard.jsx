import { Wifi, Shield, Radio, MapPin, Globe, Zap } from "lucide-react";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function SignalIndicator({ percent }) {
  let color = "text-emerald-400";
  let label = "Excellent";
  if (percent < 40) {
    color = "text-red-400";
    label = "Poor";
  } else if (percent < 60) {
    color = "text-amber-400";
    label = "Fair";
  } else if (percent < 80) {
    color = "text-cyan-400";
    label = "Good";
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className={`w-1.5 rounded-full transition-all ${
              bar * 20 <= percent ? "bg-current" : "bg-gray-700"
            } ${color}`}
            style={{ height: `${8 + bar * 4}px` }}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${color}`}>{label}</span>
    </div>
  );
}

export default function CurrentNetworkCard({ network }) {
  if (!network) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
            <Wifi className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{network.ssid}</h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {network.status}
            </span>
          </div>
        </div>
        <SignalIndicator percent={network.signal_percent} />
      </div>

      {/* Details */}
      <div className="space-y-0">
        <InfoRow icon={Radio} label="Frequency" value={network.frequency} />
        <InfoRow icon={MapPin} label="Channel" value={network.channel} />
        <InfoRow icon={Shield} label="Security" value={network.security} />
        <InfoRow icon={Globe} label="IP Address" value={network.ip_address} />
        <InfoRow icon={Zap} label="Link Speed" value={network.link_speed} />
        <InfoRow icon={Wifi} label="Signal" value={`${network.signal_strength} dBm`} />
      </div>
    </div>
  );
}
