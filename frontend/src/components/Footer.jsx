export default function Footer() {
  return (
    <footer className="py-4 px-6 border-t border-gray-800 flex items-center justify-between">
      <p className="text-xs text-gray-500">
        &copy; {new Date().getFullYear()} NetPulse Pro &mdash; Enterprise Network Diagnostics
      </p>
      <p className="text-xs text-gray-600">v1.0.0</p>
    </footer>
  );
}
