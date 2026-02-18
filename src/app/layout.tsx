import type { Metadata } from "next";
import "./globals.css";
import LiquidBackground from "@/components/LiquidBackground";

export const metadata: Metadata = {
    title: "VLE - Verified Learning Engine",
    description: "Stop Tracking What You Watch. Start Verifying What You Can Do.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <LiquidBackground />
                {children}
            </body>
        </html>
    );
}
