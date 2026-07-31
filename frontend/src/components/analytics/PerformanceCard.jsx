export default function PerformanceCard({ score }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "text-emerald-400";
  let label = "Excellent";
  if (score < 60) {
    color = "text-red-400";
    label = "Poor";
  } else if (score < 75) {
    color = "text-amber-400";
    label = "Fair";
  } else if (score < 90) {
    color = "text-cyan-400";
    label = "Good";
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Performance Score</h3>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-gray-800"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      <span className={`mt-3 text-sm font-medium ${color}`}>{label}</span>
    </div>
  );
}
