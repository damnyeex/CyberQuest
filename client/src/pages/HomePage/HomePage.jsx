"use client";

import React from "react";
import Link from "next/link";
import * as styles from "./HomePage.module.scss";
import Button from "@/shared/UI/Button/Button";
import { useApp } from "@/providers/AppProvider";
import {
    FaRocket,
    FaPlayCircle,
    FaLaptopCode,
    FaBrain,
    FaGamepad,
    FaUsers,
} from "react-icons/fa";
import { useScrollAnimation } from "@/shared/lib/hooks/useScrollAnimation";

function FeatureCard({ icon, title, description, index }) {
    const cardRef = useScrollAnimation({
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        animationClass: styles.fadeInVisible,
    });

    return (
        <div ref={cardRef} className={styles.featureCard}>
            <div className={styles.featureIcon}>{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

const HomePage = () => {
    const { isAuthenticated } = useApp();

    const features = [
        {
            icon: <FaLaptopCode />,
            title: "Практические лаборатории",
            description:
                "Реальные сценарии уязвимостей в изолированных средах Docker. Получайте практический опыт без риска.",
        },
        {
            icon: <FaBrain />,
            title: "Персонализация через ИИ",
            description:
                "Адаптивная система рекомендаций курсов и задач на основе вашего прогресса и целей обучения.",
        },
        {
            icon: <FaGamepad />,
            title: "Геймификация",
            description:
                "Очки опыта, бейджи, уровни и рейтинговая таблица. Обучение становится увлекательной игрой.",
        },
        {
            icon: <FaUsers />,
            title: "Сообщество экспертов",
            description:
                "Общайтесь с единомышленниками, задавайте вопросы, формируйте команды для участия в CTF-соревнованиях.",
        },
    ];

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
                                {isAuthenticated ? (
                                    <Link href="/courses">
                                        <Button variant="primary">
                                            <FaRocket /> К курсам
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/auth/register">
                                        <Button variant="primary">
                                            <FaRocket /> Начать обучение
                                        </Button>
                                    </Link>
                                )}
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
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                {...feature}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
