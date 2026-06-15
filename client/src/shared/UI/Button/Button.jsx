import React from "react";
import * as styles from "./Button.module.scss";

const Button = ({
    children,
    variant = "primary",
    fullWidth,
    mb15,
    ...props
}) => {
    const className = `${styles.btn} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""} ${mb15 ? styles.mb15 : ""}`;
    return (
        <button className={className} {...props}>
            {children}
        </button>
    );
};

export default Button;
