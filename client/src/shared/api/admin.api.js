import { $authHost } from "./client";

export const adminApi = {
    /** Список пользователей (пагинация) */
    getUsers: (page = 1) => $authHost.get("/admin/users", { params: { page } }),

    /** Обновить пользователя (роли, активность, верификация, мягкое удаление) */
    updateUser: (userId, data) => $authHost.put(`/admin/users/${userId}`, data),

    /** Изменить XP пользователя */
    adjustXp: (userId, delta) =>
        $authHost.put(`/admin/users/${userId}/xp`, { delta }),

    /** Восстановить пользователя (снять deleted_at) */
    restoreUser: (userId) =>
        $authHost.put(`/admin/users/${userId}`, { restore: true }),

    /** Получить прогресс конкретного пользователя */
    getUserProgress: (userId) => $authHost.get(`/users/${userId}/progress`),

    /** Создать задачу */
    createChallenge: (data) => $authHost.post("/admin/challenges", data),

    /** Обновить задачу (все поля) */
    updateChallenge: (challengeId, data) =>
        $authHost.put(`/admin/challenges/${challengeId}`, data),

    /** Удалить задачу */
    deleteChallenge: (challengeId) =>
        $authHost.delete(`/admin/challenges/${challengeId}`),

    /** Получить все задачи (включая черновики) */
    getAllChallenges: (params = {}) =>
        $authHost.get("/challenges", { params: { status: "all", ...params } }),

    /** Создать категорию */
    createCategory: (data) => $authHost.post("/admin/categories", data),

    /** Обновить категорию */
    updateCategory: (categoryId, data) =>
        $authHost.put(`/admin/categories/${categoryId}`, data),

    /** Удалить категорию */
    deleteCategory: (categoryId) =>
        $authHost.delete(`/admin/categories/${categoryId}`),

    /** Получить все категории */
    getAllCategories: () => $authHost.get("/categories"),

    /** Создать уровень сложности */
    createDifficulty: (data) => $authHost.post("/admin/difficulties", data),

    /** Обновить уровень сложности */
    updateDifficulty: (diffId, data) =>
        $authHost.put(`/admin/difficulties/${diffId}`, data),

    /** Удалить уровень сложности */
    deleteDifficulty: (diffId) =>
        $authHost.delete(`/admin/difficulties/${diffId}`),

    /** Получить все уровни сложности */
    getAllDifficulties: () => $authHost.get("/difficulties"),

    /** Создать тег */
    createTag: (data) => $authHost.post("/admin/tags", data),

    /** Обновить тег */
    updateTag: (tagId, data) => $authHost.put(`/admin/tags/${tagId}`, data),

    /** Удалить тег */
    deleteTag: (tagId) => $authHost.delete(`/admin/tags/${tagId}`),

    /** Получить все теги */
    getAllTags: () => $authHost.get("/tags"),

    /** Массовый импорт данных (пользователи, задачи) */
    importData: (formData) =>
        $authHost.post("/admin/import", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    /** Экспорт данных (возвращает файл) */
    exportData: (params) =>
        $authHost.get("/admin/export", { params, responseType: "blob" }),

    /** Управление тарифами (заглушка) */
    updateTariffs: (data) => $authHost.put("/admin/tariffs", data),

    /** Логи */
    getLogs: () => $authHost.get("/admin/logs"),

    /** Бэкап */
    backup: () => $authHost.post("/admin/backup"),

    /** Политики безопасности */
    updateSecurityPolicies: () => $authHost.put("/admin/security/policies"),
};
