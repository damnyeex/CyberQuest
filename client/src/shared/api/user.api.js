import { $authHost } from "./client";

export const userApi = {
    /** Получить профиль текущего пользователя */
    getMe: () => $authHost.get("/me"),

    /** Обновить профиль */
    updateProfile: (data) => $authHost.put("/me", data),

    /** Сменить пароль */
    changePassword: (oldPassword, newPassword) =>
        $authHost.put("/me/change-password", {
            old_password: oldPassword,
            new_password: newPassword,
        }),
};
