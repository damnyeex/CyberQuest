"use client";

import React, { useState, useEffect } from "react";
import * as styles from "./AdminComp.module.scss";
import Button from "@/shared/UI/Button/Button";
import { adminApi } from "@/shared/api/index";
import { useApp } from "@/providers/AppProvider";
import UsersTable from "@/features/Admin/Components/UsersTable";
import ChallengesTab from "@/features/Admin/Components/ChallengesTab";
import CategoriesTab from "@/features/Admin/Components/CategoriesTab";
import DifficultiesTab from "@/features/Admin/Components/DifficultiesTab";
import TagsTab from "@/features/Admin/Components/TagsTab";

const AdminComp = () => {
    const { isAdmin, showNotification } = useApp();

    const [activeTab, setActiveTab] = useState("users");
    const [isLoading, setIsLoading] = useState(false);

    // Пользователи
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [xpDelta, setXpDelta] = useState(0);
    const [editingRoles, setEditingRoles] = useState({});

    // Задачи
    const [challenges, setChallenges] = useState([]);
    const [challengeTotalPages, setChallengeTotalPages] = useState(1);
    const [challengePage, setChallengePage] = useState(1);

    // Категории, уровни, теги
    const [categories, setCategories] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [tags, setTags] = useState([]);

    // Логи
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (!isAdmin) return;
        switch (activeTab) {
            case "users":
                fetchUsers(currentPage);
                break;
            case "challenges":
                fetchChallenges(challengePage);
                break;
            case "categories":
                fetchCategories();
                break;
            case "difficulties":
                fetchDifficulties();
                break;
            case "tags":
                fetchTags();
                break;
            case "logs":
                fetchLogs();
                break;
        }
    }, [activeTab, currentPage, challengePage]);

    const fetchUsers = async (page) => {
        setIsLoading(true);
        try {
            const { data } = await adminApi.getUsers(page);
            setUsers(data.users);
            setTotalPages(data.pages);
        } catch (err) {
            showNotification("Ошибка загрузки пользователей", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async (userId, data) => {
        try {
            await adminApi.updateUser(userId, data);
            showNotification("Пользователь обновлён", "success");
            fetchUsers(currentPage);
        } catch (err) {
            showNotification("Ошибка обновления", "error");
        }
    };

    const handleAdjustXp = async (userId) => {
        try {
            await adminApi.adjustXp(userId, xpDelta);
            showNotification(`XP изменён на ${xpDelta}`, "success");
            setSelectedUserId(null);
            setXpDelta(0);
            fetchUsers(currentPage);
        } catch (err) {
            showNotification("Ошибка изменения XP", "error");
        }
    };

    const handleRestoreUser = async (userId) => {
        try {
            await adminApi.restoreUser(userId);
            showNotification("Пользователь восстановлен", "success");
            fetchUsers(currentPage);
        } catch (err) {
            showNotification("Ошибка восстановления", "error");
        }
    };

    const handleRoleChange = (userId, newRole) => {
        setEditingRoles((prev) => ({ ...prev, [userId]: newRole }));
    };

    const saveRoles = async (userId) => {
        const role = editingRoles[userId];
        if (!role) return;
        try {
            await adminApi.updateUser(userId, { roles: [role] });
            showNotification("Роль обновлена", "success");
            setEditingRoles((prev) => {
                const next = { ...prev };
                delete next[userId];
                return next;
            });
            fetchUsers(currentPage);
        } catch (err) {
            showNotification("Ошибка сохранения роли", "error");
        }
    };

    const fetchChallenges = async (page) => {
        setIsLoading(true);
        try {
            const { data } = await adminApi.getAllChallenges({ page });
            setChallenges(data.challenges);
            setChallengeTotalPages(data.pages);
        } catch (err) {
            showNotification("Ошибка загрузки задач", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteChallenge = async (id) => {
        if (!confirm("Удалить задачу навсегда?")) return;
        try {
            await adminApi.deleteChallenge(id);
            showNotification("Задача удалена", "success");
            fetchChallenges(challengePage);
        } catch (err) {
            showNotification("Ошибка удаления задачи", "error");
        }
    };

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const { data } = await adminApi.getAllCategories();
            setCategories(data);
        } catch (err) {
            showNotification("Ошибка загрузки категорий", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDifficulties = async () => {
        setIsLoading(true);
        try {
            const { data } = await adminApi.getAllDifficulties();
            setDifficulties(data);
        } catch (err) {
            showNotification("Ошибка загрузки уровней", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTags = async () => {
        setIsLoading(true);
        try {
            const { data } = await adminApi.getAllTags();
            setTags(data);
        } catch (err) {
            showNotification("Ошибка загрузки тегов", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const { data } = await adminApi.getLogs();
            setLogs(data.logs);
        } catch (err) {
            showNotification("Ошибка загрузки логов", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackup = async () => {
        try {
            await adminApi.backup();
            showNotification("Бэкап запущен", "success");
        } catch (err) {
            showNotification("Ошибка бэкапа", "error");
        }
    };
    if (!isAdmin) {
        return (
            <div className={styles.adminPage}>
                <div className="container">
                    <h1>Доступ запрещён</h1>
                    <p>У вас нет прав администратора</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminPage}>
            <div className="container">
                <h1>Админ-панель</h1>

                <div className={styles.tabs}>
                    {[
                        { key: "users", label: "Пользователи" },
                        { key: "challenges", label: "Задачи" },
                        { key: "categories", label: "Категории" },
                        { key: "difficulties", label: "Уровни" },
                        { key: "tags", label: "Теги" },
                        { key: "logs", label: "Логи" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            className={`${styles.tab} ${activeTab === tab.key ? styles.active : ""}`}
                            onClick={() => {
                                setActiveTab(tab.key);
                                if (tab.key === "logs") fetchLogs();
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className={styles.actions}>
                    {activeTab === "users" && (
                        <Button variant="secondary" onClick={handleBackup}>
                            Бэкап
                        </Button>
                    )}
                </div>

                {isLoading && <p className={styles.loading}></p>}

                {!isLoading && activeTab === "users" && (
                    <UsersTable
                        users={users}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        selectedUserId={selectedUserId}
                        setSelectedUserId={setSelectedUserId}
                        xpDelta={xpDelta}
                        setXpDelta={setXpDelta}
                        editingRoles={editingRoles}
                        handleUpdateUser={handleUpdateUser}
                        handleAdjustXp={handleAdjustXp}
                        handleRestoreUser={handleRestoreUser}
                        handleRoleChange={handleRoleChange}
                        saveRoles={saveRoles}
                    />
                )}

                {!isLoading && activeTab === "challenges" && (
                    <ChallengesTab
                        challenges={challenges}
                        setChallenges={setChallenges}
                        totalPages={challengeTotalPages}
                        currentPage={challengePage}
                        setCurrentPage={setChallengePage}
                        fetchChallenges={fetchChallenges}
                    />
                )}

                {!isLoading && activeTab === "categories" && (
                    <CategoriesTab
                        categories={categories}
                        setCategories={setCategories}
                    />
                )}

                {!isLoading && activeTab === "difficulties" && (
                    <DifficultiesTab
                        difficulties={difficulties}
                        setDifficulties={setDifficulties}
                    />
                )}

                {!isLoading && activeTab === "tags" && (
                    <TagsTab tags={tags} setTags={setTags} />
                )}

                {!isLoading && activeTab === "logs" && (
                    <div className={styles.logs}>
                        {logs.map((log, i) => (
                            <div key={i} className={styles.logItem}>
                                {log}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminComp;
