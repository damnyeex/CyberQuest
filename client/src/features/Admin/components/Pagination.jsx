import React from "react";
import * as styles from "../AdminComp/AdminComp.module.scss";

export default function Pagination({
    totalPages,
    currentPage,
    setCurrentPage,
}) {
    return (
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
    );
}
