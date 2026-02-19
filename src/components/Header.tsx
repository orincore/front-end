"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("vle_token");
        const user = localStorage.getItem("vle_user");

        if (token && user) {
            setIsLoggedIn(true);
            try {
                const userData = JSON.parse(user);
                setUserName(userData.name || "User");
            } catch (e) {
                setUserName("User");
            }
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("vle_token");
        localStorage.removeItem("vle_user");
        setIsLoggedIn(false);
        router.push("/");
    };

    // Different nav links based on login status
    const navLinks = isLoggedIn
        ? [
            { href: "/dashboard", label: "Dashboard" },
            { href: "/my-learning", label: "My Learning" },
            { href: "/roadmaps", label: "Explore" },
            { href: "/cv-builder", label: "CV Builder" },
        ]
        : [
            { href: "/", label: "Home" },
            { href: "/roadmaps", label: "Explore" },
        ];

    return (
        <nav className="fixed top-0 w-full h-20 px-8 flex items-center justify-between z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10">
            <Link href="/" className="text-2xl font-black text-white tracking-tight hover:text-[#ffd700] transition-colors">
                VLE
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm font-medium transition-colors ${pathname === link.href
                                ? "text-[#ffd700]"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}

                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                            <User size={16} className="text-[#ffd700]" />
                            <span className="text-sm text-white">{userName}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/20"
                        >
                            <LogOut size={16} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-[#ffd700] text-[#0f172a] px-6 py-2 rounded-lg font-bold hover:bg-[#ffed4e] transition-all text-sm"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 md:hidden">
                    <div className="flex flex-col p-6 space-y-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-base font-medium transition-colors ${pathname === link.href
                                        ? "text-[#ffd700]"
                                        : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {isLoggedIn ? (
                            <>
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-white mb-4">
                                        <User size={16} className="text-[#ffd700]" />
                                        <span className="text-sm">{userName}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/20"
                                    >
                                        <LogOut size={16} />
                                        <span className="text-sm font-medium">Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-4 border-t border-white/10 space-y-3">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-center bg-[#ffd700] text-[#0f172a] px-6 py-2 rounded-lg font-bold hover:bg-[#ffed4e] transition-all text-sm"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
