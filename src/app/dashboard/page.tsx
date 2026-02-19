"use client";

import { useState, useEffect } from "react";
import { Loader2, Lock, TrendingUp, BookOpen, Award } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Header from "@/components/Header";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [progress, setProgress] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("vle_token");
            if (!token) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            const userData: any = await api.get("/auth/me");
            setUser(userData);
            setIsLoggedIn(true);

            // Fetch user progress
            try {
                const progressData: any = await api.get("/roadmaps/my-progress");
                setProgress(progressData);
            } catch (err) {
                console.error("Failed to fetch progress:", err);
            }
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setIsLoggedIn(false);
            localStorage.removeItem("vle_token");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center pt-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ffd700]" />
                </div>
            </>
        );
    }

    // Not logged in - show login prompt
    if (!isLoggedIn) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center p-8 pt-20">
                    <div className="max-w-2xl text-center">
                        <div className="mb-8">
                            <Lock className="w-20 h-20 text-[#ffd700] mx-auto mb-6" />
                            <h1 className="text-5xl font-bold text-white mb-4">Dashboard Locked</h1>
                            <p className="text-xl text-gray-300 mb-8">
                                Sign in to access your personalized learning dashboard, track your progress, and unlock verified skills.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <TrendingUp className="w-8 h-8 text-[#ffd700] mx-auto mb-3" />
                                <h3 className="text-white font-semibold mb-2">Track Progress</h3>
                                <p className="text-sm text-gray-400">Monitor your learning journey</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <BookOpen className="w-8 h-8 text-[#ffd700] mx-auto mb-3" />
                                <h3 className="text-white font-semibold mb-2">Personalized Learning</h3>
                                <p className="text-sm text-gray-400">Your selected roadmaps</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <Award className="w-8 h-8 text-[#ffd700] mx-auto mb-3" />
                                <h3 className="text-white font-semibold mb-2">Verify Skills</h3>
                                <p className="text-sm text-gray-400">Earn verified credentials</p>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/login"
                                className="bg-[#ffd700] text-[#0f172a] px-8 py-3 rounded-lg font-bold hover:bg-[#ffed4e] transition-all"
                            >
                                Login to Dashboard
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-white/5 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all border border-white/10"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Logged in - show dashboard
    const totalNodes = progress?.roadmaps?.reduce((sum: number, r: any) => sum + (r.total_nodes || 0), 0) || 0;
    const completedNodes = progress?.roadmaps?.reduce((sum: number, r: any) => sum + (r.completed_nodes || 0), 0) || 0;

    return (
        <>
            <Header />
            <div className="min-h-screen p-8 pt-28">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
                        <p className="text-gray-400">Continue your verified learning journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <h3 className="text-gray-400 text-sm mb-2">Skills Completed</h3>
                            <p className="text-4xl font-bold text-[#ffd700]">{completedNodes}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <h3 className="text-gray-400 text-sm mb-2">In Progress</h3>
                            <p className="text-4xl font-bold text-white">{totalNodes - completedNodes}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <h3 className="text-gray-400 text-sm mb-2">Active Roadmaps</h3>
                            <p className="text-4xl font-bold text-white">{progress?.roadmaps?.length || 0}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            href="/my-learning"
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#ffd700]/50 transition-all"
                        >
                            <h3 className="text-2xl font-bold text-white mb-2">📚 My Learning</h3>
                            <p className="text-gray-400">Continue your selected roadmaps</p>
                        </Link>

                        <Link
                            href="/explore"
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#ffd700]/50 transition-all"
                        >
                            <h3 className="text-2xl font-bold text-white mb-2">🎯 Explore Skills</h3>
                            <p className="text-gray-400">Browse individual skills and verify</p>
                        </Link>

                        <Link
                            href="/cv-builder"
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#ffd700]/50 transition-all"
                        >
                            <h3 className="text-2xl font-bold text-white mb-2">📄 CV Builder</h3>
                            <p className="text-gray-400">Generate your verified skills resume</p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
