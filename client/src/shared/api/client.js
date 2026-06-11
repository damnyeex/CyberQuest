import axios from "axios";
import Cookies from "js-cookie";

// Публичный клиент (без авторизации)
export const $host = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Приватный клиент (с JWT)
export const $authHost = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Перехватчик для добавления токена
$authHost.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Перехватчик ответа для обработки ошибок
$authHost.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove("token");
            if (typeof window !== "undefined") {
                window.location.href = "/?login=true";
            }
        }
        return Promise.reject(error);
    },
);
