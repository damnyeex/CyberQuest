"use client";
import { useParams } from "next/navigation";
import CourseIntroPage from "@/pages/CourseIntroPage/CourseIntroPage";
import ProtectedRoute from "@/shared/lib/ProtectedRoute/ProtectedRoute";

export default function Page() {
    const { id } = useParams();

    return (
        <ProtectedRoute>
            <CourseIntroPage courseId={id} />
        </ProtectedRoute>
    );
}
