import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backend_URL } from "../config/config";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "01 Mar" -> "2025-03-01" (for date input)
function displayValueToDateInput(str) {
  if (!str || typeof str !== "string") return "";
  const parts = str.trim().split(/\s+/);
  if (parts.length < 2) return "";
  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const monthIndex = MONTHS.indexOf(monthName);
  if (isNaN(day) || day < 1 || day > 31 || monthIndex === -1) return "";
  const year = new Date().getFullYear();
  const month = String(monthIndex + 1).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  return `${year}-${month}-${dayStr}`;
}

// "2025-03-15" -> "15 Mar"
function dateInputToDisplayValue(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  if (isNaN(d.getTime())) return "";
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  return `${String(day).padStart(2, "0")} ${month}`;
}

const NextUpdateDate = () => {
  const [nextUpdateDate, setNextUpdateDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD for input type="date"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await axios.get(`${backend_URL}/next-update-date`);
        if (response.data.success && response.data.nextUpdateDate) {
          const value = response.data.nextUpdateDate;
          setNextUpdateDate(value);
          setSelectedDate(displayValueToDateInput(value) || "");
        }
      } catch (error) {
        console.error("Error fetching next update date:", error);
        setMessage({ type: "error", text: "Failed to load current date" });
      } finally {
        setLoading(false);
      }
    };
    fetchDate();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const value = dateInputToDisplayValue(selectedDate);
    if (!value) {
      setMessage({ type: "error", text: "Please select a date" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await axios.put(
        `${backend_URL}/admin/next-update-date`,
        { nextUpdateDate: value },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        setNextUpdateDate(response.data.nextUpdateDate);
        setSelectedDate(displayValueToDateInput(response.data.nextUpdateDate) || selectedDate);
        setMessage({ type: "success", text: "Next update date saved. It will appear in the app profile." });
      } else {
        setMessage({ type: "error", text: response.data.message || "Failed to save" });
      }
    } catch (error) {
      console.error("Error saving next update date:", error);
      setMessage({
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] mb-2">
              Next Update Date
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base font-medium">
              This date is shown in the app profile as &quot;Next update: ...&quot;
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
                className="animate-spin h-10 w-10 text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : (
            <>
              <p className="text-gray-300 mb-2">Current value in app:</p>
              <p className="text-2xl font-bold text-white mb-6">Next update: {nextUpdateDate}</p>

              <form onSubmit={handleSave} className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Select next update date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent [color-scheme:dark]"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </form>

              {message && (
                <p
                  className={`mt-4 text-sm font-medium ${message.type === "success" ? "text-green-400" : "text-red-400"}`}
                >
                  {message.text}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default NextUpdateDate;
