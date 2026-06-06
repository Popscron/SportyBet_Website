import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backend_URL } from "../config/config";

const DEFAULT_MESSAGE =
  "A new version of the app is available. Please update to enjoy the latest features, improvements, and smoother performance.";

const AppVersionUpdate = () => {
  const [enabled, setEnabled] = useState(false);
  const [latestVersion, setLatestVersion] = useState("1.0.0");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get(`${backend_URL}/admin/app-update-config`);
        if (response.data.success && response.data.config) {
          const c = response.data.config;
          setEnabled(Boolean(c.enabled));
          setLatestVersion(c.latestVersion || "1.0.0");
          setDownloadUrl(c.downloadUrl || "");
          setMessage(c.message || DEFAULT_MESSAGE);
        }
      } catch (error) {
        console.error("Error loading app update config:", error);
        setStatus({ type: "error", text: "Failed to load settings" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const response = await axios.put(
        `${backend_URL}/admin/app-update-config`,
        {
          enabled,
          latestVersion: latestVersion.trim(),
          downloadUrl: downloadUrl.trim(),
          message: message.trim() || DEFAULT_MESSAGE,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        const c = response.data.config;
        setEnabled(Boolean(c.enabled));
        setLatestVersion(c.latestVersion || latestVersion);
        setDownloadUrl(c.downloadUrl || "");
        setMessage(c.message || DEFAULT_MESSAGE);
        setStatus({
          type: "success",
          text: "Update notification saved. Users on older app versions will see the popup on Home Screen.",
        });
      } else {
        setStatus({ type: "error", text: response.data.message || "Failed to save" });
      }
    } catch (error) {
      console.error("Error saving app update config:", error);
      setStatus({
        type: "error",
        text: error.response?.data?.message || error.message || "Failed to save",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 animate-fadeIn">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] mb-2">
              App Update Notification
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base font-medium">
              Push an in-app update popup to users whose version is below the latest version.
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-700/80 hover:bg-gray-600/80 text-white text-sm rounded-xl font-semibold transition-all w-full sm:w-auto"
          >
            ← Back to Dashboard
          </Link>
        </header>

        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 animate-slideUp">
          {loading ? (
            <div className="flex justify-center py-12">
              <svg
                className="animate-spin h-10 w-10 text-emerald-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-500 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-gray-200 font-semibold">Enable update notification for all users</span>
              </label>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Latest app version</label>
                <input
                  type="text"
                  value={latestVersion}
                  onChange={(e) => setLatestVersion(e.target.value)}
                  placeholder="e.g. 1.7.0"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-gray-500 text-xs mt-2">
                  Users with a lower version see the popup on Home Screen only.
                </p>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Download / update link</label>
                <input
                  type="url"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://example.com/download"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Popup message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                />
              </div>

              {status && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    status.type === "success"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {status.text}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-60 transition-all"
              >
                {saving ? "Saving..." : "Save & notify users"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default AppVersionUpdate;
