import React from "react";
import styles from "./HomePage.module.scss";
import Button from "../../shared/UI/Button/Button";
import {
    FaRocket,
    FaPlayCircle,
    FaLaptopCode,
    FaBrain,
    FaGamepad,
    FaUsers,
} from "react-icons/fa";

const HomePage = () => {
    return (
        <>
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <h1>Освойте кибербезопасность через CTF-задачи</h1>
                            <p>
                                CyberQuest — это интерактивная платформа для
                                обучения и практики в области информационной
                                безопасности. Осваивайте хакерские техники в
                                безопасной среде, соревнуйтесь с другими
                                участниками и повышайте свои навыки.
                            </p>
                            <div className={styles.heroCta}>
                                <Button variant="primary">
                                    <FaRocket /> Начать обучение
                                </Button>
                                <Button variant="secondary">
                                    <FaPlayCircle /> Демо-тур
                                </Button>
                            </div>
                        </div>
                        <div className={styles.heroImage}></div>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className="container">
                    <div className={styles.sectionTitle}>
                        <h2>Почему выбирают CyberQuest?</h2>
                        <p>
                            Комплексный подход к обучению кибербезопасности
                            через практику, геймификацию и персонализацию
                        </p>
                    </div>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <FaLaptopCode />
                            </div>
                            <h3>Практические лаборатории</h3>
                            <p>
                                Реальные сценарии уязвимостей в изолированных
                                средах Docker. Получайте практический опыт без
                                риска.
                            </p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <FaBrain />
                            </div>
                            <h3>Персонализация через ИИ</h3>
                            <p>
                                Адаптивная система рекомендаций курсов и задач
                                на основе вашего прогресса и целей обучения.
                            </p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <FaGamepad />
                            </div>
                            <h3>Геймификация</h3>
                            <p>
                                Очки опыта, бейджи, уровни и рейтинговая
                                таблица. Обучение становится увлекательной
                                игрой.
                            </p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <FaUsers />
                            </div>
                            <h3>Сообщество экспертов</h3>
                            <p>
                                Общайтесь с единомышленниками, задавайте
                                вопросы, формируйте команды для участия в
                                CTF-соревнованиях.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
