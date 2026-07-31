import { useEffect, useState } from "react";

export default function Speedometer({ value, max = 300, label, unit = "Mbps" }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (value === null || value === undefined) {
      setAnimatedValue(0);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();
    let rafId;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;
      setAnimatedValue(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  // SVG arc calculations
  const radius = 80;
  const strokeWidth = 12;
  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = endAngle - startAngle;
  const progress = Math.min(animatedValue / max, 1);

  // Color based on speed
  let gradientId = "speedGradient";
  let colorClass = "text-indigo-400";
  if (animatedValue > max * 0.7) {
    colorClass = "text-emerald-400";
  } else if (animatedValue > max * 0.4) {
    colorClass = "text-cyan-400";
  }

  // Calculate arc path
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

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <path
            d={bgPath}
            fill="none"
            stroke="#1f2937"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          {progress > 0 && (
            <path
              d={fgPath}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          )}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span className={`text-4xl font-bold ${colorClass}`}>
            {animatedValue.toFixed(1)}
          </span>
          <span className="text-sm text-gray-400">{unit}</span>
        </div>
      </div>
      {label && <p className="text-sm font-medium text-gray-300 mt-2">{label}</p>}
    </div>
  );
}
