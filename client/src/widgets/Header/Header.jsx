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
} from "react-icons/fa";

export default function Header() {
    const pathname = usePathname();
    const { openLoginModal } = useApp();

    const navItems = [
        { href: "/", label: "Главная", icon: FaHome },
        { href: "/courses", label: "Курсы", icon: FaBook },
        { href: "/dashboard", label: "Дашборд", icon: FaTachometerAlt },
        { href: "/ctf", label: "CTF", icon: FaFlag },
        { href: "#", label: "Рейтинг", icon: FaTrophy },
        { href: "#", label: "Сообщество", icon: FaUsers },
    ];

    const isActive = (href) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    <FaShieldAlt />
                    <span>CyberQuest</span>
                </Link>

                <nav className={styles.navLinks}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={isActive(item.href) ? styles.active : ""}
                        >
                            <item.icon /> {item.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.userMenu}>
                    <Button variant="secondary">
                        <FaUser /> Профиль
                    </Button>
                    <Button variant="primary" onClick={openLoginModal}>
                        Вход
                    </Button>
                    <button className={styles.mobileMenuBtn}>
                        <FaBars />
                    </button>
                </div>
            </div>
        </header>
    );
}
