import { useLocation } from "react-router-dom";
import { Search, Bell, Sun, Moon, Menu } from "lucide-react";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/wifi-scanner": "Wi-Fi Scanner",
  "/signal-analyzer": "Signal Analyzer",
  "/network-diagnostics": "Network Diagnostics",
  "/speed-test": "Speed Test",
  "/analytics": "Analytics",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function TopNavbar({ darkMode, onToggleTheme, onMobileMenuToggle }) {
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-white">{currentTitle}</h2>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700 focus-within:border-indigo-500 transition-colors">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-40 lg:w-56"
          />
        </div>

        {/* Notification bell */}
        <button aria-label="Notifications" className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User avatar */}
        <button className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold hover:ring-2 hover:ring-indigo-400 transition-all">
          NP
        </button>
      </div>
    </header>
  );
}
