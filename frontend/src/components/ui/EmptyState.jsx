import { WifiOff } from "lucide-react";

export default function EmptyState({ message = "No data available." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
        <WifiOff className="w-7 h-7 text-gray-500" />
      </div>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}
