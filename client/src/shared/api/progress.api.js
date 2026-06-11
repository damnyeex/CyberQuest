import { $host, $authHost } from "./client";

export const progressApi = {
    /** Получить прогресс пользователя по ID */
    getByUserId: (userId) => $host.get(`/users/${userId}/progress`),
};
