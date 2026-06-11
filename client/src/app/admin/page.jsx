"use client";

import AdminComp from "@/features/Admin/AdminComp/AdminComp";
import ProtectedRoute from "@/shared/lib/ProtectedRoute/ProtectedRoute";

export default function AdminPage() {
    return (
        <ProtectedRoute>
            <AdminComp />
        </ProtectedRoute>
    );
}
