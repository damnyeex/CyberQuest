import React, { useState } from "react";
import styles from "./LoginModal.module.scss";
import Button from "../../../shared/UI/Button/Button";

const LoginModal = ({ isOpen, onClose, showNotification }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onClose();
        showNotification("Вход выполнен успешно!", "success");
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    &times;
                </button>
                <h3>Вход в CyberQuest</h3>
                <p>Введите данные для входа в аккаунт</p>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formOptions}>
                        <label>
                            <input type="checkbox" /> Запомнить меня
                        </label>
                        <a href="#">Забыли пароль?</a>
                    </div>
                    <Button type="submit" variant="primary" fullWidth>
                        Войти
                    </Button>
                    <p className={styles.signupLink}>
                        Нет аккаунта? <a href="#">Зарегистрироваться</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
