"use client";

import React, { useState } from "react";
import Link from "next/link";
import * as styles from "./CoursesPage.module.scss";
import Button from "@/shared/UI/Button/Button";
import ProgressBar from "@/shared/UI/ProgressBar/ProgressBar";
import { useApp } from "@/providers/AppProvider";
import { FaCode, FaGlobe, FaLock, FaClock, FaChartBar } from "react-icons/fa";
import { useScrollAnimation } from "@/shared/lib/hooks/useScrollAnimation";

function CourseCard({
    course,
    id,
    title,
    description,
    icon,
    difficulty,
    lessons,
    progress,
    slug,
}) {
    const getDifficultyText = (difficulty) => {
        switch (difficulty) {
            case "beginner":
                return "Для начинающих";
            case "intermediate":
                return "Средний";
            case "advanced":
                return "Продвинутый";
            default:
                return "";
        }
    };

    const getLevelText = (difficulty) => {
        switch (difficulty) {
            case "beginner":
                return "Начальный";
            case "intermediate":
                return "Средний";
            case "advanced":
                return "Продвинутый";
            default:
                return "";
        }
    };

    const cardRef = useScrollAnimation({
        threshold: 0.1,
        animationClass: styles.fadeInVisible,
    });

    return (
        <div ref={cardRef} className={styles.courseCard}>
            <div className={styles.courseImage}>
                <course.icon />
                <div
                    className={`${styles.courseDifficulty} ${styles[`difficulty-${difficulty}`]}`}
                >
                    {getDifficultyText(difficulty)}
                </div>
            </div>
            <div className={styles.courseContent}>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className={styles.courseMeta}>
                    <span>
                        <FaClock /> {lessons} уроков
                    </span>
                    <span>
                        <FaChartBar /> {getLevelText(difficulty)}
                    </span>
                </div>
                {progress > 0 && (
                    <div className={styles.courseProgress}>
                        <ProgressBar progress={progress} />
                        <div className={styles.progressText}>
                            <span>Прогресс</span>
                            <span>{progress}%</span>
                        </div>
                    </div>
                )}
                <Link href={`/courses/${slug}`} style={{ width: "100%" }}>
                    <Button variant="primary" fullWidth>
                        {progress > 0 ? "Продолжить" : "Начать курс"}
                    </Button>
                </Link>
            </div>
        </div>
    );
}

const CoursesPage = () => {
    const [filter, setFilter] = useState("all");
    const { showNotification } = useApp();

    const courses = [
        {
            id: 1,
            title: "Введение в кибербезопасность",
            description:
                "Базовые концепции информационной безопасности, основы сетевых протоколов и криптографии.",
            icon: FaCode,
            difficulty: "beginner",
            lessons: 15,
            progress: 30,
            slug: "intro",
        },
        {
            id: 2,
            title: "Веб-уязвимости и эксплойты",
            description:
                "SQL-инъекции, XSS, CSRF и другие распространенные уязвимости веб-приложений.",
            icon: FaGlobe,
            difficulty: "intermediate",
            lessons: 22,
            progress: 70,
            slug: "web-vulns",
        },
        {
            id: 3,
            title: "Криптография и стеганография",
            description:
                "Алгоритмы шифрования, атаки на криптосистемы, скрытие информации в медиафайлах.",
            icon: FaLock,
            difficulty: "advanced",
            lessons: 18,
            progress: 0,
            slug: "crypto",
        },
    ];

    const filters = [
        { key: "all", label: "Все" },
        { key: "beginner", label: "Для начинающих" },
        { key: "web", label: "Веб-безопасность" },
        { key: "crypto", label: "Криптография" },
        { key: "reverse", label: "Реверс-инжиниринг" },
    ];

    const handleFilterClick = (filterKey) => {
        setFilter(filterKey);
        const filterLabel =
            filters.find((f) => f.key === filterKey)?.label || filterKey;
        showNotification(`Фильтр применён: ${filterLabel}`, "info");
    };

    return (
        <section className={styles.courses}>
            <div className="container">
                <div className={styles.coursesHeader}>
                    <div>
                        <h2>Каталог курсов и задач</h2>
                        <p>
                            Выберите направление по интересам и уровню сложности
                        </p>
                    </div>
                    <div className={styles.coursesFilter}>
                        {filters.map((f) => (
                            <button
                                key={f.key}
                                className={`${styles.filterBtn} ${filter === f.key ? styles.active : ""}`}
                                onClick={() => handleFilterClick(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.coursesGrid}>
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            {...course}
                            course={course}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoursesPage;
