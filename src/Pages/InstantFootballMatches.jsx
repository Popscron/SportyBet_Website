import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_URL } from "../config/config";
import { toast } from "react-toastify";

const InstantFootballMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    home: "",
    away: "",
    homeOdd: "2.00",
    drawOdd: "3.00",
    awayOdd: "3.50",
    markets: "+69",
    league: "England",
    homeBadgeUrl: "",
    awayBadgeUrl: "",
    homeBadgeFile: null,
    awayBadgeFile: null,
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend_URL}/instant-football/matches`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setMatches(res.data.data);
      } else {
        setMatches([]);
      }
    } catch (err) {
      console.error("Error fetching instant football matches", err);
      toast.error("Failed to load matches");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files && files[0] ? files[0] : null;
    setForm((prev) => ({ ...prev, [name]: file }));
  };

  const resetForm = () => {
    setForm({
      home: "",
      away: "",
      homeOdd: "2.00",
      drawOdd: "3.00",
      awayOdd: "3.50",
      markets: "+69",
      league: "England",
      homeBadgeUrl: "",
      awayBadgeUrl: "",
      homeBadgeFile: null,
      awayBadgeFile: null,
    });
  };

  const addMatch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Use multipart/form-data so admin can upload badge images
      const formData = new FormData();
      formData.append("home", form.home.trim());
      formData.append("away", form.away.trim());
      formData.append("homeOdd", form.homeOdd || "2.00");
      formData.append("drawOdd", form.drawOdd || "3.00");
      formData.append("awayOdd", form.awayOdd || "3.50");
      formData.append("markets", form.markets || "+69");
      formData.append("league", form.league || "England");

      // Optional: if admin picked local image files, send them; otherwise fall back to URL text
      if (form.homeBadgeFile) {
        formData.append("leftLogo", form.homeBadgeFile);
      } else if (form.homeBadgeUrl?.trim()) {
        formData.append("homeBadgeUrl", form.homeBadgeUrl.trim());
      }

      if (form.awayBadgeFile) {
        formData.append("rightLogo", form.awayBadgeFile);
      } else if (form.awayBadgeUrl?.trim()) {
        formData.append("awayBadgeUrl", form.awayBadgeUrl.trim());
      }

      await axios.post(`${backend_URL}/instant-football/matches`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Match added successfully");
      fetchMatches();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error adding match", err);
      toast.error(err.response?.data?.error || "Failed to add match");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMatch = async (id) => {
    if (!window.confirm("Delete this match? It will be removed from the app.")) return;
    try {
      await axios.delete(`${backend_URL}/instant-football/matches/${id}`);
      toast.success("Match deleted");
      fetchMatches();
    } catch (err) {
      console.error("Error deleting match", err);
      toast.error(err.response?.data?.error || "Failed to delete match");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-1">
              Instant Football Matches
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage matches shown in the Instant Football screen in the app. Add or delete matches.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
            onClick={() => setShowForm(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Match
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-gray-800/50 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            {matches.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <p className="text-lg">No matches yet. Add matches to show them in the Instant Football app screen.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-gray-800/80">
                      <th className="px-4 py-3 text-gray-300 font-semibold">#</th>
                      <th className="px-4 py-3 text-gray-300 font-semibold">Home</th>
                      <th className="px-4 py-3 text-gray-300 font-semibold">Away</th>
                      <th className="px-4 py-3 text-gray-300 font-semibold">1</th>
                      <th className="px-4 py-3 text-gray-300 font-semibold">X</th>
                      <th className="px-4 py-3 text-gray-300 font-semibold">2</th>
                      <th className="px-4 py-3 text-gray-300 font-semibold">Markets</th>
                      <th className="px-4 py-3 text-gray-300 font-semibold">League</th>
                      <th className="px-4 py-3 text-gray-300 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m, i) => (
                      <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 text-white font-medium">{m.home}</td>
                        <td className="px-4 py-3 text-white font-medium">{m.away}</td>
                        <td className="px-4 py-3 text-green-400">{m.homeOdd}</td>
                        <td className="px-4 py-3 text-gray-300">{m.drawOdd}</td>
                        <td className="px-4 py-3 text-green-400">{m.awayOdd}</td>
                        <td className="px-4 py-3 text-gray-400">{m.markets}</td>
                        <td className="px-4 py-3 text-gray-400">{m.league}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium text-sm transition-colors"
                            onClick={() => deleteMatch(m.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Match Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Add Instant Football Match</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={addMatch} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Home team (e.g. MUN)</label>
                  <input
                    type="text"
                    name="home"
                    value={form.home}
                    onChange={handleInputChange}
                    placeholder="MUN"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Away team (e.g. LIV)</label>
                  <input
                    type="text"
                    name="away"
                    value={form.away}
                    onChange={handleInputChange}
                    placeholder="LIV"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">1</label>
                    <input
                      type="text"
                      name="homeOdd"
                      value={form.homeOdd}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-white/10 text-white focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">X</label>
                    <input
                      type="text"
                      name="drawOdd"
                      value={form.drawOdd}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-white/10 text-white focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">2</label>
                    <input
                      type="text"
                      name="awayOdd"
                      value={form.awayOdd}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-white/10 text-white focus:border-green-500 outline-none"
                    />
                  </div>
                </div>
                {/* Badge upload / URL inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Home badge (upload or URL)
                    </label>
                    <input
                      type="file"
                      name="homeBadgeFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-green-600 file:text-white file:text-sm hover:file:bg-green-700"
                    />
                    <input
                      type="text"
                      name="homeBadgeUrl"
                      value={form.homeBadgeUrl}
                      onChange={handleInputChange}
                      placeholder="or paste image URL"
                      className="mt-2 w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Away badge (upload or URL)
                    </label>
                    <input
                      type="file"
                      name="awayBadgeFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-green-600 file:text-white file:text-sm hover:file:bg-green-700"
                    />
                    <input
                      type="text"
                      name="awayBadgeUrl"
                      value={form.awayBadgeUrl}
                      onChange={handleInputChange}
                      placeholder="or paste image URL"
                      className="mt-2 w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Markets</label>
                  <input
                    type="text"
                    name="markets"
                    value={form.markets}
                    onChange={handleInputChange}
                    placeholder="+69"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">League</label>
                  <select
                    name="league"
                    value={form.league}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white focus:border-green-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="England">England</option>
                    <option value="Spain">Spain</option>
                    <option value="Germany">Germany</option>
                    <option value="Champions">Champions</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
                    onClick={() => { setShowForm(false); resetForm(); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
                  >
                    {submitting ? "Adding…" : "Add Match"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantFootballMatches;
