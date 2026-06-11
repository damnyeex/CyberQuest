"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/providers/AppProvider";

/**
 * Компонент-обёртка для защиты роутов.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children — содержимое страницы
 * @param {string} [props.requiredRole] — роль, необходимая для доступа ('admin', 'teacher')
 * @param {string} [props.redirectTo] — куда редиректить, если нет доступа (по умолчанию "/?login=true")
 */
const ProtectedRoute = ({
    children,
    requiredRole = null,
    redirectTo = "/?login=true",
}) => {
    const { isAuthenticated, isAuthLoading, user } = useApp();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Ждём окончания проверки токена
        if (isAuthLoading) return;

        // Не авторизован → редирект на логин
        if (!isAuthenticated) {
            router.push(redirectTo);
            return;
        }

        // Проверка роли
        if (requiredRole && user) {
            const hasRole = user.roles?.includes(requiredRole);
            if (!hasRole) {
                router.push("/"); // или страница 403
            }
        }
    }, [
        isAuthenticated,
        isAuthLoading,
        user,
        requiredRole,
        redirectTo,
        router,
    ]);

    // Пока идёт загрузка — ничего не показываем (или спиннер)
    if (isAuthLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "60vh",
                }}
            >
                <p style={{ color: "var(--text-secondary)" }}>Загрузка...</p>
            </div>
        );
    }

    // Не авторизован — не рендерим страницу
    if (!isAuthenticated) {
        return null;
    }

    // Проверка роли
    if (requiredRole && user && !user.roles?.includes(requiredRole)) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
