import { $authHost } from "./client";

export const teamsApi = {
    /** Создать команду */
    create: (name) => $authHost.post("/teams", { name }),

    /** Присоединиться к команде */
    join: (teamId) => $authHost.post(`/teams/join/${teamId}`),
};
