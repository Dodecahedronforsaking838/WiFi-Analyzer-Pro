import { useEffect, useState } from "react";

export default function SpeedStatCard({ icon: Icon, title, value, displayValue, color }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (value === null || value === undefined) {
      setAnimatedValue(0);
      return;
    }

    const duration = 1000;
    const startTime = performance.now();
    let rafId;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(eased * value);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  const colorStyles = {
    indigo: {
      bg: "bg-indigo-600/10 border-indigo-500/20",
      icon: "text-indigo-400",
      value: "text-indigo-400",
    },
    cyan: {
      bg: "bg-cyan-600/10 border-cyan-500/20",
      icon: "text-cyan-400",
      value: "text-cyan-400",
    },
    emerald: {
      bg: "bg-emerald-600/10 border-emerald-500/20",
      icon: "text-emerald-400",
      value: "text-emerald-400",
    },
    amber: {
      bg: "bg-amber-600/10 border-amber-500/20",
      icon: "text-amber-400",
      value: "text-amber-400",
    },
    purple: {
      bg: "bg-purple-600/10 border-purple-500/20",
      icon: "text-purple-400",
      value: "text-purple-400",
    },
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl ${style.bg} border flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${style.icon}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-400">{title}</p>
          <p className={`text-xl font-bold mt-0.5 ${style.value}`}>
            {displayValue || (value !== null ? animatedValue.toFixed(1) : "—")}
          </p>
        </div>
      </div>
    </div>
  );
}
