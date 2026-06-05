import React from "react";
import * as styles from "./DashboardPage.module.scss";
import Button from "@/shared/UI/Button/Button";
import ProgressBar from "@/shared/UI/ProgressBar/ProgressBar";
import {
    FaFlag,
    FaFire,
    FaTrophy,
    FaMedal,
    FaCog,
    FaFlagCheckered,
    FaComment,
    FaUsers,
} from "react-icons/fa";

const DashboardPage = () => {
    return (
        <section className={styles.dashboard}>
            <div className="container">
                <div className={styles.dashboardHeader}>
                    <div>
                        <h2>Мой прогресс</h2>
                        <p>Обзор вашей активности и достижений</p>
                    </div>
                    <Button variant="secondary">
                        <FaCog /> Настройки
                    </Button>
                </div>

                <div className={styles.dashboardStats}>
                    <div className={`${styles.statCard} ${styles.stat1}`}>
                        <div className={styles.statIcon}>
                            <FaFlag />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>24</h3>
                            <p>Решенных CTF</p>
                        </div>
                    </div>
                    <div className={`${styles.statCard} ${styles.stat2}`}>
                        <div className={styles.statIcon}>
                            <FaFire />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>156</h3>
                            <p>Дней подряд</p>
                        </div>
                    </div>
                    <div className={`${styles.statCard} ${styles.stat3}`}>
                        <div className={styles.statIcon}>
                            <FaTrophy />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>#42</h3>
                            <p>В рейтинге</p>
                        </div>
                    </div>
                    <div className={`${styles.statCard} ${styles.stat4}`}>
                        <div className={styles.statIcon}>
                            <FaMedal />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>8</h3>
                            <p>Полученных бейджей</p>
                        </div>
                    </div>
                </div>

                <div className={styles.dashboardContent}>
                    <div className={styles.activeCourses}>
                        <div className={styles.sectionHeader}>
                            <h3>Активные курсы</h3>
                            <a href="#">Все курсы →</a>
                        </div>
                        <div className={styles.courseCard}>
                            <h3>Веб-уязвимости и эксплойты</h3>
                            <p>Урок 12: Межсайтовый скриптинг (XSS)</p>
                            <ProgressBar progress={70} />
                            <div className={styles.progressText}>
                                <span>Следующий урок через 2 дня</span>
                                <span>70%</span>
                            </div>
                            <Button variant="primary" fullWidth>
                                Продолжить обучение
                            </Button>
                        </div>
                        <div className={styles.courseCard}>
                            <h3>Введение в криптографию</h3>
                            <p>Урок 5: Симметричное шифрование</p>
                            <ProgressBar progress={45} />
                            <div className={styles.progressText}>
                                <span>Следующий урок завтра</span>
                                <span>45%</span>
                            </div>
                            <Button variant="primary" fullWidth>
                                Продолжить обучение
                            </Button>
                        </div>
                    </div>

                    <div className={styles.recentActivity}>
                        <div className={styles.sectionHeader}>
                            <h3>Последняя активность</h3>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>
                                <FaFlagCheckered />
                            </div>
                            <div className={styles.activityInfo}>
                                <h4>
                                    Решена CTF-задача "SQL Injection Master"
                                </h4>
                                <p>2 часа назад • +150 очков</p>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>
                                <FaMedal />
                            </div>
                            <div className={styles.activityInfo}>
                                <h4>Получен бейдж "Криптоаналитик"</h4>
                                <p>Вчера • Уровень 3</p>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>
                                <FaComment />
                            </div>
                            <div className={styles.activityInfo}>
                                <h4>
                                    Комментарий в обсуждении "Безопасность API"
                                </h4>
                                <p>2 дня назад • Форум</p>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>
                                <FaUsers />
                            </div>
                            <div className={styles.activityInfo}>
                                <h4>Вступил в команду "CyberHawks"</h4>
                                <p>3 дня назад • CTF-команда</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardPage;
