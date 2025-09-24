// Auth service for login/register and token handling
import axios from 'axios';
import { getAccessToken, getRefreshToken, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/auth';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Axios instance
const http = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
});

function setTokens({ access, refresh }) {
    if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

function clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function isAuthenticated() {
    return Boolean(getAccessToken());
}

function clearAuthState() {
    clearTokens();
    try {
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('user');
    } catch {
        // ignore
    }
}

// Attach Authorization header
http.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Simple 401 refresh flow (single retry)
let isRefreshing = false;
let pendingRequests = [];

async function refreshAccessToken() {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            pendingRequests.push({ resolve, reject });
        });
    }

    isRefreshing = true;
    try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error('No refresh token');
        const { data } = await http.post('/auth/refresh/', { refresh });
        setTokens({ access: data.access, refresh });
        pendingRequests.forEach((p) => p.resolve(data.access));
        pendingRequests = [];
        return data.access;
    } catch (err) {
        clearTokens();
        pendingRequests.forEach((p) => p.reject(err));
        pendingRequests = [];
        throw err;
    } finally {
        isRefreshing = false;
    }
}

http.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        // Avoid infinite loop
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const newAccess = await refreshAccessToken();
                original.headers = original.headers || {};
                original.headers.Authorization = `Bearer ${newAccess}`;
                return http(original);
            // eslint-disable-next-line no-unused-vars
            } catch (_) {
                // Redirect responsibility left to caller/UI
            }
        }
        return Promise.reject(error);
    }
);

// API calls
async function login({ email, password }) {
    const { data } = await http.post('/auth/login/', { email, password });
    // Backend returns { tokens: { access, refresh }, user }
    const access = data?.tokens?.access;
    const refresh = data?.tokens?.refresh;
    if (access && refresh) setTokens({ access, refresh });
    return data;
}

async function register(payload) {
    // Expected payload: { username, email, password, password_confirm, first_name?, last_name?, role? }
    const { data } = await http.post('/auth/register/', payload);
    const access = data?.tokens?.access;
    const refresh = data?.tokens?.refresh;
    if (access && refresh) setTokens({ access, refresh });
    return data;
}

async function logout() {
    const refresh = getRefreshToken();
    if (!refresh) {
        clearAuthState();
        return;
    }
    try {
        await http.post('/auth/logout/', { refresh });
    } catch {
        // ignore server errors on logout; proceed to clear tokens
    } finally {
        clearAuthState();
    }
}

async function getMe() {
    const { data } = await http.get('/auth/me/');
    return data;
}

export const authService = {
    login,
    register,
    logout,
    getMe,
    isAuthenticated,
    getAccessToken,
    setTokens,
    clearTokens,
    clearAuthState,
    client: http,
    API_BASE_URL,
};

export default authService;


