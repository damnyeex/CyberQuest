import { $host, $authHost } from "./client";

export const authApi = {
    /** Регистрация нового пользователя */
    register: (data) => $host.post("/auth/register", data),

    /** Вход по email/password */
    login: (data) => $host.post("/auth/login", data),

    /** Вход через Google */
    googleLogin: (token) => $host.post("/auth/google", { token }),

    /** Вход через Telegram */
    telegramLogin: (telegramData) =>
        $host.post("/auth/telegram", { telegram_data: telegramData }),

    /** Запросить сброс пароля */
    forgotPassword: (email) => $host.post("/auth/forgot-password", { email }),

    /** Сбросить пароль по токену */
    resetPassword: (token, password) =>
        $host.post("/auth/reset-password", { token, password }),
};
