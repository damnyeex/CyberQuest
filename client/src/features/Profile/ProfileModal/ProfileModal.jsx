"use client";

import React, { useState, useEffect } from "react";
import * as styles from "./ProfileModal.module.scss";
import Modal from "@/shared/UI/Modal/Modal";
import Button from "@/shared/UI/Button/Button";
import { userApi } from "@/shared/api/index";
import { useApp } from "@/providers/AppProvider";
import {
    FaUser,
    FaEnvelope,
    FaTrophy,
    FaShieldAlt,
    FaCheckCircle,
} from "react-icons/fa";

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, showNotification } = useApp();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchProfile();
        }
    }, [isOpen, user]);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const response = await userApi.getMe();
            setProfile(response.data);
        } catch (err) {
            showNotification("Ошибка загрузки профиля", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Профиль"
            maxWidth="500px"
        >
            {isLoading ? (
                <p className={styles.loading}>Загрузка...</p>
            ) : profile ? (
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.nickname}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                <FaUser />
                            </div>
                        )}
                    </div>

                    <h2 className={styles.nickname}>{profile.nickname}</h2>

                    <div className={styles.info}>
                        <div className={styles.infoRow}>
                            <FaEnvelope />
                            <span>{profile.email}</span>
                        </div>
                        {profile.first_name && profile.last_name && (
                            <div className={styles.infoRow}>
                                <FaUser />
                                <span>
                                    {profile.first_name} {profile.last_name}
                                </span>
                            </div>
                        )}
                        <div className={styles.infoRow}>
                            <FaTrophy />
                            <span>{profile.total_xp} XP</span>
                        </div>
                        <div className={styles.infoRow}>
                            <FaShieldAlt />
                            <div className={styles.roles}>
                                {profile.roles?.map((role) => (
                                    <span key={role} className={styles.role}>
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.infoRow}>
                            <FaCheckCircle />
                            <span>
                                {profile.is_verified
                                    ? "Верифицирован"
                                    : "Не верифицирован"}
                            </span>
                        </div>
                    </div>

                    <Button variant="secondary" fullWidth onClick={onClose}>
                        Закрыть
                    </Button>
                </div>
            ) : (
                <p>Не удалось загрузить профиль</p>
            )}
        </Modal>
    );
};

export default ProfileModal;
