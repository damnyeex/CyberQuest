"use client";
import CTFPage from "@/pages/CTFPage/CTFPage";
import { useApp } from "@/providers/AppProvider";

export default function Page() {
    const { showNotification } = useApp();
    return <CTFPage showNotification={showNotification} />;
}
