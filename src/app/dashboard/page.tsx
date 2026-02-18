"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import {
    CheckCircle2,
    RotateCw,
    Lock,
    Target,
    User as UserIcon,
    LogOut,
    ChevronRight,
    Plus
} from "lucide-react";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("vle_user");
        if (!storedUser) {
            router.push("/login");
            return;
        }
        setUser(JSON.parse(storedUser));

        const fetchSkills = async () => {
            try {
                const data: any = await api.get("/skills");
                setSkills(data);
            } catch (err) {
                console.error("Failed to fetch skills", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("vle_token");
        localStorage.removeItem("vle_user");
        router.push("/login");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pb-20">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 py-4 px-8">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="text-2xl font-black text-[#ffd700] tracking-[3px]">VLE</div>

                    <ul className="hidden md:flex items-center gap-8">
                        <NavLink href="/dashboard" active>Home</NavLink>
                        <NavLink href="/learning">Learning</NavLink>
                        <NavLink href="/explore">Explore</NavLink>
                        <NavLink href="/cv-builder">CV Builder</NavLink>
                    </ul>

                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-11 h-11 rounded-full bg-[#ffd700] text-[#1a1a2e] font-bold flex items-center justify-center transition-transform hover:scale-110"
                        >
                            {user.name?.charAt(0) || "U"}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-[#0f172a]/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <Link href="/profile" className="block px-4 py-3 text-sm text-slate-300 hover:bg-[#ffd700]/10 hover:text-[#ffd700]">Profile</Link>
                                <Link href="/settings" className="block px-4 py-3 text-sm text-slate-300 hover:bg-[#ffd700]/10 hover:text-[#ffd700]">Settings</Link>
                                <hr className="border-white/5" />
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-[1400px] mx-auto p-8 space-y-10">
                <header className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-[#ffd700]">Welcome back, {user.name.split(' ')[0]}!</h1>
                    <p className="text-xl text-slate-400 font-medium tracking-tight">Track your verified skills and continue your learning journey</p>
                </header>

                {/* Stats Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={<CheckCircle2 className="w-8 h-8" />} label="Skills Verified" value="12" color="text-green-500" bg="bg-green-500/10" />
                    <StatCard icon={<RotateCw className="w-8 h-8" />} label="In Progress" value="5" color="text-blue-500" bg="bg-blue-500/10" />
                    <StatCard icon={<Lock className="w-8 h-8" />} label="Locked Skills" value="23" color="text-slate-500" bg="bg-slate-500/10" />
                    <StatCard icon={<Target className="w-8 h-8" />} label="Active Goals" value="2" color="text-orange-500" bg="bg-orange-500/10" />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card title="Your Active Goals">
                            <div className="space-y-6 mb-8">
                                <GoalItem title="AI/ML Engineer" progress={30} stats="12 of 40 skills verified" />
                                <GoalItem title="Backend Developer" progress={15} stats="6 of 35 skills verified" />
                            </div>
                            <Link href="/explore" className="w-full py-3 px-6 rounded-xl border-2 border-[#ffd700] text-[#ffd700] font-bold text-center block transition-all hover:bg-[#ffd700]/10 flex items-center justify-center gap-2">
                                <Plus className="w-5 h-5" /> Add New Goal
                            </Link>
                        </Card>

                        <Card title="Recent Activity">
                            <div className="space-y-4">
                                <ActivityItem type="verified" title="Python Basics verified" time="2 hours ago" />
                                <ActivityItem type="verified" title="Data Structures verified" time="1 day ago" />
                                <ActivityItem type="failed" title="Neural Networks attempt failed" time="2 days ago" />
                                <ActivityItem type="verified" title="Git & Version Control verified" time="3 days ago" />
                            </div>
                        </Card>
                    </div>

                    {/* Right Content */}
                    <div className="space-y-8">
                        <Card title="Readiness Analysis">
                            <div className="space-y-8">
                                <ReadinessItem title="AI/ML Engineer" progress={30} label="Not Ready" gap="Gap: 28 skills needed" />
                                <ReadinessItem title="Backend Developer" progress={15} label="Not Ready" gap="Gap: 29 skills needed" />
                            </div>
                        </Card>

                        <Card title="Next Steps">
                            <div className="space-y-4">
                                <StepItem status="available" title="NumPy Fundamentals" req="Required for: Data Processing" />
                                <StepItem status="available" title="Pandas Basics" req="Required for: Data Analysis" />
                                <StepItem status="locked" title="Machine Learning Basics" req="Requires: NumPy, Pandas" />
                            </div>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}

function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
    return (
        <li>
            <Link
                href={href}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${active ? "bg-[#ffd700]/10 text-[#ffd700]" : "text-slate-400 hover:text-white"
                    }`}
            >
                {children}
            </Link>
        </li>
    );
}

function StatCard({ icon, label, value, color, bg }: { icon: any; label: string; value: string; color: string; bg: string }) {
    return (
        <div className="bg-[#0f172a]/95 border border-white/10 p-6 rounded-2xl flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(255,215,0,0.15)] backdrop-blur-md">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${bg} ${color}`}>
                {icon}
            </div>
            <div>
                <div className="text-3xl font-black text-[#ffd700] leading-none mb-1">{value}</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
            </div>
        </div>
    );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-[#0f172a]/95 border border-white/10 p-8 rounded-[24px] shadow-2xl backdrop-blur-md">
            <h2 className="text-xl font-black text-[#ffd700] pb-4 mb-6 border-b border-white/5 uppercase tracking-widest">{title}</h2>
            {children}
        </div>
    );
}

function GoalItem({ title, progress, stats }: { title: string; progress: number; stats: string }) {
    return (
        <div className="p-6 rounded-2xl bg-[#ffd700]/5 border border-[#ffd700]/10 border-l-4 border-l-[#ffd700]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <span className="text-lg font-bold text-[#ffd700]">{progress}%</span>
            </div>
            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-[#ffd700] to-[#ffed4e]" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium">{stats}</span>
                <button className="btn-primary py-2 px-6 text-sm">Continue Learning</button>
            </div>
        </div>
    );
}

function ActivityItem({ type, title, time }: { type: "verified" | "failed"; title: string; time: string }) {
    const isVerified = type === "verified";
    return (
        <div className={`p-4 rounded-xl flex items-center gap-4 bg-white/5 border-l-4 ${isVerified ? "border-l-green-500" : "border-l-red-500"}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isVerified ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                {isVerified ? "✓" : "✕"}
            </div>
            <div>
                <p className="text-white font-bold">{title}</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">{time}</p>
            </div>
        </div>
    );
}

function ReadinessItem({ title, progress, label, gap }: { title: string; progress: number; label: string; gap: string }) {
    return (
        <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</h4>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-xs">
                <span className="text-red-500 font-black">{label}</span>
                <span className="text-slate-500 font-medium">{gap}</span>
            </div>
        </div>
    );
}

function StepItem({ status, title, req }: { status: "available" | "locked"; title: string; req: string }) {
    const isAvailable = status === "available";
    return (
        <div className={`p-5 rounded-2xl bg-white/5 border-l-4 transition-all ${isAvailable ? "border-l-green-500" : "border-l-slate-700 opacity-60"}`}>
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${isAvailable ? "bg-green-500/20 text-green-500" : "bg-slate-500/20 text-slate-500"}`}>
                {status}
            </span>
            <h4 className="text-white font-bold mb-1">{title}</h4>
            <p className="text-xs text-slate-500 mb-4">{req}</p>
            {isAvailable && (
                <button className="text-[10px] font-black uppercase text-[#ffd700] tracking-widest hover:underline flex items-center gap-1">
                    Start Verification <ChevronRight className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
