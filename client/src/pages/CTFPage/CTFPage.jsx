"use client";

import React from "react";
import Link from "next/link";
import * as styles from "./CTFPage.module.scss";
import Button from "@/shared/UI/Button/Button";
import { useScrollAnimation } from "@/shared/lib/hooks/useScrollAnimation";
import {
    FaFlag,
    FaShieldAlt,
    FaLock,
    FaCode,
    FaBug,
    FaTrophy,
    FaBolt,
} from "react-icons/fa";

// Константа перевода сложности
export const DIFFICULTY_LABELS = {
    beginner: "Для начинающих",
    intermediate: "Средний",
    expert: "Продвинутый",
};

// Пример данных (позже заменится на API / банк задач)
const CTF_TASKS = [
    {
        id: 1,
        title: "Уязвимость сессий",
        description: "Обход аутентификации через cookies",
        icon: FaShieldAlt,
        difficulty: "beginner",
        xp: 100,
        slug: "session-vuln",
    },
    {
        id: 2,
        title: "SQL Injection",
        description: "Внедрение SQL-кода в форму логина",
        icon: FaCode,
        difficulty: "intermediate",
        xp: 250,
        slug: "sql-injection",
    },
    {
        id: 3,
        title: "XSS-атака",
        description: "Межсайтовый скриптинг в комментариях",
        icon: FaBug,
        difficulty: "intermediate",
        xp: 300,
        slug: "xss-attack",
    },
    {
        id: 4,
        title: "Криптография: ROT13",
        description: "Расшифруй секретное послание",
        icon: FaLock,
        difficulty: "beginner",
        xp: 80,
        slug: "rot13-crypto",
    },
    {
        id: 5,
        title: "Переполнение буфера",
        description: "Эксплуатация уязвимости в бинарном файле",
        icon: FaFlag,
        difficulty: "expert",
        xp: 500,
        slug: "buffer-overflow",
    },
    {
        id: 6,
        title: "Форензика: Восстановление файлов",
        description: "Анализ удалённых данных",
        icon: FaTrophy,
        difficulty: "expert",
        xp: 450,
        slug: "forensics-recovery",
    },
];

function CTFCard({ task }) {
    const cardRef = useScrollAnimation({
        threshold: 0.1,
        animationClass: styles.fadeInVisible,
    });

    return (
        <div ref={cardRef} className={styles.ctfCard}>
            <div className={styles.cardImage}>
                <task.icon />
                <div
                    className={`${styles.difficultyBadge} ${styles[`difficulty-${task.difficulty}`]}`}
                >
                    {DIFFICULTY_LABELS[task.difficulty] || task.difficulty}
                </div>
            </div>
            <div className={styles.cardContent}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className={styles.meta}>
                    <span>
                        <FaTrophy style={{ marginRight: 6 }} />
                        {task.xp} очков
                    </span>
                </div>
                <Link href={`/ctf/${task.slug}`}>
                    <Button variant="primary" fullWidth>
                        Решить
                    </Button>
                </Link>
            </div>
        </div>
    );
}

const CTFPage = () => {
    return (
        <section className={styles.ctfList}>
            <div className="container">
                <div className={styles.header}>
                    <h2>CTF-задачи</h2>
                    <p>Испытай свои навыки в кибербезопасности</p>
                </div>

                <div className={styles.grid}>
                    {CTF_TASKS.map((task) => (
                        <CTFCard key={task.id} task={task} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CTFPage;
