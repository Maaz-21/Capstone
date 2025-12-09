import axios from 'axios';

// Use Vite's import.meta.env for environment variables in the browser.
const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // Important: Send cookies (refresh token) with requests
});

// Token Management
let currentAccessToken = null;
let onTokenRefreshed = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const setAccessToken = (token) => {
    currentAccessToken = token;
};

export const setOnTokenRefreshed = (callback) => {
    onTokenRefreshed = callback;
};

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        if (currentAccessToken) {
            config.headers['Authorization'] = `Bearer ${currentAccessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip refresh logic for auth endpoints to avoid loops
        if (originalRequest.url.includes('/login') || originalRequest.url.includes('/register') || originalRequest.url.includes('/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh
                const res = await axiosInstance.post('/users/refresh');
                const { accessToken, user } = res.data;

                setAccessToken(accessToken);
                
                if (onTokenRefreshed) {
                    onTokenRefreshed(accessToken, user);
                }

                // Process queued requests
                processQueue(null, accessToken);
                
                // Retry original
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                setAccessToken(null);
                // Optionally redirect to login here or let the app handle the 401
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
