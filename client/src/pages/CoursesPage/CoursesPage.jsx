"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as styles from "./CoursesPage.module.scss";
import Button from "@/shared/UI/Button/Button";
import ProgressBar from "@/shared/UI/ProgressBar/ProgressBar";
import { useApp } from "@/providers/AppProvider";
import { coursesApi } from "@/shared/api/index";
import {
    FaCode,
    FaGlobe,
    FaLock,
    FaClock,
    FaChartBar,
    FaShieldAlt,
    FaBug,
    FaFlag,
    FaSearch,
    FaTrophy,
} from "react-icons/fa";
import { useScrollAnimation } from "@/shared/lib/hooks/useScrollAnimation";

const iconMap = {
    FaCode,
    FaGlobe,
    FaLock,
    FaShieldAlt,
    FaBug,
    FaFlag,
    FaSearch,
    FaTrophy,
};
const getIcon = (iconName) => iconMap[iconName] || FaCode;

function CourseCard({ course, progress }) {
    const getDifficultyText = (difficulty) => {
        switch (difficulty) {
            case "beginner":
                return "Для начинающих";
            case "intermediate":
                return "Средний";
            case "expert":
                return "Продвинутый";
            default:
                return "";
        }
    };

    const cardRef = useScrollAnimation({
        threshold: 0.1,
        animationClass: styles.fadeInVisible,
    });

    const Icon = getIcon(course.icon);

    return (
        <div ref={cardRef} className={styles.courseCard}>
            <div className={styles.courseImage}>
                <Icon />
                <div
                    className={`${styles.courseDifficulty} ${styles[`difficulty-${course.difficulty}`]}`}
                >
                    {getDifficultyText(course.difficulty)}
                </div>
            </div>
            <div className={styles.courseContent}>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className={styles.courseMeta}>
                    <span>
                        <FaClock /> {course.challenges_count} заданий
                    </span>
                    <span>
                        <FaChartBar /> {getDifficultyText(course.difficulty)}
                    </span>
                </div>
                {progress !== null && (
                    <div className={styles.courseProgress}>
                        <ProgressBar progress={progress} />
                        <div className={styles.progressText}>
                            <span>Прогресс</span>
                            <span>{progress}%</span>
                        </div>
                    </div>
                )}
                <Link
                    href={`/courses/${course.slug}`}
                    style={{ width: "100%" }}
                >
                    <Button variant="primary" fullWidth>
                        {progress && progress > 0
                            ? "Продолжить"
                            : "Начать курс"}
                    </Button>
                </Link>
            </div>
        </div>
    );
}

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [progressMap, setProgressMap] = useState({});
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const { showNotification, isAuthenticated } = useApp();
    const [isLoading, setIsLoading] = useState(true);

    const difficulties = [
        { key: "all", label: "Все" },
        { key: "beginner", label: "Для начинающих" },
        { key: "intermediate", label: "Средний" },
        { key: "expert", label: "Продвинутый" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await coursesApi.getAll();
                setCourses(data);
                if (isAuthenticated) {
                    const progressPromises = data.map((course) =>
                        coursesApi
                            .getProgress(course.slug)
                            .then((res) => ({
                                slug: course.slug,
                                progress: res.data.progress_percent,
                            }))
                            .catch(() => ({ slug: course.slug, progress: 0 })),
                    );
                    const results = await Promise.all(progressPromises);
                    const map = {};
                    results.forEach((r) => {
                        map[r.slug] = r.progress;
                    });
                    setProgressMap(map);
                }
            } catch (err) {
                showNotification("Ошибка загрузки курсов", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated]);

    const filteredCourses = courses.filter((course) => {
        if (
            difficultyFilter !== "all" &&
            course.difficulty !== difficultyFilter
        )
            return false;
        if (categoryFilter !== "all" && course.category !== categoryFilter)
            return false;
        return true;
    });

    const handleDifficultyClick = (key) => {
        setDifficultyFilter(key);
        showNotification(
            `Сложность: ${difficulties.find((d) => d.key === key)?.label}`,
            "info",
        );
    };

    if (isLoading) {
        return (
            <div
                className="container"
                style={{ padding: "80px 0", textAlign: "center" }}
            ></div>
        );
    }

    return (
        <section className={styles.courses}>
            <div className="container">
                <div className={styles.coursesHeader}>
                    <div>
                        <h2>Каталог курсов и задач</h2>
                        <p>Выберите направление курса по уровню сложности</p>
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Сложность:</span>
                    <div className={styles.coursesFilter}>
                        {difficulties.map((d) => (
                            <button
                                key={d.key}
                                className={`${styles.filterBtn} ${difficultyFilter === d.key ? styles.active : ""}`}
                                onClick={() => handleDifficultyClick(d.key)}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.coursesGrid}>
                    {filteredCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            progress={progressMap[course.slug] ?? null}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoursesPage;
