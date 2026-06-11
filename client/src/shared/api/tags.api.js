import { $host } from "./client";

export const tagsApi = {
    /** Получить все теги */
    getAll: () => $host.get("/tags"),
};
