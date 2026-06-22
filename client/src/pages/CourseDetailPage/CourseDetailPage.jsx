"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import * as styles from "./CourseDetailPage.module.scss";
import Button from "@/shared/UI/Button/Button";
import { useApp } from "@/providers/AppProvider";
import { coursesApi, challengesApi } from "@/shared/api";
import { DIFFICULTY_LABELS } from "@/shared/lib/utils/constants";
import {
    FaChevronDown,
    FaChevronUp,
    FaLightbulb,
    FaCheckCircle,
    FaTrophy,
    FaFlag,
    FaHistory,
} from "react-icons/fa";

const STORAGE_KEY = "cyberquest_course_flags";

const CourseDetailPage = ({ courseSlug }) => {
    const { showNotification, isAuthenticated } = useApp();
    const [course, setCourse] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [solvedIds, setSolvedIds] = useState(new Set());
    const [flagInputs, setFlagInputs] = useState({});
    const [lastSubmittedFlag, setLastSubmittedFlag] = useState({});
    const [submitting, setSubmitting] = useState({});
    const [hintVisible, setHintVisible] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Восстановление истории флагов из localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setLastSubmittedFlag(JSON.parse(stored));
            }
        } catch (e) {
            // игнорируем ошибки парсинга
        }
    }, []);

    // Сохранение истории флагов в localStorage при изменениях
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lastSubmittedFlag));
    }, [lastSubmittedFlag]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await coursesApi.getBySlug(courseSlug);
                setCourse(data);
                setTasks(data.challenges || []);
                if (isAuthenticated) {
                    const { data: solvesData } =
                        await challengesApi.getMySolvedIds();
                    setSolvedIds(
                        new Set(solvesData.solved_challenge_ids || []),
                    );
                }
            } catch (err) {
                showNotification("Ошибка загрузки курса", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [courseSlug, isAuthenticated]);

    const submitFlag = async (taskSlug) => {
        const flag = flagInputs[taskSlug]?.trim();
        if (!flag) {
            showNotification("Введите флаг", "error");
            return;
        }

        // Сохраняем флаг в историю сразу, чтобы отобразить при любом исходе
        setLastSubmittedFlag((prev) => ({ ...prev, [taskSlug]: flag }));

        setSubmitting((prev) => ({ ...prev, [taskSlug]: true }));
        try {
            const { data } = await challengesApi.submitFlag(taskSlug, flag);
            if (data.correct) {
                showNotification(
                    `Флаг принят! +${data.xp_earned} XP`,
                    "success",
                );
                const solvedTaskId = tasks.find((t) => t.slug === taskSlug)?.id;
                if (solvedTaskId) {
                    setSolvedIds((prev) => new Set(prev).add(solvedTaskId));
                }
            } else {
                showNotification(data.message || "Неверный флаг", "error");
            }
        } catch (err) {
            showNotification(
                err.response?.data?.error || "Ошибка отправки флага",
                "error",
            );
        } finally {
            setSubmitting((prev) => ({ ...prev, [taskSlug]: false }));
        }
    };

    const toggleHint = (taskIndex, hintIndex) => {
        setHintVisible((prev) => ({
            ...prev,
            [`${taskIndex}-${hintIndex}`]: !prev[`${taskIndex}-${hintIndex}`],
        }));
    };

    if (isLoading) {
        return (
            <div
                className="container"
                style={{ padding: "80px 0", textAlign: "center" }}
            ></div>
        );
    }

    if (!course) {
        return (
            <div
                className="container"
                style={{ padding: "80px 0", textAlign: "center" }}
            >
                Курс не найден
            </div>
        );
    }

    const solvedCount = tasks.filter((t) => solvedIds.has(t.id)).length;
    const progressPercent =
        tasks.length > 0 ? Math.round((solvedCount / tasks.length) * 100) : 0;

    return (
        <div className={`container ${styles.courseIntro}`}>
            <Link href="/courses" style={{ width: "25%" }}>
                <Button variant="primary" mb15>
                    ← Назад к курсам
                </Button>
            </Link>
            <h1>{course.title}</h1>
            <p className={styles.description}>{course.description}</p>

            <div className={styles.progressBar}>
                <span>
                    Прогресс:{" "}
                    <strong>
                        {solvedCount}/{tasks.length}
                    </strong>
                </span>
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {tasks.map((task, idx) => (
                <div
                    key={task.id}
                    className={`${styles.taskCard} ${solvedIds.has(task.id) ? styles.completed : ""}`}
                >
                    <div className={styles.taskHeader}>
                        <h3>{task.title}</h3>
                        <div className={styles.taskMeta}>
                            <span className={styles.taskTag}>
                                {task.category_display || task.category}
                            </span>
                            <span className={styles.taskTag}>
                                {DIFFICULTY_LABELS[task.difficulty] ||
                                    task.difficulty}
                            </span>
                            <span className={styles.taskTag}>
                                <FaTrophy style={{ marginRight: 4 }} />{" "}
                                {task.base_xp} очков
                            </span>
                        </div>
                    </div>

                    <div className={styles.taskDescription}>
                        <p>{task.description}</p>
                    </div>

                    {task.hints?.length > 0 && (
                        <div className={styles.hintSection}>
                            {task.hints.map((hint, hintIdx) => (
                                <div key={hintIdx}>
                                    <div
                                        className={styles.hintHeader}
                                        onClick={() => toggleHint(idx, hintIdx)}
                                    >
                                        <h4>
                                            <FaLightbulb /> Подсказка{" "}
                                            {hintIdx + 1}
                                            {hint.cost > 0 &&
                                                ` (${hint.cost} очков)`}
                                        </h4>
                                        {hintVisible[`${idx}-${hintIdx}`] ? (
                                            <FaChevronUp />
                                        ) : (
                                            <FaChevronDown />
                                        )}
                                    </div>
                                    {hintVisible[`${idx}-${hintIdx}`] && (
                                        <div className={styles.hintContent}>
                                            {hint.text}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {solvedIds.has(task.id) ? (
                        <div className={styles.solvedMessage}>
                            <FaCheckCircle />
                            <span>Вы решили эту задачу!</span>
                            {lastSubmittedFlag[task.slug] && (
                                <span className={styles.flagHistory}>
                                    <FaHistory /> Последний флаг:{" "}
                                    <code>{lastSubmittedFlag[task.slug]}</code>
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className={styles.flagInputSection}>
                            <h4>Отправить флаг</h4>
                            <div className={styles.flagInput}>
                                <input
                                    type="text"
                                    placeholder="CyberQuest{...}"
                                    value={flagInputs[task.slug] || ""}
                                    onChange={(e) =>
                                        setFlagInputs((prev) => ({
                                            ...prev,
                                            [task.slug]: e.target.value,
                                        }))
                                    }
                                    disabled={submitting[task.slug]}
                                />
                                <Button
                                    variant="primary"
                                    onClick={() => submitFlag(task.slug)}
                                    disabled={submitting[task.slug]}
                                >
                                    {submitting[task.slug]
                                        ? "Отправка..."
                                        : "Отправить"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CourseDetailPage;
