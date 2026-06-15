"use client";

import React, { useState } from "react";
import Link from "next/link";
import * as styles from "./CTFDetailPage.module.scss";
import Button from "@/shared/UI/Button/Button";
import { useApp } from "@/providers/AppProvider";
import {
    FaChevronDown,
    FaChevronUp,
    FaLightbulb,
    FaRedo,
    FaStop,
    FaExternalLinkAlt,
    FaQuestionCircle,
} from "react-icons/fa";

const CTFDetailPage = ({ slug }) => {
    const { showNotification } = useApp();
    const [hintVisible, setHintVisible] = useState(false);
    const [flagInput, setFlagInput] = useState("");

    const toggleHint = () => {
        setHintVisible(!hintVisible);
        if (!hintVisible) {
            showNotification("Подсказка открыта (-50 очков)", "info");
        }
    };

    const submitFlag = () => {
        if (!flagInput.trim()) {
            showNotification("Введите флаг для отправки", "error");
            return;
        }
        if (flagInput.startsWith("CyberQuest{") && flagInput.endsWith("}")) {
            showNotification("Флаг принят! +300 очков опыта", "success");
            setFlagInput("");
        } else {
            showNotification("Неверный формат флага", "error");
        }
    };

    // Здесь позже можно подтянуть данные по slug из API
    return (
        <section className={styles.ctfTrainer}>
            <div className="container">
                <Link href="/ctf" style={{ width: "25%" }}>
                    <Button variant="primary" mb15>
                        ← Назад к задачам
                    </Button>
                </Link>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2>CTF Тренажер</h2>
                        <p>Практическая задача: Обход аутентификации</p>
                    </div>
                    <Button variant="secondary">
                        <FaQuestionCircle /> Помощь
                    </Button>
                </div>

                <div className={styles.ctfContainer}>
                    <div className={styles.taskMain}>
                        <div className={styles.taskHeader}>
                            <h3>Задание #CTF-07: Уязвимость сессий</h3>
                            <div className={styles.taskMeta}>
                                <span className={styles.taskTag}>
                                    Веб-безопасность
                                </span>
                                <span className={styles.taskTag}>
                                    Средняя сложность
                                </span>
                                <span className={styles.taskTag}>
                                    300 очков
                                </span>
                            </div>
                        </div>

                        <div className={styles.taskDescription}>
                            <h3>Описание задачи</h3>
                            <p>
                                Вам предоставлен доступ к тестовому
                                веб-приложению с уязвимой системой
                                аутентификации. Найдите способ обойти проверку
                                подлинности и получить доступ к административной
                                панели.
                            </p>
                            <p>
                                Цель: получить флаг в формате{" "}
                                <code>CyberQuest{"{...}"}</code> из защищенной
                                области приложения.
                            </p>
                            <h3>Дополнительная информация</h3>
                            <p>
                                Приложение использует cookies для управления
                                сессиями. Обратите внимание на параметры cookies
                                и их значения. Административная панель доступна
                                по адресу <code>/admin.php</code>.
                            </p>
                        </div>

                        <div className={styles.hintSection}>
                            <div
                                className={styles.hintHeader}
                                onClick={toggleHint}
                            >
                                <h3>
                                    <FaLightbulb /> Подсказка #1 (стоимость: 50
                                    очков)
                                </h3>
                                {hintVisible ? (
                                    <FaChevronUp />
                                ) : (
                                    <FaChevronDown />
                                )}
                            </div>
                            {hintVisible && (
                                <div className={styles.hintContent}>
                                    <p>
                                        Изучите cookies, установленные
                                        приложением после входа. Обратите
                                        внимание на cookie с именем{" "}
                                        <code>user_role</code>. Какие значения
                                        он может принимать?
                                    </p>
                                </div>
                            )}
                        </div>

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
                                />
                                <Button variant="primary" onClick={submitFlag}>
                                    Отправить
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
                                следующие данные:
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
                                    <span>42% участников</span>
                                </div>
                                <div>
                                    <span>Среднее время:</span>{" "}
                                    <span>48 минут</span>
                                </div>
                                <div>
                                    <span>Подсказки использовали:</span>{" "}
                                    <span>67%</span>
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
