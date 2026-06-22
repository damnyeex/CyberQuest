"use client";

import React, { useState } from "react";
import * as styles from "../AdminComp/AdminComp.module.scss";
import Button from "@/shared/UI/Button/Button";
import { adminApi } from "@/shared/api/index";
import { useApp } from "@/providers/AppProvider";

export default function CategoriesTab({ categories, setCategories }) {
    const { showNotification } = useApp();
    const [newName, setNewName] = useState("");
    const [newDisplay, setNewDisplay] = useState("");
    const [newColor, setNewColor] = useState("#000000");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDisplay, setEditDisplay] = useState("");
    const [editColor, setEditColor] = useState("#000000");

    const fetchCategories = async () => {
        try {
            const { data } = await adminApi.getAllCategories();
            setCategories(data);
        } catch (err) {
            showNotification("Ошибка загрузки категорий", "error");
        }
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        try {
            await adminApi.createCategory({
                name: newName.trim(),
                display_name: newDisplay || newName,
                color_hex: newColor,
            });
            showNotification("Категория создана", "success");
            setNewName("");
            setNewDisplay("");
            setNewColor("#000000");
            fetchCategories();
        } catch (err) {
            showNotification("Ошибка создания категории", "error");
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setEditName(cat.name);
        setEditDisplay(cat.display_name || cat.name);
        setEditColor(cat.color_hex || "#000000");
    };

    const handleUpdate = async (id) => {
        try {
            await adminApi.updateCategory(id, {
                name: editName,
                display_name: editDisplay,
                color_hex: editColor,
            });
            showNotification("Категория обновлена", "success");
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            showNotification("Ошибка обновления категории", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Удалить категорию?")) return;
        try {
            await adminApi.deleteCategory(id);
            showNotification("Категория удалена", "success");
            fetchCategories();
        } catch (err) {
            showNotification("Ошибка удаления категории", "error");
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
                    placeholder="Отображаемое имя"
                    value={newDisplay}
                    onChange={(e) => setNewDisplay(e.target.value)}
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
                            <th>Отображение</th>
                            <th>Цвет</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} className={styles.tableRow}>
                                <td>{cat.id}</td>
                                <td>
                                    {editingId === cat.id ? (
                                        <input
                                            value={editName}
                                            onChange={(e) =>
                                                setEditName(e.target.value)
                                            }
                                        />
                                    ) : (
                                        cat.name
                                    )}
                                </td>
                                <td>
                                    {editingId === cat.id ? (
                                        <input
                                            value={editDisplay}
                                            onChange={(e) =>
                                                setEditDisplay(e.target.value)
                                            }
                                        />
                                    ) : (
                                        cat.display_name
                                    )}
                                </td>
                                <td>
                                    {editingId === cat.id ? (
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
                                                background: cat.color_hex,
                                                borderRadius: 4,
                                            }}
                                        />
                                    )}
                                </td>
                                <td>
                                    {editingId === cat.id ? (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    handleUpdate(cat.id)
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
                                                onClick={() => startEdit(cat)}
                                            >
                                                Ред.
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    handleDelete(cat.id)
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
