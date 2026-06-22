"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as styles from "./CTFDetailPage.module.scss";
import Button from "@/shared/UI/Button/Button";
import { useApp } from "@/providers/AppProvider";
import { challengesApi } from "@/shared/api/index";
import { DIFFICULTY_LABELS } from "@/pages/CTFPage/CTFPage";
import {
    FaChevronDown,
    FaChevronUp,
    FaLightbulb,
    FaRedo,
    FaStop,
    FaExternalLinkAlt,
    FaQuestionCircle,
    FaCheckCircle,
} from "react-icons/fa";

const CTFDetailPage = ({ slug }) => {
    const { showNotification, refreshUser, isAuthenticated } = useApp();
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hintVisible, setHintVisible] = useState({});
    const [flagInput, setFlagInput] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    const [solvedXp, setSolvedXp] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const { data: taskData } = await challengesApi.getBySlug(slug);
                setTask(taskData);

                if (isAuthenticated) {
                    const { data: solvesData } =
                        await challengesApi.getMySolvedIds();
                    if (solvesData.solved_challenge_ids.includes(taskData.id)) {
                        setIsSolved(true);
                        setSolvedXp(taskData.base_xp);
                    }
                }
            } catch (err) {
                setError("Задача не найдена");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [slug, isAuthenticated]);

    const toggleHint = (index) => {
        setHintVisible((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const submitFlag = async () => {
        if (!flagInput.trim()) {
            showNotification("Введите флаг", "error");
            return;
        }
        setSubmitting(true);
        try {
            const { data } = await challengesApi.submitFlag(
                slug,
                flagInput.trim(),
            );
            if (data.correct) {
                showNotification(
                    `Флаг принят! +${data.xp_earned} XP`,
                    "success",
                );
                setIsSolved(true);
                setSolvedXp(data.xp_earned);
                setFlagInput("");
                await refreshUser();
            } else {
                showNotification(data.message || "Неверный флаг", "error");
            }
        } catch (err) {
            const msg = err.response?.data?.error || "Ошибка проверки флага";
            showNotification(msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <section className={styles.ctfTrainer}>
                <div
                    className="container"
                    style={{ textAlign: "center", padding: "80px 0" }}
                >
                    <p></p>
                </div>
            </section>
        );
    }

    if (error || !task) {
        return (
            <section className={styles.ctfTrainer}>
                <div
                    className="container"
                    style={{ textAlign: "center", padding: "80px 0" }}
                >
                    <p>{error || "Задача не найдена"}</p>
                    <Link href="/ctf">
                        <Button variant="primary">← Назад к задачам</Button>
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.ctfTrainer}>
            <div className="container">
                <Link href="/ctf" style={{ width: "25%" }}>
                    <Button variant="primary">← Назад к задачам</Button>
                </Link>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2>CTF Тренажер</h2>
                        <p>{task.title}</p>
                    </div>
                    <Button variant="secondary">
                        <FaQuestionCircle /> Помощь
                    </Button>
                </div>

                <div className={styles.ctfContainer}>
                    <div className={styles.taskMain}>
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
                                    {task.base_xp} очков
                                </span>
                            </div>
                        </div>

                        <div className={styles.taskDescription}>
                            <h3>Описание задачи</h3>
                            <p>{task.description}</p>
                            <p>
                                Цель: получить флаг в формате{" "}
                                <code>CyberQuest{"{...}"}</code>.
                            </p>
                        </div>

                        {task.hints?.length > 0 && (
                            <div className={styles.hintSection}>
                                {task.hints.map((hint, idx) => (
                                    <div key={idx}>
                                        <div
                                            className={styles.hintHeader}
                                            onClick={() => toggleHint(idx)}
                                        >
                                            <h3>
                                                <FaLightbulb /> Подсказка #
                                                {idx + 1}
                                                {hint.cost > 0 &&
                                                    ` (${hint.cost} очков)`}
                                            </h3>
                                            {hintVisible[idx] ? (
                                                <FaChevronUp />
                                            ) : (
                                                <FaChevronDown />
                                            )}
                                        </div>
                                        {hintVisible[idx] && (
                                            <div className={styles.hintContent}>
                                                <p>{hint.text}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.flagInputSection}>
                            <h3>Отправить флаг</h3>
                            <div className={styles.flagInput}>
                                <input
                                    type="text"
                                    placeholder="Введите флаг в формате CyberQuest{...}"
                                    value={flagInput}
                                    onChange={(e) =>
                                        setFlagInput(e.target.value)
                                    }
                                    disabled={submitting}
                                />
                                <Button
                                    variant="primary"
                                    onClick={submitFlag}
                                    disabled={submitting}
                                >
                                    {submitting ? "Отправка..." : "Отправить"}
                                </Button>
                            </div>
                            <p>У вас есть неограниченное количество попыток</p>
                        </div>
                    </div>

                    <div className={styles.taskSidebar}>
                        <div className={styles.sidebarCard}>
                            <h3>Управление лабораторией</h3>
                            <div className={styles.labControls}>
                                <div className={styles.labStatus}>
                                    <span>Статус лаборатории:</span>
                                    <div className={styles.statusIndicator}>
                                        <div
                                            className={`${styles.statusDot} ${styles.active}`}
                                        />
                                        <span>Запущена</span>
                                    </div>
                                </div>
                                <Button variant="secondary">
                                    <FaRedo /> Перезапустить
                                </Button>
                                <Button
                                    variant="secondary"
                                    style={{ backgroundColor: "var(--danger)" }}
                                >
                                    <FaStop /> Остановить
                                </Button>
                            </div>
                        </div>

                        <div className={styles.sidebarCard}>
                            <h3>Доступ к среде</h3>
                            <p>
                                Для доступа к тестовому приложению используйте
                                данные:
                            </p>
                            <div className={styles.credentials}>
                                <p>
                                    URL:{" "}
                                    <span>
                                        http://lab-ctf07.cyberquest.local
                                    </span>
                                </p>
                                <p>
                                    Пользователь: <span>test_user</span>
                                </p>
                                <p>
                                    Пароль: <span>temp_password123</span>
                                </p>
                            </div>
                            <Button variant="primary" fullWidth>
                                <FaExternalLinkAlt /> Открыть в новой вкладке
                            </Button>
                        </div>

                        <div className={styles.sidebarCard}>
                            <h3>Статистика задачи</h3>
                            <div className={styles.stats}>
                                <div>
                                    <span>Решили задачу:</span>{" "}
                                    <span>{task.solve_count} участников</span>
                                </div>
                                <div>
                                    <span>Всего попыток:</span>{" "}
                                    <span>{task.attempt_count}</span>
                                </div>
                                <div>
                                    <span>Подсказок:</span>{" "}
                                    <span>{task.hints?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTFDetailPage;
