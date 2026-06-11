"use client";
import CTFPage from "@/pages/CTFPage/CTFPage";
import { useApp } from "@/providers/AppProvider";
import ProtectedRoute from "@/shared/lib/ProtectedRoute/ProtectedRoute";

export default function Page() {
    const { showNotification } = useApp();
    return (
        <ProtectedRoute>
            <CTFPage showNotification={showNotification} />
        </ProtectedRoute>
    );
}
