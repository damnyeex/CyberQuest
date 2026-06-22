"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as styles from "./DashboardPage.module.scss";
import Button from "@/shared/UI/Button/Button";
import ProgressBar from "@/shared/UI/ProgressBar/ProgressBar";
import { useApp } from "@/providers/AppProvider";
import { userApi, coursesApi, challengesApi } from "@/shared/api/index";
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
    const { user, isAuthenticated } = useApp();
    const [profile, setProfile] = useState(null);
    const [solvedCount, setSolvedCount] = useState(0);
    const [activeCourses, setActiveCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const [profileRes, solvesRes, coursesRes] = await Promise.all([
                    userApi.getMe(),
                    challengesApi.getMySolvedIds(),
                    coursesApi.getAll(),
                ]);

                setProfile(profileRes.data);
                const solvedIds = new Set(
                    solvesRes.data.solved_challenge_ids || [],
                );
                setSolvedCount(solvedIds.size);

                const coursesWithProgress = await Promise.all(
                    coursesRes.data.map(async (course) => {
                        try {
                            const progressRes = await coursesApi.getProgress(
                                course.slug,
                            );
                            const {
                                progress_percent,
                                total_tasks,
                                solved_tasks,
                            } = progressRes.data;
                            return {
                                ...course,
                                progress: progress_percent,
                                solved_tasks,
                                total_tasks,
                            };
                        } catch {
                            return {
                                ...course,
                                progress: 0,
                                solved_tasks: 0,
                                total_tasks: course.challenges_count || 0,
                            };
                        }
                    }),
                );

                const inProgress = coursesWithProgress.filter(
                    (c) => c.progress > 0 && c.progress < 100,
                );
                setActiveCourses(inProgress);
            } catch (err) {
                console.error("Ошибка загрузки данных дашборда", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAuthenticated]);

    const streakDays = 156;
    const rank = null;
    const badges = 8;

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
                            <h3>{solvedCount}</h3>
                            <p>Решенных CTF</p>
                        </div>
                    </div>
                    <div className={`${styles.statCard} ${styles.stat2}`}>
                        <div className={styles.statIcon}>
                            <FaFire />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{streakDays}</h3>
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
                            <h3>{badges}</h3>
                            <p>Полученных бейджей</p>
                        </div>
                    </div>
                </div>

                <div className={styles.dashboardContent}>
                    <div className={styles.activeCourses}>
                        <div className={styles.sectionHeader}>
                            <h3>Активные курсы</h3>
                            <Link href="/courses">Все курсы →</Link>
                        </div>
                        {isLoading ? (
                            <p className={styles.loading}></p>
                        ) : activeCourses.length === 0 ? (
                            <p className={styles.empty}>
                                Вы пока не начали ни одного курса
                            </p>
                        ) : (
                            activeCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className={styles.courseCard}
                                >
                                    <h3>{course.title}</h3>
                                    <p>
                                        {course.solved_tasks}/
                                        {course.total_tasks} заданий решено
                                    </p>
                                    <ProgressBar progress={course.progress} />
                                    <div className={styles.progressText}>
                                        <span>Прогресс</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <Link href={`/courses/${course.slug}`}>
                                        <Button variant="primary" fullWidth>
                                            Продолжить обучение
                                        </Button>
                                    </Link>
                                </div>
                            ))
                        )}
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
