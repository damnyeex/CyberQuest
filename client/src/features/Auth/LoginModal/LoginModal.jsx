"use client";

import React, { useState } from "react";
import Link from "next/link";
import * as login from "./LoginModal.module.scss";
import Modal from "@/shared/UI/Modal/Modal";
import Button from "@/shared/UI/Button/Button";
import { authApi } from "@/shared/api/index";

const LoginModal = ({ isOpen, onClose, onLogin, showNotification }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Заполните все поля");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await authApi.login({
                email: email.trim(),
                password,
            });

            if (response.data.token && response.data.user) {
                onLogin(response.data.token, response.data.user);
            } else {
                throw new Error("Некорректный ответ сервера");
            }
        } catch (err) {
            console.error("Login error:", err);
            const message =
                err.response?.data?.error ||
                err.message ||
                "Ошибка входа. Проверьте данные.";
            setError(message);
            showNotification(message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Вход в CyberQuest"
            maxWidth="500px"
        >
            <p className={login.subtitle}>Введите данные для входа в аккаунт</p>

            {error && <div className={login.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className={login.formGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className={login.formGroup}>
                    <label>Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className={login.formOptions}>
                    <label>
                        <input type="checkbox" /> Запомнить меня
                    </label>
                    <Link href="/auth/forgot-password" onClick={onClose}>
                        Забыли пароль?
                    </Link>
                </div>
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Вход..." : "Войти"}
                </Button>
                <p className={login.signupLink}>
                    Нет аккаунта?{" "}
                    <Link href="/auth/register" onClick={onClose}>
                        Зарегистрироваться
                    </Link>
                </p>
            </form>
        </Modal>
    );
};

export default LoginModal;
