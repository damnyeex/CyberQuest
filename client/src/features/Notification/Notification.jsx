import React, { useEffect } from "react";
import * as styles from "./Notification.module.scss";
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaInfoCircle,
} from "react-icons/fa";

const Notification = ({ message, type = "info", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: FaCheckCircle,
        error: FaExclamationCircle,
        info: FaInfoCircle,
    };
    const Icon = icons[type] || FaInfoCircle;

    return (
        <div className={`${styles.notification} ${styles[type]}`}>
            <Icon />
            <div>
                <h4>
                    {type === "success"
                        ? "Успешно!"
                        : type === "error"
                          ? "Ошибка!"
                          : "Информация"}
                </h4>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Notification;
