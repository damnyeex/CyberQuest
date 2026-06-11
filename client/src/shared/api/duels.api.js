import { $authHost } from "./client";

export const duelsApi = {
    /** Создать дуэль */
    create: (opponentId, taskSlug) =>
        $authHost.post("/duels", {
            opponent_id: opponentId,
            task_slug: taskSlug,
        }),
};
