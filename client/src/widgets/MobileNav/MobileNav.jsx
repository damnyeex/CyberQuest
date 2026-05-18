import React from "react";
import styles from "./MobileNav.module.scss";
import {
    FaHome,
    FaBook,
    FaTachometerAlt,
    FaFlag,
    FaUser,
} from "react-icons/fa";

const MobileNav = ({ setCurrentPage, currentPage }) => {
    const items = [
        { id: "home", icon: FaHome, label: "Главная" },
        { id: "courses", icon: FaBook, label: "Курсы" },
        { id: "dashboard", icon: FaTachometerAlt, label: "Дашборд" },
        { id: "ctf", icon: FaFlag, label: "CTF" },
        { id: "profile", icon: FaUser, label: "Профиль" },
    ];

    return (
        <div className={styles.mobileNav}>
            <div className={styles.mobileNavLinks}>
                {items.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`${styles.mobileNavLink} ${currentPage === item.id ? styles.active : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(item.id);
                        }}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default MobileNav;
