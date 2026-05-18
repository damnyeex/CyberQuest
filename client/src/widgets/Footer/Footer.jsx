import React from "react";
import styles from "./Footer.module.scss";
import { FaDiscord, FaTelegram, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerContent}>
                    <div className={styles.footerColumn}>
                        <h3>CyberQuest</h3>
                        <p>
                            Платформа для обучения и практики в области
                            кибербезопасности через CTF-задачи.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#">
                                <FaDiscord />
                            </a>
                            <a href="#">
                                <FaTelegram />
                            </a>
                            <a href="#">
                                <FaGithub />
                            </a>
                            <a href="#">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>
                    <div className={styles.footerColumn}>
                        <h3>Обучение</h3>
                        <ul>
                            <li>
                                <a href="#">Курсы</a>
                            </li>
                            <li>
                                <a href="#">CTF-задачи</a>
                            </li>
                            <li>
                                <a href="#">Лаборатории</a>
                            </li>
                            <li>
                                <a href="#">Дорожные карты</a>
                            </li>
                            <li>
                                <a href="#">Сертификация</a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.footerColumn}>
                        <h3>Сообщество</h3>
                        <ul>
                            <li>
                                <a href="#">Форум</a>
                            </li>
                            <li>
                                <a href="#">Команды</a>
                            </li>
                            <li>
                                <a href="#">Соревнования</a>
                            </li>
                            <li>
                                <a href="#">Блог</a>
                            </li>
                            <li>
                                <a href="#">Партнеры</a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.footerColumn}>
                        <h3>Компания</h3>
                        <ul>
                            <li>
                                <a href="#">О нас</a>
                            </li>
                            <li>
                                <a href="#">Для бизнеса</a>
                            </li>
                            <li>
                                <a href="#">Для вузов</a>
                            </li>
                            <li>
                                <a href="#">Контакты</a>
                            </li>
                            <li>
                                <a href="#">Политика конфиденциальности</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles.copyright}>
                    <p>
                        &copy; 2025 CyberQuest. Все права защищены. Данная
                        платформа предназначена исключительно для
                        образовательных целей и обучения этичному хакингу.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
