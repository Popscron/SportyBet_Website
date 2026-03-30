import axios from "axios";

const ADMIN_TOKEN_KEY = "sportybetAdminToken";

/** Paths that require adminAuth on the API (cookie or Bearer), e.g. /api/admin/load-sms-points */
function urlNeedsAdminBearer(fullUrl) {
  if (!fullUrl) return false;
  // Matches .../admin/... and .../admin (end or query)
  return /\/admin(\/|$|\?)/.test(fullUrl);
}

// Add Authorization for protected /api/admin/* routes when the httpOnly cookie is not sent
// (e.g. website on admingh.online → API on api.admingh.online unless cookie Domain=.admingh.online).
axios.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") return config;
    const url = config.url || "";
    const baseURL = config.baseURL || "";
    const fullUrl = url.startsWith("http") ? url : baseURL + url;
    if (!urlNeedsAdminBearer(fullUrl)) return config;

    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return config;

    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export { ADMIN_TOKEN_KEY };
