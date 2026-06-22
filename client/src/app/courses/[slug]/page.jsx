"use client";
import { useParams } from "next/navigation";
import CourseDetailPage from "@/pages/CourseDetailPage/CourseDetailPage";
import ProtectedRoute from "@/shared/lib/ProtectedRoute/ProtectedRoute";

export default function Page() {
    const { slug } = useParams();

    return (
        <ProtectedRoute>
            <CourseDetailPage courseSlug={slug} />
        </ProtectedRoute>
    );
}
