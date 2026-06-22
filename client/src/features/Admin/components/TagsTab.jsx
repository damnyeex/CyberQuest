"use client";

import React, { useState } from "react";
import * as styles from "../AdminComp/AdminComp.module.scss";
import Button from "@/shared/UI/Button/Button";
import { adminApi } from "@/shared/api/index";
import { useApp } from "@/providers/AppProvider";

export default function TagsTab({ tags, setTags }) {
    const { showNotification } = useApp();
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState("#000000");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editColor, setEditColor] = useState("#000000");

    const fetchTags = async () => {
        try {
            const { data } = await adminApi.getAllTags();
            setTags(data);
        } catch (err) {
            showNotification("Ошибка загрузки тегов", "error");
        }
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        try {
            await adminApi.createTag({
                name: newName.trim(),
                color_hex: newColor,
            });
            showNotification("Тег создан", "success");
            setNewName("");
            setNewColor("#000000");
            fetchTags();
        } catch (err) {
            showNotification("Ошибка создания тега", "error");
        }
    };

    const startEdit = (t) => {
        setEditingId(t.id);
        setEditName(t.name);
        setEditColor(t.color_hex || "#000000");
    };

    const handleUpdate = async (id) => {
        try {
            await adminApi.updateTag(id, {
                name: editName,
                color_hex: editColor,
            });
            showNotification("Тег обновлён", "success");
            setEditingId(null);
            fetchTags();
        } catch (err) {
            showNotification("Ошибка обновления тега", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Удалить тег?")) return;
        try {
            await adminApi.deleteTag(id);
            showNotification("Тег удалён", "success");
            fetchTags();
        } catch (err) {
            showNotification("Ошибка удаления тега", "error");
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
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
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
                            <th>Цвет</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tags.map((t) => (
                            <tr key={t.id} className={styles.tableRow}>
                                <td>{t.id}</td>
                                <td>
                                    {editingId === t.id ? (
                                        <input
                                            value={editName}
                                            onChange={(e) =>
                                                setEditName(e.target.value)
                                            }
                                        />
                                    ) : (
                                        t.name
                                    )}
                                </td>
                                <td>
                                    {editingId === t.id ? (
                                        <input
                                            type="color"
                                            value={editColor}
                                            onChange={(e) =>
                                                setEditColor(e.target.value)
                                            }
                                        />
                                    ) : (
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: 20,
                                                height: 20,
                                                background: t.color_hex,
                                                borderRadius: 4,
                                            }}
                                        />
                                    )}
                                </td>
                                <td>
                                    {editingId === t.id ? (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    handleUpdate(t.id)
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
                                                onClick={() => startEdit(t)}
                                            >
                                                Ред.
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    handleDelete(t.id)
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
