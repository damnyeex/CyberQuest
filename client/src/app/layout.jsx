import { Orbitron, Roboto } from "next/font/google";
import "@/shared/styles/global.scss";
import Header from "@/widgets/Header/Header";
import Footer from "@/widgets/Footer/Footer";
import MobileNav from "@/widgets/MobileNav/MobileNav";
import AppProvider from "@/providers/AppProvider";

const orbitron = Orbitron({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-orbitron",
    display: "swap",
});

const roboto = Roboto({
    subsets: ["latin", "cyrillic"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-roboto",
    display: "swap",
});

export default function RootLayout({ children }) {
    return (
        <html lang="ru" className={`${orbitron.variable} ${roboto.variable}`}>
            <body>
                <AppProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                    <MobileNav />
                </AppProvider>
            </body>
        </html>
    );
}
