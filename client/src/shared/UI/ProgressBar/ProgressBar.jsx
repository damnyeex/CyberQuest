import React from "react";
import * as styles from "./ProgressBar.module.scss";

const ProgressBar = ({ progress }) => {
    return (
        <div className={styles.progressBar}>
            <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ProgressBar;
