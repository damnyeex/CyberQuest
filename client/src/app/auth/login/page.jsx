"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/AppProvider";

export default function LoginPage() {
    const router = useRouter();
    const { openLoginModal } = useApp();

    useEffect(() => {
        openLoginModal();
        router.push("/");
    }, []);

    return null;
}
