"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import LoginModal from "@/features/Auth/LoginModal/LoginModal";
import ProfileModal from "@/features/Profile/ProfileModal/ProfileModal";
import Notification from "@/features/Notification/Notification";
import { userApi } from "@/shared/api/index";

const AppContext = createContext(null);

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
}

export default function AppProvider({ children }) {
    const searchParams = useSearchParams();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const showNotification = useCallback((message, type = "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            userApi
                .getMe()
                .then((res) => setUser(res.data))
                .catch(() => {
                    Cookies.remove("token");
                    setUser(null);
                })
                .finally(() => setIsAuthLoading(false));
        } else {
            setIsAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        if (searchParams.get("login") === "true") {
            setLoginModalOpen(true);
        }
    }, [searchParams]);

    const login = useCallback(
        (token, userData) => {
            Cookies.set("token", token, { expires: 7 });
            setUser(userData);
            setLoginModalOpen(false);
            showNotification("Вход выполнен успешно!", "success");
        },
        [showNotification],
    );

    const logout = useCallback(() => {
        Cookies.remove("token");
        setUser(null);
        setProfileModalOpen(false);
        showNotification("Вы вышли из аккаунта", "info");
    }, [showNotification]);

    const value = {
        user,
        isAuthLoading,
        login,
        logout,
        showNotification,
        openLoginModal: () => setLoginModalOpen(true),
        closeLoginModal: () => setLoginModalOpen(false),
        openProfileModal: () => setProfileModalOpen(true),
        closeProfileModal: () => setProfileModalOpen(false),
        isAuthenticated: !!user,
        isAdmin: user?.roles?.includes("admin") || false,
    };

    return (
        <AppContext.Provider value={value}>
            {children}

            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onLogin={login}
                showNotification={showNotification}
            />

            <ProfileModal
                isOpen={profileModalOpen}
                onClose={() => setProfileModalOpen(false)}
            />

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </AppContext.Provider>
    );
}
