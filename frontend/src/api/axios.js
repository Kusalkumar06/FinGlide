import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

let inMemoryCsrfToken = null;

export const setCsrfToken = (token) => {
  inMemoryCsrfToken = token || null;
};

export const getCsrfToken = () => {
  return inMemoryCsrfToken;
};

export const clearCsrfToken = () => {
  inMemoryCsrfToken = null;
};

const MUTATING_METHODS = new Set(["post", "put", "patch", "delete"]);

// Request interceptor: attach x-csrf-token only to mutating requests
api.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();
    if (MUTATING_METHODS.has(method) && inMemoryCsrfToken) {
      config.headers = config.headers || {};
      config.headers["x-csrf-token"] = inMemoryCsrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Centralized clearing on successful logout
    if (response.config?.url?.includes("/auth/logout")) {
      clearCsrfToken();
    } else if (response?.data?.csrfToken) {
      // Capture and update CSRF token whenever returned in response JSON
      setCsrfToken(response.data.csrfToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh on auth endpoints to prevent loops
    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/logout");

    // Clear CSRF token on terminal auth failures or revoked sessions
    if (
      error.response?.status === 401 &&
      (isAuthRequest ||
        error.response?.data?.code === "SESSION_REVOKED" ||
        error.response?.data?.code === "SESSION_EXPIRED" ||
        error.response?.data?.code === "SESSION_ABSOLUTE_TIMEOUT" ||
        error.response?.data?.code === "TOKEN_REUSE_DETECTED")
    ) {
      clearCsrfToken();
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newCsrf) => {
            // Update queued request with the new CSRF token if mutating
            if (newCsrf && MUTATING_METHODS.has(originalRequest.method?.toLowerCase())) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers["x-csrf-token"] = newCsrf;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await api.post("/auth/refresh", {});
        const newCsrfToken = refreshRes.data?.csrfToken || inMemoryCsrfToken;
        if (newCsrfToken) {
          setCsrfToken(newCsrfToken);
        }
        processQueue(null, newCsrfToken);

        // Update original request with new token before retry
        if (newCsrfToken && MUTATING_METHODS.has(originalRequest.method?.toLowerCase())) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["x-csrf-token"] = newCsrfToken;
        }

        return api(originalRequest);
      } catch (refreshError) {
        clearCsrfToken();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
