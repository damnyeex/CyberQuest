"use client";

import React, { useState } from "react";
import * as styles from "../AdminComp/AdminComp.module.scss";
import Button from "@/shared/UI/Button/Button";
import { adminApi } from "@/shared/api/index";
import { useApp } from "@/providers/AppProvider";

export default function DifficultiesTab({ difficulties, setDifficulties }) {
    const { showNotification } = useApp();
    const [newName, setNewName] = useState("");
    const [newDisplay, setNewDisplay] = useState("");
    const [newXp, setNewXp] = useState(0);
    const [newOrder, setNewOrder] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDisplay, setEditDisplay] = useState("");
    const [editXp, setEditXp] = useState(0);
    const [editOrder, setEditOrder] = useState(0);

    const fetchDifficulties = async () => {
        try {
            const { data } = await adminApi.getAllDifficulties();
            setDifficulties(data);
        } catch (err) {
            showNotification("Ошибка загрузки уровней", "error");
        }
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        try {
            await adminApi.createDifficulty({
                name: newName.trim(),
                display_name: newDisplay || newName,
                xp_reward: newXp,
                display_order: newOrder,
            });
            showNotification("Уровень создан", "success");
            setNewName("");
            setNewDisplay("");
            setNewXp(0);
            setNewOrder(0);
            fetchDifficulties();
        } catch (err) {
            showNotification("Ошибка создания уровня", "error");
        }
    };

    const startEdit = (d) => {
        setEditingId(d.id);
        setEditName(d.name);
        setEditDisplay(d.display_name);
        setEditXp(d.xp_reward || 0);
        setEditOrder(d.display_order || 0);
    };

    const handleUpdate = async (id) => {
        try {
            await adminApi.updateDifficulty(id, {
                name: editName,
                display_name: editDisplay,
                xp_reward: editXp,
                display_order: editOrder,
            });
            showNotification("Уровень обновлён", "success");
            setEditingId(null);
            fetchDifficulties();
        } catch (err) {
            showNotification("Ошибка обновления уровня", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Удалить уровень?")) return;
        try {
            await adminApi.deleteDifficulty(id);
            showNotification("Уровень удалён", "success");
            fetchDifficulties();
        } catch (err) {
            showNotification("Ошибка удаления уровня", "error");
        }
    };

    return (
        <div>
            <div className={styles.inlineForm}>
                <input
                    placeholder="Название"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <input
                    placeholder="Отображение"
                    value={newDisplay}
                    onChange={(e) => setNewDisplay(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="XP"
                    value={newXp}
                    onChange={(e) => setNewXp(Number(e.target.value))}
                />
                <input
                    type="number"
                    placeholder="Порядок"
                    value={newOrder}
                    onChange={(e) => setNewOrder(Number(e.target.value))}
                />
                <Button variant="primary" onClick={handleCreate}>
                    Создать
                </Button>
            </div>

            <div className={styles.usersTable}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Отображение</th>
                            <th>XP</th>
                            <th>Порядок</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {difficulties.map((d) => (
                            <tr key={d.id} className={styles.tableRow}>
                                <td>{d.id}</td>
                                <td>
                                    {editingId === d.id ? (
                                        <input
                                            value={editName}
                                            onChange={(e) =>
                                                setEditName(e.target.value)
                                            }
                                        />
                                    ) : (
                                        d.name
                                    )}
                                </td>
                                <td>
                                    {editingId === d.id ? (
                                        <input
                                            value={editDisplay}
                                            onChange={(e) =>
                                                setEditDisplay(e.target.value)
                                            }
                                        />
                                    ) : (
                                        d.display_name
                                    )}
                                </td>
                                <td>
                                    {editingId === d.id ? (
                                        <input
                                            type="number"
                                            value={editXp}
                                            onChange={(e) =>
                                                setEditXp(
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    ) : (
                                        d.xp_reward
                                    )}
                                </td>
                                <td>
                                    {editingId === d.id ? (
                                        <input
                                            type="number"
                                            value={editOrder}
                                            onChange={(e) =>
                                                setEditOrder(
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    ) : (
                                        d.display_order
                                    )}
                                </td>
                                <td>
                                    {editingId === d.id ? (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    handleUpdate(d.id)
                                                }
                                            >
                                                Сохранить
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                            >
                                                Отмена
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="secondary"
                                                onClick={() => startEdit(d)}
                                            >
                                                Ред.
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    handleDelete(d.id)
                                                }
                                            >
                                                Удалить
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
