"use client";

import React from "react";
import * as styles from "./ProfileModal.module.scss";
import Modal from "@/shared/UI/Modal/Modal";
import Button from "@/shared/UI/Button/Button";
import { useApp } from "@/providers/AppProvider";
import {
    FaUser,
    FaEnvelope,
    FaTrophy,
    FaShieldAlt,
    FaCheckCircle,
} from "react-icons/fa";

const ProfileModal = ({ isOpen, onClose }) => {
    const { user } = useApp();

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Профиль"
            maxWidth="500px"
        >
            <div className={styles.profile}>
                <div className={styles.avatar}>
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.nickname} />
                    ) : (
                        <div className={styles.avatarPlaceholder}>
                            <FaUser />
                        </div>
                    )}
                </div>

                <h2 className={styles.nickname}>{user.nickname}</h2>

                <div className={styles.info}>
                    <div className={styles.infoRow}>
                        <FaEnvelope />
                        <span>{user.email}</span>
                    </div>
                    {user.first_name && user.last_name && (
                        <div className={styles.infoRow}>
                            <FaUser />
                            <span>
                                {user.first_name} {user.last_name}
                            </span>
                        </div>
                    )}
                    <div className={styles.infoRow}>
                        <FaTrophy />
                        <span>{user.total_xp} XP</span>
                    </div>
                    <div className={styles.infoRow}>
                        <FaShieldAlt />
                        <div className={styles.roles}>
                            {user.roles?.map((role) => (
                                <span key={role} className={styles.role}>
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className={styles.infoRow}>
                        <FaCheckCircle />
                        <span>
                            {user.is_verified
                                ? "Верифицирован"
                                : "Не верифицирован"}
                        </span>
                    </div>
                </div>

                <Button variant="secondary" fullWidth onClick={onClose}>
                    Закрыть
                </Button>
            </div>
        </Modal>
    );
};

export default ProfileModal;
