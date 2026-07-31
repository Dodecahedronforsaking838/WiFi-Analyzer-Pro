export default function SignalCard({ icon: Icon, title, value, unit, color = "indigo" }) {
  const colorStyles = {
    indigo: "bg-indigo-600/10 border-indigo-500/20 text-indigo-400",
    cyan: "bg-cyan-600/10 border-cyan-500/20 text-cyan-400",
    emerald: "bg-emerald-600/10 border-emerald-500/20 text-emerald-400",
    amber: "bg-amber-600/10 border-amber-500/20 text-amber-400",
    red: "bg-red-600/10 border-red-500/20 text-red-400",
    purple: "bg-purple-600/10 border-purple-500/20 text-purple-400",
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${style} border flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-400">{title}</p>
          <p className="text-lg font-bold text-white mt-0.5">
            {value}
            {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
