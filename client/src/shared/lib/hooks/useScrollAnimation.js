"use client";

import { useEffect, useRef } from "react";

/**
 * Хук для запуска анимации при появлении элемента в области видимости.
 * @param {Object} options - настройки IntersectionObserver
 * @param {number} options.threshold - порог видимости (0-1)
 * @param {string} options.rootMargin - отступы для observer
 * @param {string} options.animationClass - класс, добавляемый при появлении
 * @returns {React.RefObject} ref - реф, который нужно прикрепить к элементу
 */
export function useScrollAnimation(options = {}) {
    const {
        threshold = 0.1,
        rootMargin = "0px 0px -50px 0px",
        animationClass = "fade-in-visible",
    } = options;

    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(animationClass);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold, rootMargin },
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, animationClass]);

    return ref;
}
