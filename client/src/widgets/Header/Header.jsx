"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as styles from "./Header.module.scss";
import Button from "@/shared/UI/Button/Button";
import { useApp } from "@/providers/AppProvider";
import {
    FaShieldAlt,
    FaHome,
    FaBook,
    FaTachometerAlt,
    FaFlag,
    FaTrophy,
    FaUsers,
    FaUser,
    FaBars,
    FaSignOutAlt,
    FaUserShield,
} from "react-icons/fa";

export default function Header() {
    const pathname = usePathname();
    const {
        isAuthenticated,
        isAdmin,
        user,
        openLoginModal,
        openProfileModal,
        logout,
    } = useApp();

    const navItems = [
        { href: "/", label: "Главная", icon: FaHome, id: "home" },
        { href: "/courses", label: "Курсы", icon: FaBook, id: "courses" },
        {
            href: "/dashboard",
            label: "Дашборд",
            icon: FaTachometerAlt,
            id: "dashboard",
        },
        { href: "/ctf", label: "CTF", icon: FaFlag, id: "ctf" },
        { href: "#", label: "Рейтинг", icon: FaTrophy, id: "rating" },
        { href: "#", label: "Сообщество", icon: FaUsers, id: "community" },
    ];

    const isActive = (href) => {
        if (href === "/") return pathname === "/";
        if (href === "#") return false;
        return pathname.startsWith(href);
    };

    return (
        <header className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    <FaShieldAlt />
                    <span>CyberQuest</span>
                </Link>

                {/* Навигация — только для авторизованных */}
                {isAuthenticated && (
                    <nav className={styles.navLinks}>
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={
                                    isActive(item.href) ? styles.active : ""
                                }
                            >
                                <item.icon /> {item.label}
                            </Link>
                        ))}
                    </nav>
                )}

                <div className={styles.userMenu}>
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link href="/admin">
                                    <Button variant="secondary">
                                        <FaUserShield /> Панель
                                    </Button>
                                </Link>
                            )}

                            <Button
                                variant="secondary"
                                onClick={openProfileModal}
                            >
                                <FaUser /> {user?.nickname || "Профиль"}
                            </Button>

                            <button className={styles.mobileMenuBtn}>
                                <FaBars />
                            </button>

                            <Button variant="secondary" onClick={logout}>
                                <FaSignOutAlt /> Выход
                            </Button>
                        </>
                    ) : (
                        <Button variant="primary" onClick={openLoginModal}>
                            Вход
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
