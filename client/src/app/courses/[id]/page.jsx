"use client";
import { useParams } from "next/navigation";
import CourseIntroPage from "@/pages/CourseIntroPage/CourseIntroPage";

export default function Page() {
    const { id } = useParams();
    return <CourseIntroPage courseId={id} />;
}
