"use client";

import { createContext, useContext, useState, useCallback } from "react";
import LoginModal from "@/features/Auth/LoginModal/LoginModal";
import Notification from "@/features/Notification/Notification";

const AppContext = createContext(null);

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
}

export default function AppProvider({ children }) {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    }, []);

    return (
        <AppContext.Provider
            value={{
                showNotification,
                openLoginModal: () => setLoginModalOpen(true),
                closeLoginModal: () => setLoginModalOpen(false),
            }}
        >
            {children}

            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                showNotification={showNotification}
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
