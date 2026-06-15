import React from "react";
import * as styles from "../AdminComp/AdminComp.module.scss";
import Button from "@/shared/UI/Button/Button";
import Pagination from "@/features/Admin/Components/Pagination";

const ALL_ROLES = ["student", "teacher", "admin"];

export default function UsersTable({
    users,
    totalPages,
    currentPage,
    setCurrentPage,
    selectedUserId,
    setSelectedUserId,
    xpDelta,
    setXpDelta,
    editingRoles,
    handleUpdateUser,
    handleAdjustXp,
    handleRestoreUser,
    handleRoleChange,
    saveRoles,
}) {
    return (
        <>
            <div className={styles.usersTable}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th className={styles.colId}>ID</th>
                            <th className={styles.colEmail}>Email</th>
                            <th className={styles.colNick}>Ник</th>
                            <th className={styles.colXp}>XP</th>
                            <th className={styles.colRoles}>Роль</th>
                            <th className={styles.colStatus}>Активен</th>
                            <th className={styles.colActions}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <React.Fragment key={user.id}>
                                <tr className={styles.tableRow}>
                                    <td className={styles.colId}>{user.id}</td>
                                    <td className={styles.colEmail}>
                                        {user.email}
                                    </td>
                                    <td className={styles.colNick}>
                                        {user.nickname}
                                    </td>
                                    <td className={styles.colXp}>
                                        {user.total_xp}
                                    </td>
                                    <td className={styles.colRoles}>
                                        {editingRoles[user.id] !== undefined ? (
                                            <div className={styles.rolesEdit}>
                                                {ALL_ROLES.map((role) => (
                                                    <label
                                                        key={role}
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 4,
                                                            marginRight: 12,
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`role-${user.id}`}
                                                            value={role}
                                                            checked={
                                                                editingRoles[
                                                                    user.id
                                                                ] === role
                                                            }
                                                            onChange={() =>
                                                                handleRoleChange(
                                                                    user.id,
                                                                    role,
                                                                )
                                                            }
                                                        />
                                                        {role}
                                                    </label>
                                                ))}
                                                <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                        saveRoles(user.id)
                                                    }
                                                >
                                                    Сохранить
                                                </Button>
                                            </div>
                                        ) : (
                                            <span
                                                onClick={() =>
                                                    handleRoleChange(
                                                        user.id,
                                                        user.roles?.[0] || "",
                                                    )
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                    textDecoration: "underline",
                                                }}
                                            >
                                                {user.roles?.join(", ") || "—"}
                                            </span>
                                        )}
                                    </td>
                                    <td className={styles.colStatus}>
                                        {user.is_active ? "Да" : "Нет"}
                                    </td>
                                    <td className={styles.colActions}>
                                        <div className={styles.rowActions}>
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
                                                    handleUpdateUser(user.id, {
                                                        is_active:
                                                            !user.is_active,
                                                    })
                                                }
                                            >
                                                {user.is_active
                                                    ? "Блок"
                                                    : "Разблок"}
                                            </Button>
                                            {user.deleted_at ? (
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        handleRestoreUser(
                                                            user.id,
                                                        )
                                                    }
                                                >
                                                    Восстановить
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        handleUpdateUser(
                                                            user.id,
                                                            { delete: true },
                                                        )
                                                    }
                                                >
                                                    Удалить
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                {selectedUserId === user.id && (
                                    <tr key={`xp-${user.id}`}>
                                        <td colSpan={7} style={{ padding: 0 }}>
                                            <div className={styles.xpModal}>
                                                <input
                                                    type="number"
                                                    value={xpDelta}
                                                    onChange={(e) =>
                                                        setXpDelta(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    placeholder="+/- XP"
                                                />
                                                <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                        handleAdjustXp(user.id)
                                                    }
                                                >
                                                    Применить
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        setSelectedUserId(null)
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
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </>
    );
}
