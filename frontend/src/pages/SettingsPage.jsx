import { useState, useEffect, useCallback } from "react";
import { Save, RotateCcw } from "lucide-react";
import api from "../services/api";
import SettingsCard from "../components/settings/SettingsCard";
import ToggleSwitch from "../components/settings/ToggleSwitch";
import SettingsDropdown from "../components/settings/SettingsDropdown";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";

const refreshIntervalOptions = [
  { value: "10", label: "10 seconds" },
  { value: "30", label: "30 seconds" },
  { value: "60", label: "1 minute" },
  { value: "120", label: "2 minutes" },
  { value: "300", label: "5 minutes" },
];

const speedUnitOptions = [
  { value: "Mbps", label: "Mbps" },
  { value: "Kbps", label: "Kbps" },
  { value: "MBps", label: "MB/s" },
];

const languageOptions = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Japanese", label: "Japanese" },
];

const themeOptions = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get("/settings");
      setSettings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSuccessMsg(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setError(null);
    try {
      const response = await api.post("/settings", settings);
      setSuccessMsg(response.data.message);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setError(null);
    try {
      await api.post("/settings/reset");
      await fetchSettings();
      setSuccessMsg("Settings reset to defaults");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

  if (error && !settings) {
    return <ErrorState message={error} onRetry={fetchSettings} />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Configure application preferences
        </p>
      </div>

      {/* Success / Error messages */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
          <span className="text-sm text-emerald-400">{successMsg}</span>
        </div>
      )}
      {error && settings && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-400 rounded-full" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {/* Appearance */}
      <SettingsCard title="Appearance">
        <SettingsDropdown
          label="Theme"
          description="Choose your preferred color theme"
          value={settings.theme}
          options={themeOptions}
          onChange={(val) => handleChange("theme", val)}
        />
        <SettingsDropdown
          label="Language"
          description="Select display language"
          value={settings.language}
          options={languageOptions}
          onChange={(val) => handleChange("language", val)}
        />
      </SettingsCard>

      {/* Network Preferences */}
      <SettingsCard title="Network Preferences">
        <ToggleSwitch
          label="Auto Refresh"
          description="Automatically refresh network data"
          checked={settings.auto_refresh}
          onChange={(val) => handleChange("auto_refresh", val)}
        />
        <SettingsDropdown
          label="Refresh Interval"
          description="How often to refresh data"
          value={String(settings.refresh_interval)}
          options={refreshIntervalOptions}
          onChange={(val) => handleChange("refresh_interval", parseInt(val, 10))}
        />
        <SettingsDropdown
          label="Speed Unit"
          description="Default unit for speed measurements"
          value={settings.default_speed_unit}
          options={speedUnitOptions}
          onChange={(val) => handleChange("default_speed_unit", val)}
        />
      </SettingsCard>

      {/* Notifications */}
      <SettingsCard title="Notifications">
        <ToggleSwitch
          label="Enable Notifications"
          description="Receive alerts for network events"
          checked={settings.notifications}
          onChange={(val) => handleChange("notifications", val)}
        />
      </SettingsCard>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
        <button
          onClick={handleReset}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium border border-gray-700 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
