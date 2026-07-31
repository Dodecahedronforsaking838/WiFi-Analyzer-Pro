export default function AnalyticsCard({ icon: Icon, title, value, unit, color = "indigo" }) {
  const colors = {
    indigo: { bg: "bg-indigo-600/10 border-indigo-500/20", icon: "text-indigo-400", val: "text-indigo-400" },
    cyan: { bg: "bg-cyan-600/10 border-cyan-500/20", icon: "text-cyan-400", val: "text-cyan-400" },
    emerald: { bg: "bg-emerald-600/10 border-emerald-500/20", icon: "text-emerald-400", val: "text-emerald-400" },
    amber: { bg: "bg-amber-600/10 border-amber-500/20", icon: "text-amber-400", val: "text-amber-400" },
  };

  const s = colors[color] || colors.indigo;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl ${s.bg} border flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${s.icon}`} />
        </div>
        <div>
          <p className="text-xs text-gray-400">{title}</p>
          <p className="text-xl font-bold text-white mt-0.5">
            {value}
            {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
