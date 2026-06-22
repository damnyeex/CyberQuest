import { $host, $authHost } from "./client";

export const coursesApi = {
    /** Получить список всех курсов */
    getAll: () => $host.get("/courses"),

    /** Получить детали курса вместе с задачами */
    getBySlug: (slug) => $host.get(`/courses/${slug}`),

    /** Получить прогресс пользователя по курсу */
    getProgress: (slug) => $authHost.get(`/courses/${slug}/progress`),
};
