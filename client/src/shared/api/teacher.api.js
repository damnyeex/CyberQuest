import { $authHost } from "./client";

export const teacherApi = {
    /** Создать группу */
    createGroup: (name) => $authHost.post("/teacher/groups", { name }),

    /** Добавить студента в группу */
    addStudentToGroup: (groupId, studentId) =>
        $authHost.post(`/teacher/groups/${groupId}/add_student`, {
            student_id: studentId,
        }),

    /** Назначить задание группе */
    assignTask: (groupId, taskSlug, deadline) =>
        $authHost.post(`/teacher/groups/${groupId}/assign-task`, {
            task_slug: taskSlug,
            deadline,
        }),

    /** Посмотреть прогресс студента (учитель) */
    viewStudentProgress: (studentId) =>
        $authHost.get(`/teacher/students/${studentId}/progress`),
};
