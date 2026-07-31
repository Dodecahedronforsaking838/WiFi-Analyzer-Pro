export default function SettingsCard({ title, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
