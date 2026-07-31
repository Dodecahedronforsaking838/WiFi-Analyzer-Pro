import {
  Globe,
  Server,
  Cpu,
  Network,
  Shield,
  MapPin,
} from "lucide-react";

const infoFields = [
  { key: "hostname", label: "Hostname", icon: Server },
  { key: "local_ip", label: "Local IP", icon: Network },
  { key: "public_ip", label: "Public IP", icon: Globe },
  { key: "gateway", label: "Gateway", icon: MapPin },
  { key: "dns_server", label: "DNS Server", icon: Shield },
  { key: "mac_address", label: "MAC Address", icon: Cpu },
  { key: "operating_system", label: "Operating System", icon: Cpu },
];

export default function NetworkInfoCard({ info }) {
  if (!info) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Network Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
        {infoFields.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">{label}</span>
            </div>
            <span className="text-sm font-medium text-white font-mono">
              {info[key] || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
