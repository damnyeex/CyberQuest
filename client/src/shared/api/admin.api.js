import { $authHost } from "./client";

export const adminApi = {
    /** Список пользователей */
    getUsers: (page = 1) => $authHost.get("/admin/users", { params: { page } }),

    /** Обновить пользователя */
    updateUser: (userId, data) => $authHost.put(`/admin/users/${userId}`, data),

    /** Изменить XP пользователя */
    adjustXp: (userId, delta) =>
        $authHost.put(`/admin/users/${userId}/xp`, { delta }),

    /** Удалить задачу */
    deleteChallenge: (challengeId) =>
        $authHost.delete(`/admin/challenges/${challengeId}`),

    /** Получить логи */
    getLogs: () => $authHost.get("/admin/logs"),

    /** Запустить бэкап */
    backup: () => $authHost.post("/admin/backup"),

    /** Обновить политики безопасности */
    updateSecurityPolicies: () => $authHost.put("/admin/security/policies"),
};
