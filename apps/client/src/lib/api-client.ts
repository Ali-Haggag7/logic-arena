import axios from "axios";

const isDev = process.env.NODE_ENV === "development";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
    || (isDev ? "http://localhost:3001/api" : "https://logicarena.dev/api");

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);