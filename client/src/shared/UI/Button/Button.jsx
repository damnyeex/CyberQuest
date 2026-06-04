import React from "react";
import * as styles from "./Button.module.scss";

const Button = ({ children, variant = "primary", fullWidth, ...props }) => {
    const className = `${styles.btn} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""}`;
    return (
        <button className={className} {...props}>
            {children}
        </button>
    );
};

export default Button;
