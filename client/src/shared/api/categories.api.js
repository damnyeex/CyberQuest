import { $host } from "./client";

export const categoriesApi = {
    /** Получить все категории */
    getAll: () => $host.get("/categories"),
};
