import { $authHost } from "./client";

export const subscriptionApi = {
    /** Получить текущую подписку */
    get: () => $authHost.get("/me/subscription"),

    /** Купить подписку */
    buy: (plan = "monthly") => $authHost.post("/me/subscription/buy", { plan }),
};
