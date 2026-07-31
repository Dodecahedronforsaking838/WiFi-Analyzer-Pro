import { useEffect, useState } from "react";

export default function SignalGauge({ percent, rssi }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    if (percent === null || percent === undefined) {
      setAnimatedPercent(0);
      return;
    }

    const duration = 1000;
    const startTime = performance.now();
    let rafId;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(eased * percent);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [percent]);

  const radius = 70;
  const startAngle = 150;
  const endAngle = 390;
  const totalAngle = endAngle - startAngle;
  const progress = Math.min(animatedPercent / 100, 1);

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx, cy, r, startAng, endAng) => {
    const start = polarToCartesian(cx, cy, r, endAng);
    const end = polarToCartesian(cx, cy, r, startAng);
    const largeArcFlag = endAng - startAng <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const bgPath = describeArc(100, 100, radius, startAngle, endAngle);
  const progressEnd = startAngle + totalAngle * progress;
  const fgPath = progress > 0 ? describeArc(100, 100, radius, startAngle, progressEnd) : "";

  // Color based on signal quality
  let color = "text-emerald-400";
  if (animatedPercent < 40) color = "text-red-400";
  else if (animatedPercent < 60) color = "text-amber-400";
  else if (animatedPercent < 80) color = "text-cyan-400";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Live Signal Strength</h3>
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="signalGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="33%" stopColor="#f59e0b" />
              <stop offset="66%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path
            d={bgPath}
            fill="none"
            stroke="#1f2937"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {progress > 0 && (
            <path
              d={fgPath}
              fill="none"
              stroke="url(#signalGaugeGradient)"
              strokeWidth="14"
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
          <span className={`text-4xl font-bold ${color}`}>
            {Math.round(animatedPercent)}%
          </span>
          <span className="text-sm text-gray-400 mt-1">{rssi} dBm</span>
        </div>
      </div>
    </div>
  );
}
