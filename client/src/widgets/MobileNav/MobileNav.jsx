"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as styles from "./MobileNav.module.scss";
import {
    FaHome,
    FaBook,
    FaTachometerAlt,
    FaFlag,
    FaUser,
} from "react-icons/fa";

export default function MobileNav() {
    const pathname = usePathname();

    const items = [
        { href: "/", icon: FaHome, label: "Главная" },
        { href: "/courses", icon: FaBook, label: "Курсы" },
        { href: "/dashboard", icon: FaTachometerAlt, label: "Дашборд" },
        { href: "/ctf", icon: FaFlag, label: "CTF" },
        { href: "#", icon: FaUser, label: "Профиль" },
    ];

    return (
        <div className={styles.mobileNav}>
            <div className={styles.mobileNavLinks}>
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.mobileNavLink} ${pathname === item.href ? styles.active : ""}`}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
