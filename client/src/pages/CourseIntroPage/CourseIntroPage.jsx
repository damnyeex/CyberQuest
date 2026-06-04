'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as styles from './CourseIntroPage.module.scss';
import Button from '@/shared/UI/Button/Button';
import { useApp } from '@/providers/AppProvider';
import {
  FaKey, FaImage, FaSearch, FaDownload,
  FaCheckCircle, FaTimesCircle,
} from 'react-icons/fa';

const correctFlags = {
  1: 'CyberQuest{rot13_is_easy}',
  2: 'CyberQuest{stego_master}',
  3: 'CyberQuest{jdoe@securecorp.local}',
};

export default function CourseIntroPage({ courseId }) {
  const { showNotification } = useApp();
  const [completed, setCompleted] = useState(new Set());
  const [flagInputs, setFlagInputs] = useState({ 1: '', 2: '', 3: '' });
  const [results, setResults] = useState({ 1: null, 2: null, 3: null });
  const [osintModalOpen, setOsintModalOpen] = useState(false);
  const [osintContent, setOsintContent] = useState('');

  const progress = completed.size;

  useEffect(() => {
    if (progress === 3) {
      showNotification('Поздравляем! Курс пройден!', 'success');
    }
  }, [progress, showNotification]);

    const submitFlag = (taskId) => {
        const input = flagInputs[taskId].trim();
        if (input.toLowerCase() === correctFlags[taskId].toLowerCase()) {
            setResults((prev) => ({ ...prev, [taskId]: "success" }));
            setCompleted((prev) => new Set(prev).add(taskId));
            showNotification(`Задание ${taskId} выполнено! +100 XP`, "success");
        } else {
            setResults((prev) => ({ ...prev, [taskId]: "error" }));
        }
    };

    const showOSINTSource = (n) => {
        let content = "";
        if (n === 1)
            content =
                "<h3>LinkedIn</h3><p>Имя: John Doe<br>Должность: Security Analyst @ SecureCorp<br>Контакт: <strong>jdoe@securecorp.local</strong></p>";
        if (n === 2)
            content =
                '<h3>GitHub</h3><p>Username: jdoe-sec<br>Bio: "Работаю в SecureCorp. Ищу уязвимости 😉"</p>';
        if (n === 3)
            content =
                '<h3>Форум</h3><p>Пост от пользователя jdoe: "Пишите мне на jdoe@securecorp.local"</p>';
        setOsintContent(content);
        setOsintModalOpen(true);
    };

    return (
         <div className={`container ${styles.courseIntro}`}>
                <Link href="/courses" className={styles.backLink}>
                    ← Назад к курсам
                </Link>
            <h1>Введение в кибербезопасность</h1>
            <p className={styles.description}>Базовый курс для новичков...</p>

            <div className={styles.progressBar}>
                <span>
                    Прогресс: <strong>{progress}/3</strong>
                </span>
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${(progress / 3) * 100}%` }}
                    />
                </div>
            </div>

            {/* Задание 1 */}
            <div
                className={`${styles.taskCard} ${completed.has(1) ? styles.completed : ""}`}
            >
                <div className={styles.taskHeader}>
                    <h2>
                        <FaKey /> Задание 1: Криптография
                    </h2>
                    <span className={styles.taskTag}>Для начинающих</span>
                </div>
                <p>
                    Вам пришло зашифрованное сообщение. Это шифр{" "}
                    <strong>ROT13</strong>.
                </p>
                <div className={styles.codeBlock}>
                    PLOREDHRFG{"{EBG13_VF_RNFL}"}
                </div>
                <div className={styles.flagInput}>
                    <input
                        type="text"
                        placeholder="CyberQuest{...}"
                        value={flagInputs[1]}
                        onChange={(e) =>
                            setFlagInputs({ ...flagInputs, 1: e.target.value })
                        }
                    />
                    <Button variant="primary" onClick={() => submitFlag(1)}>
                        Отправить флаг
                    </Button>
                </div>
                {results[1] === "success" && (
                    <p className={styles.successMsg}>
                        <FaCheckCircle /> Правильно! +100 XP
                    </p>
                )}
                {results[1] === "error" && (
                    <p className={styles.errorMsg}>
                        <FaTimesCircle /> Неверный флаг.
                    </p>
                )}
            </div>

            {/* Задание 2 */}
            <div
                className={`${styles.taskCard} ${completed.has(2) ? styles.completed : ""}`}
            >
                <div className={styles.taskHeader}>
                    <h2>
                        <FaImage /> Задание 2: Стеганография
                    </h2>
                    <span className={styles.taskTag}>Для начинающих</span>
                </div>
                <p>Скачайте файл и найдите скрытое сообщение.</p>
                <a href="/secret.png" download className={styles.downloadBtn}>
                    <FaDownload /> Скачать secret.png
                </a>
                <div className={styles.flagInput}>
                    <input
                        type="text"
                        placeholder="CyberQuest{...}"
                        value={flagInputs[2]}
                        onChange={(e) =>
                            setFlagInputs({ ...flagInputs, 2: e.target.value })
                        }
                    />
                    <Button variant="primary" onClick={() => submitFlag(2)}>
                        Отправить флаг
                    </Button>
                </div>
                {results[2] === "success" && (
                    <p className={styles.successMsg}>
                        <FaCheckCircle /> Правильно! +100 XP
                    </p>
                )}
                {results[2] === "error" && (
                    <p className={styles.errorMsg}>
                        <FaTimesCircle /> Неверный флаг.
                    </p>
                )}
            </div>

            {/* Задание 3 */}
            <div
                className={`${styles.taskCard} ${completed.has(3) ? styles.completed : ""}`}
            >
                <div className={styles.taskHeader}>
                    <h2>
                        <FaSearch /> Задание 3: OSINT
                    </h2>
                    <span className={styles.taskTag}>Для начинающих</span>
                </div>
                <p>
                    Соберите информацию из открытых источников и найдите email
                    сотрудника SecureCorp.
                </p>
                <div className={styles.osintButtons}>
                    <Button
                        variant="secondary"
                        onClick={() => showOSINTSource(1)}
                    >
                        Источник 1: LinkedIn
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => showOSINTSource(2)}
                    >
                        Источник 2: GitHub
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => showOSINTSource(3)}
                    >
                        Источник 3: Форум
                    </Button>
                </div>
                <div className={styles.flagInput}>
                    <input
                        type="text"
                        placeholder="CyberQuest{...}"
                        value={flagInputs[3]}
                        onChange={(e) =>
                            setFlagInputs({ ...flagInputs, 3: e.target.value })
                        }
                    />
                    <Button variant="primary" onClick={() => submitFlag(3)}>
                        Отправить флаг
                    </Button>
                </div>
                {results[3] === "success" && (
                    <p className={styles.successMsg}>
                        <FaCheckCircle /> Правильно! +100 XP
                    </p>
                )}
                {results[3] === "error" && (
                    <p className={styles.errorMsg}>
                        <FaTimesCircle /> Неверный флаг.
                    </p>
                )}
            </div>

            {/* OSINT Modal */}
            {osintModalOpen && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setOsintModalOpen(false)}
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.modalClose}
                            onClick={() => setOsintModalOpen(false)}
                        >
                            ×
                        </button>
                        <div
                            dangerouslySetInnerHTML={{ __html: osintContent }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseIntroPage;
