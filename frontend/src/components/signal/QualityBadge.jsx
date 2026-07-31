import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

export default function QualityBadge({ quality }) {
  let icon = ShieldCheck;
  let colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  if (quality === "Good") {
    colorClass = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  } else if (quality === "Fair") {
    icon = ShieldAlert;
    colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  } else if (quality === "Poor" || quality === "Very Poor") {
    icon = ShieldX;
    colorClass = "bg-red-500/10 text-red-400 border-red-500/20";
  }

  const Icon = icon;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-center">
      <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border ${colorClass}`}>
        <Icon className="w-5 h-5" />
        <span className="text-sm font-semibold">{quality}</span>
      </div>
    </div>
  );
}
