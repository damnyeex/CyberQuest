import { $host, $authHost } from "./client";

export const challengesApi = {
    /** Получить список задач с фильтрацией */
    getAll: (params = {}) => {
        const {
            page = 1,
            perPage = 10,
            category,
            difficulty,
            tag,
            status,
        } = params;
        return $host.get("/challenges", {
            params: {
                page,
                per_page: perPage,
                category,
                difficulty,
                tag,
                status,
            },
        });
    },

    /** Получить задачу по slug */
    getBySlug: (slug) => $host.get(`/challenges/${slug}`),

    /** Отправить флаг (решение задачи) */
    submitFlag: (slug, flag) =>
        $authHost.post(`/challenges/${slug}/solve`, { flag }),

    /** Получить список ID решённых задач текущего пользователя */
    getMySolvedIds: () => $authHost.get("/me/solves"),
};
