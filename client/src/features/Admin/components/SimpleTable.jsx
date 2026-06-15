import React from "react";
import * as styles from "../AdminComp/AdminComp.module.scss";

export default function SimpleTable({ data, columns }) {
    if (!data.length) return <p className={styles.loading}>Нет данных</p>;
    return (
        <div className={styles.usersTable}>
            <table className={styles.table}>
                <thead className={styles.tableHead}>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className={styles.tableRow}>
                            {columns.map((col) => (
                                <td key={col}>{item[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
