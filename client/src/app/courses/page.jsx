"use client";
import CoursesPage from "@/pages/CoursesPage/CoursesPage";
import ProtectedRoute from "@/shared/lib/ProtectedRoute/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <CoursesPage />
        </ProtectedRoute>
    );
}
