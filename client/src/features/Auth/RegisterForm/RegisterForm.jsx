"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as styles from "./RegisterForm.module.scss";
import Button from "@/shared/UI/Button/Button";
import { authApi } from "@/shared/api/index";
import { useApp } from "@/providers/AppProvider";

const RegisterForm = () => {
    const router = useRouter();
    const { login } = useApp();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        firstName: "",
        lastName: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        if (formData.password.length < 6) {
            setError("Пароль должен быть не менее 6 символов");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await authApi.register({
                email: formData.email,
                password: formData.password,
                nickname: formData.nickname || formData.email.split("@")[0],
                first_name: formData.firstName,
                last_name: formData.lastName,
            });
            login(response.data.token, response.data.user);
            router.push("/dashboard");
        } catch (err) {
            const message = err.response?.data?.error || "Ошибка регистрации";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.registerPage}>
            <div className="container">
                <div className={styles.registerForm}>
                    <h1>Регистрация</h1>
                    <p>Создайте аккаунт для доступа к платформе</p>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Имя</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Иван"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Фамилия</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Иванов"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Никнейм</label>
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="cyber_hunter"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Пароль *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Не менее 6 символов"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Подтверждение пароля *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Повторите пароль"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Регистрация..."
                                : "Зарегистрироваться"}
                        </Button>

                        <p className={styles.loginLink}>
                            Уже есть аккаунт?{" "}
                            <Link href="/?login=true">Войти</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
