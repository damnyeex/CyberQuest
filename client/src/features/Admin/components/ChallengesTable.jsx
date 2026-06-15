import React from "react";
import * as styles from "../AdminComp/AdminComp.module.scss";
import Button from "@/shared/UI/Button/Button";
import Pagination from "@/features/Admin/Components/Pagination";

export default function ChallengesTable({
    challenges,
    totalPages,
    currentPage,
    setCurrentPage,
    deleteChallenge,
}) {
    return (
        <>
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
                                <td>{ch.title}</td>
                                <td>{ch.slug}</td>
                                <td>{ch.category_display}</td>
                                <td>{ch.difficulty_display}</td>
                                <td>{ch.base_xp}</td>
                                <td>{ch.status}</td>
                                <td>
                                    <Button
                                        variant="secondary"
                                        onClick={() => deleteChallenge(ch.id)}
                                    >
                                        Удалить
                                    </Button>
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
        </>
    );
}
