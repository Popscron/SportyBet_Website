import axios from "axios";

const ADMIN_TOKEN_KEY = "sportybetAdminToken";

// Add Authorization header for admin API calls so they work when cookies aren't sent (e.g. cross-origin)
axios.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") return config;
    const url = config.url || "";
    const baseURL = config.baseURL || "";
    const fullUrl = url.startsWith("http") ? url : (baseURL + url);
    if (fullUrl.includes("/admin/")) {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export { ADMIN_TOKEN_KEY };
