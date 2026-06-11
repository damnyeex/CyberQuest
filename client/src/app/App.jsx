import React, { useState } from "react";
import Header from "@/widgets/Header/Header";
import Footer from "@/widgets/Footer/Footer";
import MobileNav from "@/widgets/MobileNav/MobileNav";
import HomePage from "@/pages/HomePage/HomePage";
import CoursesPage from "@/pages/CoursesPage/CoursesPage";
import DashboardPage from "@/pages/DashboardPage/DashboardPage";
import CourseIntroPage from "@/pages/CourseIntroPage/CourseIntroPage";
import LoginModal from "@/features/Auth/LoginModal/LoginModal";
import CTFPage from "@/pages/CTFPage/CTFPage";
import Notification from "@/features/Notification/Notification";

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const renderPage = () => {
        switch (currentPage) {
            case "home":
                return <HomePage />;
            case "courses":
                return <CoursesPage />;
            case "dashboard":
                return <DashboardPage />;
            case "ctf":
                return <CTFPage showNotification={showNotification} />;
            case "course-intro":
                return <CourseIntroPage showNotification={showNotification} />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="App">
            <Header
                setCurrentPage={setCurrentPage}
                onLoginClick={() => setLoginModalOpen(true)}
                currentPage={currentPage}
            />
            <main>{renderPage()}</main>
            <Footer />
            <MobileNav
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
            />
            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                showNotification={showNotification}
            />
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
}

export default App;
