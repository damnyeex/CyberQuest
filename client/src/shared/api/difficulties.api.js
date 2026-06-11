import { $host } from "./client";

export const difficultiesApi = {
    /** Получить все уровни сложности */
    getAll: () => $host.get("/difficulties"),
};
