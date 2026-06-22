"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as styles from "./CTFPage.module.scss";
import Button from "@/shared/UI/Button/Button";
import { useScrollAnimation } from "@/shared/lib/hooks/useScrollAnimation";
import { challengesApi } from "@/shared/api/index";
import { DIFFICULTY_LABELS } from "@/shared/lib/utils/constants";
import { useApp } from "@/providers/AppProvider";
import {
    FaShieldAlt,
    FaLock,
    FaCode,
    FaBug,
    FaFlag,
    FaTrophy,
    FaSearch,
    FaCheckCircle,
} from "react-icons/fa";

const categoryIcons = {
    web_security: FaShieldAlt,
    cryptography: FaLock,
    forensics: FaSearch,
    reverse: FaCode,
    pwn: FaFlag,
};
const defaultIcon = FaTrophy;

const getTaskIcon = (category) => categoryIcons[category] || defaultIcon;

function CTFCard({ task, isSolved }) {
    const cardRef = useScrollAnimation({
        threshold: 0.1,
        animationClass: styles.fadeInVisible,
    });

    const Icon = getTaskIcon(task.category);

    return (
        <div ref={cardRef} className={styles.ctfCard}>
            <div className={styles.cardImage}>
                <Icon />
                <div
                    className={`${styles.difficultyBadge} ${styles[`difficulty-${task.difficulty}`]}`}
                >
                    {DIFFICULTY_LABELS[task.difficulty] || task.difficulty}
                </div>
                {isSolved && (
                    <div className={styles.solvedBadge}>
                        <FaCheckCircle />
                    </div>
                )}
            </div>
            <div className={styles.cardContent}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className={styles.meta}>
                    <span>
                        <FaTrophy style={{ marginRight: 6 }} />
                        {task.base_xp} очков
                    </span>
                </div>
                {isSolved ? (
                    <Button variant="secondary" fullWidth disabled>
                        <FaCheckCircle /> Решено
                    </Button>
                ) : (
                    <Link href={`/ctf/${task.slug}`}>
                        <Button variant="primary" fullWidth>
                            Решить
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

const CTFPage = () => {
    const { isAuthenticated } = useApp();
    const [tasks, setTasks] = useState([]);
    const [solvedIds, setSolvedIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [{ data: tasksData }, solvedData] = await Promise.all([
                    challengesApi.getAll({ status: "published", perPage: 50 }),
                    isAuthenticated
                        ? challengesApi.getMySolvedIds().catch(() => ({
                              data: { solved_challenge_ids: [] },
                          }))
                        : Promise.resolve({
                              data: { solved_challenge_ids: [] },
                          }),
                ]);
                setTasks(tasksData.challenges);
                if (solvedData?.data?.solved_challenge_ids) {
                    setSolvedIds(new Set(solvedData.data.solved_challenge_ids));
                }
            } catch (err) {
                setError("Не удалось загрузить задачи");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated]);

    if (isLoading) {
        return (
            <section className={styles.ctfList}>
                <div
                    className="container"
                    style={{ textAlign: "center", padding: "80px 0" }}
                >
                    <p>Загрузка задач...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.ctfList}>
                <div
                    className="container"
                    style={{ textAlign: "center", padding: "80px 0" }}
                >
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.ctfList}>
            <div className="container">
                <div className={styles.header}>
                    <h2>CTF-задачи</h2>
                    <p>Испытай свои навыки в кибербезопасности</p>
                </div>

                <div className={styles.grid}>
                    {tasks.map((task) => (
                        <CTFCard
                            key={task.id}
                            task={task}
                            isSolved={solvedIds.has(task.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CTFPage;
