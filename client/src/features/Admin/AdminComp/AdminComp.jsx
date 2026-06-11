"use client";

import React, { useState, useEffect } from "react";
import * as styles from "./AdminComp.module.scss";
import Button from "@/shared/UI/Button/Button";
import { adminApi } from "@/shared/api";
import { useApp } from "@/providers/AppProvider";

const AdminComp = () => {
    const { isAdmin, showNotification } = useApp();
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [xpDelta, setXpDelta] = useState(0);
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState("users");

    useEffect(() => {
        if (isAdmin) fetchUsers(currentPage);
    }, [currentPage, isAdmin]);

    const fetchUsers = async (page) => {
        setIsLoading(true);
        try {
            const response = await adminApi.getUsers(page);
            setUsers(response.data.users);
            setTotalPages(response.data.pages);
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

    const handleDeleteUser = async (userId) => {
        if (!confirm("Вы уверены?")) return;
        try {
            await adminApi.updateUser(userId, { delete: true });
            showNotification("Пользователь удалён", "success");
            fetchUsers(currentPage);
        } catch (err) {
            showNotification("Ошибка удаления", "error");
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await adminApi.getLogs();
            setLogs(response.data.logs);
        } catch (err) {
            showNotification("Ошибка загрузки логов", "error");
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
                    <button
                        className={`${styles.tab} ${activeTab === "users" ? styles.active : ""}`}
                        onClick={() => setActiveTab("users")}
                    >
                        Пользователи
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "logs" ? styles.active : ""}`}
                        onClick={() => {
                            setActiveTab("logs");
                            fetchLogs();
                        }}
                    >
                        Логи
                    </button>
                </div>

                {activeTab === "users" && (
                    <>
                        <div className={styles.actions}>
                            <Button variant="secondary" onClick={handleBackup}>
                                Запустить бэкап
                            </Button>
                        </div>

                        {isLoading ? (
                            <p>Загрузка...</p>
                        ) : (
                            <div className={styles.usersTable}>
                                <table className={styles.table}>
                                    <thead className={styles.tableHead}>
                                        <tr>
                                            <th className={styles.colId}>ID</th>
                                            <th className={styles.colEmail}>
                                                Email
                                            </th>
                                            <th className={styles.colNick}>
                                                Ник
                                            </th>
                                            <th className={styles.colXp}>XP</th>
                                            <th className={styles.colRoles}>
                                                Роли
                                            </th>
                                            <th className={styles.colStatus}>
                                                Активен
                                            </th>
                                            <th className={styles.colActions}>
                                                Действия
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <React.Fragment key={user.id}>
                                                <tr className={styles.tableRow}>
                                                    <td
                                                        className={styles.colId}
                                                    >
                                                        {user.id}
                                                    </td>
                                                    <td
                                                        className={
                                                            styles.colEmail
                                                        }
                                                    >
                                                        {user.email}
                                                    </td>
                                                    <td
                                                        className={
                                                            styles.colNick
                                                        }
                                                    >
                                                        {user.nickname}
                                                    </td>
                                                    <td
                                                        className={styles.colXp}
                                                    >
                                                        {user.total_xp}
                                                    </td>
                                                    <td
                                                        className={
                                                            styles.colRoles
                                                        }
                                                    >
                                                        {user.roles?.join(", ")}
                                                    </td>
                                                    <td
                                                        className={
                                                            styles.colStatus
                                                        }
                                                    >
                                                        {user.is_active
                                                            ? "Да"
                                                            : "Нет"}
                                                    </td>
                                                    <td
                                                        className={
                                                            styles.colActions
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.rowActions
                                                            }
                                                        >
                                                            <Button
                                                                variant="secondary"
                                                                onClick={() =>
                                                                    setSelectedUserId(
                                                                        selectedUserId ===
                                                                            user.id
                                                                            ? null
                                                                            : user.id,
                                                                    )
                                                                }
                                                            >
                                                                XP
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                onClick={() =>
                                                                    handleUpdateUser(
                                                                        user.id,
                                                                        {
                                                                            is_active:
                                                                                !user.is_active,
                                                                        },
                                                                    )
                                                                }
                                                            >
                                                                {user.is_active
                                                                    ? "Блок"
                                                                    : "Разблок"}
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                onClick={() =>
                                                                    handleDeleteUser(
                                                                        user.id,
                                                                    )
                                                                }
                                                            >
                                                                Удалить
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Модалка изменения XP (появляется под строкой) */}
                                                {selectedUserId === user.id && (
                                                    <tr key={`xp-${user.id}`}>
                                                        <td
                                                            colSpan={7}
                                                            style={{
                                                                padding: 0,
                                                            }}
                                                        >
                                                            <div
                                                                className={
                                                                    styles.xpModal
                                                                }
                                                            >
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        xpDelta
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setXpDelta(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                        )
                                                                    }
                                                                    placeholder="+/- XP"
                                                                />
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={() =>
                                                                        handleAdjustXp(
                                                                            user.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Применить
                                                                </Button>
                                                                <Button
                                                                    variant="secondary"
                                                                    onClick={() =>
                                                                        setSelectedUserId(
                                                                            null,
                                                                        )
                                                                    }
                                                                >
                                                                    Отмена
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className={styles.pagination}>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.active : ""}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "logs" && (
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
