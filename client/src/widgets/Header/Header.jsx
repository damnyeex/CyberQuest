import React from "react";
import styles from "./Header.module.scss";
import Button from "../../shared/UI/Button/Button";
import {
    FaShieldAlt,
    FaHome,
    FaBook,
    FaTachometerAlt,
    FaFlag,
    FaTrophy, // заменяем FaRankingStar
    FaUsers,
    FaUser,
    FaBars,
} from "react-icons/fa";

const Header = ({ setCurrentPage, onLoginClick, currentPage }) => {
    const navItems = [
        { id: "home", label: "Главная", icon: FaHome },
        { id: "courses", label: "Курсы", icon: FaBook },
        { id: "dashboard", label: "Дашборд", icon: FaTachometerAlt },
        { id: "ctf", label: "CTF", icon: FaFlag },
        { id: "rating", label: "Рейтинг", icon: FaTrophy }, // изменено
        { id: "community", label: "Сообщество", icon: FaUsers },
    ];

    return (
        <header className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <a
                    href="/"
                    className={styles.logo}
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage("home");
                    }}
                >
                    <FaShieldAlt />
                    <span>CyberQuest</span>
                </a>
                <nav className={styles.navLinks}>
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={
                                currentPage === item.id ? styles.active : ""
                            }
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(item.id);
                            }}
                        >
                            <item.icon /> {item.label}
                        </a>
                    ))}
                </nav>
                <div className={styles.userMenu}>
                    <Button variant="secondary">
                        <FaUser /> Профиль
                    </Button>
                    <Button variant="primary" onClick={onLoginClick}>
                        Вход
                    </Button>
                    <button className={styles.mobileMenuBtn}>
                        <FaBars />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
