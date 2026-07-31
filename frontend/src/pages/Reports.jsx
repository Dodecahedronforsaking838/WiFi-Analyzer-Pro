import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Trash2, Download, FileText, FileDown, Loader2 } from "lucide-react";
import api from "../services/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get("/reports/history");
      setReports(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setSuccessMsg(null);
    try {
      const response = await api.post("/reports/generate");
      setSuccessMsg(response.data.message);
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate report.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (filename) => {
    const baseUrl = api.defaults.baseURL || "http://127.0.0.1:5000/api";
    window.open(`${baseUrl}/reports/download/${filename}`, "_blank");
  };

  const handleDelete = async (reportId) => {
    try {
      await api.delete(`/reports/delete/${reportId}`);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setSuccessMsg("Report deleted");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete report.");
    }
  };

  if (loading) return <LoadingSpinner message="Loading reports..." />;
  if (error && reports.length === 0) return <ErrorState message={error} onRetry={handleRefresh} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">{reports.length} reports generated</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm border border-gray-700 hover:bg-gray-700 hover:text-white transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-indigo-600/20"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            {generating ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
          <span className="text-sm text-emerald-400">{successMsg}</span>
        </div>
      )}

      {/* Reports Table */}
      {reports.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No reports generated yet.</p>
          <p className="text-xs text-gray-500 mt-1">Click &ldquo;Generate Report&rdquo; to create your first network report.</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Report</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Size</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="font-medium text-white">{report.name}</p>
                          <p className="text-xs text-gray-500">{report.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 hidden sm:table-cell text-gray-400">{report.generated_at}</td>
                    <td className="px-6 py-3.5 hidden md:table-cell text-gray-400">{report.size}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        {report.filename && (
                          <button
                            onClick={() => handleDownload(report.filename)}
                            className="p-1.5 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1.5 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 hover:bg-red-600/20 hover:text-red-400 hover:border-red-500/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
