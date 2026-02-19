"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Loader2, BookOpen, Clock, CheckCircle, ArrowRight } from "lucide-react";
import Header from "@/components/Header";

interface UserRoadmap {
    id: number;
    name: string;
    description: string;
    icon: string;
    category: string;
    started_at: string;
    last_accessed: string;
    total_nodes: number;
    completed_nodes: number;
}

export default function MyLearningPage() {
    const [roadmaps, setRoadmaps] = useState<UserRoadmap[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkAuthAndFetch();
    }, []);

    const checkAuthAndFetch = async () => {
        try {
            const token = localStorage.getItem("vle_token");
            if (!token) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            setIsLoggedIn(true);
            const data: any = await api.get("/roadmaps/my-progress");
            setRoadmaps(data.roadmaps || []);
        } catch (err: any) {
            console.error("Failed to fetch learning progress:", err);
            if (err.message.includes("401") || err.message.includes("403")) {
                setIsLoggedIn(false);
                localStorage.removeItem("vle_token");
            }
        } finally {
            setLoading(false);
        }
    };

    const getProgressPercentage = (roadmap: UserRoadmap) => {
        if (roadmap.total_nodes === 0) return 0;
        return Math.round((roadmap.completed_nodes / roadmap.total_nodes) * 100);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

    // Not logged in
    if (!isLoggedIn) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center p-8 pt-20">
                    <div className="max-w-md text-center">
                        <BookOpen className="w-16 h-16 text-[#ffd700] mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-4">Login Required</h1>
                        <p className="text-gray-400 mb-6">
                            Please login to access your personalized learning dashboard.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/login"
                                className="bg-[#ffd700] text-[#0f172a] px-6 py-3 rounded-lg font-bold hover:bg-[#ffed4e] transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-white/5 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-all border border-white/10"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // No roadmaps started
    if (roadmaps.length === 0) {
        return (
            <>
                <Header />
                <div className="min-h-screen p-8 pt-28">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">My Learning</h1>
                    
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                        <BookOpen className="w-16 h-16 text-[#ffd700] mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">No Learning Paths Started</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Browse skills in the Explore page and start your learning journey. Track your progress and earn verified skills.
                        </p>
                        <Link
                            href="/explore"
                            className="inline-flex items-center gap-2 bg-[#ffd700] text-[#0f172a] px-8 py-3 rounded-lg font-bold hover:bg-[#ffed4e] transition-all"
                        >
                            Explore Skills
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
                </div>
            </>
        );
    }

    // Show user's roadmaps
    return (
        <>
            <Header />
            <div className="min-h-screen p-8 pt-28">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">My Learning</h1>
                    <p className="text-gray-400">Continue your learning journey</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {roadmaps.map(roadmap => {
                        const progress = getProgressPercentage(roadmap);
                        
                        return (
                            <Link
                                key={roadmap.id}
                                href={`/roadmaps/${roadmap.id}`}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#ffd700]/50 transition-all group"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="text-5xl">{roadmap.icon}</div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white group-hover:text-[#ffd700] transition-colors">
                                                    {roadmap.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm mt-1">{roadmap.description}</p>
                                            </div>
                                            <span className="text-xs px-3 py-1 bg-white/10 rounded-full text-gray-400 uppercase tracking-wide">
                                                {roadmap.category}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-400">
                                                    {roadmap.completed_nodes} of {roadmap.total_nodes} skills completed
                                                </span>
                                                <span className="text-sm font-bold text-[#ffd700]">{progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#ffd700] to-[#ffed4e] transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                <span>Started {formatDate(roadmap.started_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} />
                                                <span>Last accessed {formatDate(roadmap.last_accessed)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <ArrowRight className="text-gray-400 group-hover:text-[#ffd700] group-hover:translate-x-1 transition-all" size={24} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Add More Skills */}
                <div className="mt-8">
                    <Link
                        href="/explore"
                        className="block bg-white/5 backdrop-blur-sm border border-white/10 border-dashed rounded-2xl p-8 text-center hover:bg-white/10 hover:border-[#ffd700]/50 transition-all group"
                    >
                        <BookOpen className="w-12 h-12 text-gray-400 group-hover:text-[#ffd700] mx-auto mb-4 transition-colors" />
                        <h3 className="text-xl font-bold text-white mb-2">Explore More Skills</h3>
                        <p className="text-gray-400">Browse skills and expand your learning</p>
                    </Link>
                </div>
            </div>
            </div>
        </>
    );
}
