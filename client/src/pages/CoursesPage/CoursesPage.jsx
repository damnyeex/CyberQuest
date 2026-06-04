import React, { useState } from "react";
import * as styles from "./CoursesPage.module.scss";
import Button from "../../shared/UI/Button/Button";
import ProgressBar from "../../shared/UI/ProgressBar/ProgressBar";
import { FaCode, FaGlobe, FaLock, FaClock, FaSignal } from "react-icons/fa";

const CoursesPage = () => {
    const [filter, setFilter] = useState("all");

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
            link: "course-intro",
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
        },
    ];

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
                        <button
                            className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
                            onClick={() => setFilter("all")}
                        >
                            Все
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === "beginner" ? styles.active : ""}`}
                            onClick={() => setFilter("beginner")}
                        >
                            Для начинающих
                        </button>
                        <button className={styles.filterBtn}>
                            Веб-безопасность
                        </button>
                        <button className={styles.filterBtn}>
                            Криптография
                        </button>
                        <button className={styles.filterBtn}>
                            Реверс-инжиниринг
                        </button>
                    </div>
                </div>

                <div className={styles.coursesGrid}>
                    {courses.map((course) => (
                        <div key={course.id} className={styles.courseCard}>
                            <div className={styles.courseImage}>
                                <course.icon />
                                <div
                                    className={`${styles.courseDifficulty} ${styles[`difficulty-${course.difficulty}`]}`}
                                >
                                    {course.difficulty === "beginner"
                                        ? "Для начинающих"
                                        : course.difficulty === "intermediate"
                                          ? "Средний"
                                          : "Продвинутый"}
                                </div>
                            </div>
                            <div className={styles.courseContent}>
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <div className={styles.courseMeta}>
                                    <span>
                                        <FaClock /> {course.lessons} уроков
                                    </span>
                                    <span>
                                        <FaSignal />{" "}
                                        {course.difficulty === "beginner"
                                            ? "Начальный"
                                            : course.difficulty ===
                                                "intermediate"
                                              ? "Средний"
                                              : "Продвинутый"}
                                    </span>
                                </div>
                                {course.progress > 0 && (
                                    <div className={styles.courseProgress}>
                                        <ProgressBar
                                            progress={course.progress}
                                        />
                                        <div className={styles.progressText}>
                                            <span>Прогресс</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                    </div>
                                )}
                                <Button variant="primary" fullWidth>
                                    {course.progress > 0
                                        ? "Продолжить"
                                        : "Начать курс"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoursesPage;
