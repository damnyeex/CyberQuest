import { $authHost } from "./client";

export const forumApi = {
    /** Создать тему */
    createTopic: (title, content) =>
        $authHost.post("/forum/topics", { title, content }),

    /** Добавить пост в тему */
    addPost: (slug, content) =>
        $authHost.post(`/forum/topics/${slug}/posts`, { content }),
};
