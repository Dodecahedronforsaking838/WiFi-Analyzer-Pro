import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Lazy-loaded route pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const WifiScanner = lazy(() => import("./pages/WifiScanner"));
const SignalAnalyzer = lazy(() => import("./pages/SignalAnalyzer"));
const NetworkDiagnostics = lazy(() => import("./pages/NetworkDiagnostics"));
const SpeedTest = lazy(() => import("./pages/SpeedTest"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Reports = lazy(() => import("./pages/Reports"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wifi-scanner" element={<WifiScanner />} />
          <Route path="/signal-analyzer" element={<SignalAnalyzer />} />
          <Route path="/network-diagnostics" element={<NetworkDiagnostics />} />
          <Route path="/speed-test" element={<SpeedTest />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
