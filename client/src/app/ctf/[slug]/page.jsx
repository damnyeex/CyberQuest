"use client";
import ProtectedRoute from "@/shared/lib/ProtectedRoute/ProtectedRoute";
import CTFDetailPage from "@/pages/CTFDetailPage/CTFDetailPage";

export default function Page({ params }) {
    return (
        <ProtectedRoute>
            <CTFDetailPage slug={params.slug} />
        </ProtectedRoute>
    );
}
