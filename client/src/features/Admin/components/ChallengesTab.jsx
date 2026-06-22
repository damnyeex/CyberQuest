"use client";

import React, { useState, useEffect } from "react";
import * as styles from "../AdminComp/AdminComp.module.scss";
import Button from "@/shared/UI/Button/Button";
import { adminApi } from "@/shared/api/index";
import { useApp } from "@/providers/AppProvider";
import Pagination from "@/features/Admin/Components/Pagination";

export default function ChallengesTab({
    challenges,
    setChallenges,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchChallenges,
}) {
    const { showNotification } = useApp();
    const [editingId, setEditingId] = useState(null);

    // Поля редактирования
    const [editTitle, setEditTitle] = useState("");
    const [editSlug, setEditSlug] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCategoryId, setEditCategoryId] = useState("");
    const [editDifficultyId, setEditDifficultyId] = useState("");
    const [editXp, setEditXp] = useState(100);
    const [editStatus, setEditStatus] = useState("draft");
    const [editFlag, setEditFlag] = useState("");

    // Поля создания
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newSlug, setNewSlug] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newCategoryId, setNewCategoryId] = useState("");
    const [newDifficultyId, setNewDifficultyId] = useState("");
    const [newXp, setNewXp] = useState(100);
    const [newStatus, setNewStatus] = useState("draft");
    const [newFlag, setNewFlag] = useState("");

    // Справочники
    const [categories, setCategories] = useState([]);
    const [difficulties, setDifficulties] = useState([]);

    useEffect(() => {
        adminApi
            .getAllCategories()
            .then(({ data }) => setCategories(data))
            .catch(() => {});
        adminApi
            .getAllDifficulties()
            .then(({ data }) => setDifficulties(data))
            .catch(() => {});
    }, []);

    const startEdit = (ch) => {
        setEditingId(ch.id);
        setEditTitle(ch.title);
        setEditSlug(ch.slug);
        setEditDescription(ch.description);
        setEditCategoryId(ch.category_id ?? "");
        setEditDifficultyId(ch.difficulty_id ?? "");
        setEditXp(ch.base_xp);
        setEditStatus(ch.status);
        setEditFlag("");
    };

    const handleUpdate = async (id) => {
        try {
            await adminApi.updateChallenge(id, {
                title: editTitle,
                slug: editSlug,
                description: editDescription,
                category_id: editCategoryId
                    ? Number(editCategoryId)
                    : undefined,
                difficulty_id: editDifficultyId
                    ? Number(editDifficultyId)
                    : undefined,
                base_xp: editXp,
                status: editStatus,
                ...(editFlag ? { flag: editFlag } : {}),
            });
            showNotification("Задача обновлена", "success");
            setEditingId(null);
            fetchChallenges(currentPage);
        } catch (err) {
            showNotification("Ошибка обновления задачи", "error");
        }
    };

    const handleCreate = async () => {
        if (
            !newTitle.trim() ||
            !newSlug.trim() ||
            !newCategoryId ||
            !newDifficultyId ||
            !newFlag.trim()
        ) {
            showNotification("Заполните обязательные поля", "error");
            return;
        }
        try {
            await adminApi.createChallenge({
                title: newTitle.trim(),
                slug: newSlug.trim(),
                description: newDescription,
                category_id: Number(newCategoryId),
                difficulty_id: Number(newDifficultyId),
                base_xp: newXp,
                status: newStatus,
                flag: newFlag.trim(),
            });
            showNotification("Задача создана", "success");
            setShowCreateForm(false);
            setNewTitle("");
            setNewSlug("");
            setNewDescription("");
            setNewCategoryId("");
            setNewDifficultyId("");
            setNewXp(100);
            setNewStatus("draft");
            setNewFlag("");
            fetchChallenges(currentPage);
        } catch (err) {
            showNotification("Ошибка создания задачи", "error");
        }
    };

    const deleteChallenge = async (id) => {
        if (!confirm("Удалить задачу навсегда?")) return;
        try {
            await adminApi.deleteChallenge(id);
            showNotification("Задача удалена", "success");
            fetchChallenges(currentPage);
        } catch (err) {
            showNotification("Ошибка удаления задачи", "error");
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button
                    variant="primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? "Отменить создание" : "Создать задачу"}
                </Button>
            </div>

            {showCreateForm && (
                <div className={styles.inlineForm}>
                    <input
                        placeholder="Название"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <input
                        placeholder="Slug"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                    />
                    <textarea
                        placeholder="Описание"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        rows={2}
                    />
                    <select
                        value={newCategoryId}
                        onChange={(e) => setNewCategoryId(e.target.value)}
                    >
                        <option value="">Категория</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.display_name || c.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={newDifficultyId}
                        onChange={(e) => setNewDifficultyId(e.target.value)}
                    >
                        <option value="">Сложность</option>
                        {difficulties.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.display_name || d.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="XP"
                        value={newXp}
                        onChange={(e) => setNewXp(Number(e.target.value))}
                    />
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        <option value="draft">draft</option>
                        <option value="published">published</option>
                        <option value="archived">archived</option>
                    </select>
                    <input
                        placeholder="Флаг (CyberQuest{...})"
                        value={newFlag}
                        onChange={(e) => setNewFlag(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleCreate}>
                        Создать
                    </Button>
                </div>
            )}

            <div className={styles.usersTable}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Slug</th>
                            <th>Категория</th>
                            <th>Сложность</th>
                            <th>XP</th>
                            <th>Статус</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {challenges.map((ch) => (
                            <tr key={ch.id} className={styles.tableRow}>
                                <td>{ch.id}</td>
                                <td>
                                    {editingId === ch.id ? (
                                        <input
                                            value={editTitle}
                                            onChange={(e) =>
                                                setEditTitle(e.target.value)
                                            }
                                        />
                                    ) : (
                                        ch.title
                                    )}
                                </td>
                                <td>
                                    {editingId === ch.id ? (
                                        <input
                                            value={editSlug}
                                            onChange={(e) =>
                                                setEditSlug(e.target.value)
                                            }
                                        />
                                    ) : (
                                        ch.slug
                                    )}
                                </td>
                                <td>
                                    {editingId === ch.id ? (
                                        <select
                                            value={editCategoryId}
                                            onChange={(e) =>
                                                setEditCategoryId(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">—</option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.display_name || c.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        ch.category_display || ch.category
                                    )}
                                </td>
                                <td>
                                    {editingId === ch.id ? (
                                        <select
                                            value={editDifficultyId}
                                            onChange={(e) =>
                                                setEditDifficultyId(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">—</option>
                                            {difficulties.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.display_name || d.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        ch.difficulty_display || ch.difficulty
                                    )}
                                </td>
                                <td>
                                    {editingId === ch.id ? (
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
                                        ch.base_xp
                                    )}
                                </td>
                                <td>
                                    {editingId === ch.id ? (
                                        <select
                                            value={editStatus}
                                            onChange={(e) =>
                                                setEditStatus(e.target.value)
                                            }
                                        >
                                            <option value="draft">draft</option>
                                            <option value="published">
                                                published
                                            </option>
                                            <option value="archived">
                                                archived
                                            </option>
                                        </select>
                                    ) : (
                                        ch.status
                                    )}
                                </td>
                                <td>
                                    {editingId === ch.id ? (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    handleUpdate(ch.id)
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
                                                onClick={() => startEdit(ch)}
                                            >
                                                Ред.
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    deleteChallenge(ch.id)
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
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
