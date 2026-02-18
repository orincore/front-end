"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, Filter, ChevronRight } from "lucide-react";

const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "ai-ml", label: "AI/ML" },
    { id: "web", label: "Web Development" },
    { id: "backend", label: "Backend" },
    { id: "data", label: "Data Science" },
    { id: "mobile", label: "Mobile" },
];

export default function ExplorePage() {
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
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
    }, []);

    return (
        <div className="min-h-screen pb-20">
            <header className="py-20 px-8 text-center space-y-4">
                <h1 className="text-5xl font-black text-[#ffd700]">Explore Career Paths</h1>
                <p className="text-xl text-slate-400 font-medium">Choose your target role and start your verified learning journey</p>
            </header>

            <section className="max-w-4xl mx-auto px-8 mb-12">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-500 group-focus-within:text-[#ffd700] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for roles, skills, or technologies..."
                        className="w-full pl-14 pr-6 py-5 bg-[#0f172a]/60 border border-white/10 rounded-2xl text-white outline-none focus:border-[#ffd700] backdrop-blur-md shadow-2xl transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-8 mb-16 overflow-x-auto">
                <div className="flex items-center justify-center gap-3 min-w-max">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${activeCategory === cat.id
                                    ? "bg-[#ffd700] border-[#ffd700] text-[#0f172a]"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </section>

            <main className="max-w-[1400px] mx-auto px-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-80 rounded-[32px] bg-white/5 animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {skills.map((skill) => (
                            <GoalCard key={skill.id} skill={skill} />
                        ))}
                        {/* Mock cards to fill the display if backend is empty */}
                        {skills.length === 0 && (
                            <>
                                <GoalCard skill={{ name: "AI/ML Engineer", description: "Build and deploy machine learning models and AI systems", icon: "🤖", tags: ["Python", "TensorFlow"] }} />
                                <GoalCard skill={{ name: "Backend Developer", description: "Design and build server-side applications and APIs", icon: "⚙️", tags: ["Node.js", "PostgreSQL"] }} />
                                <GoalCard skill={{ name: "Full Stack Developer", description: "Build complete web applications from frontend to backend", icon: "💻", tags: ["React", "MongoDB"] }} />
                                <GoalCard skill={{ name: "Data Scientist", description: "Extract insights from data using statistics and ML", icon: "📊", tags: ["Python", "Pandas"] }} />
                            </>
                        )}
                    </div>
                )}
            </main>

            <section className="max-w-4xl mx-auto px-8 mt-24">
                <div className="p-10 rounded-[40px] bg-[#0f172a]/60 border border-white/10 backdrop-blur-xl">
                    <h3 className="text-2xl font-black text-[#ffd700] mb-6 uppercase tracking-widest">How Goal Selection Works</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <span className="text-[#ffd700]">✓</span> Select one or multiple career goals
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <span className="text-[#ffd700]">✓</span> Each goal has a personalized dependency graph
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <span className="text-[#ffd700]">✓</span> Skills are unlocked based on prerequisites
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <span className="text-[#ffd700]">✓</span> Progress is tracked separately for each goal
                        </li>
                        <li className="flex items-center gap-3 text-slate-300 font-medium">
                            <span className="text-[#ffd700]">✓</span> Verification is mandatory before progression
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

function GoalCard({ skill }: { skill: any }) {
    return (
        <div className="bg-[#0f172a]/95 border border-white/10 p-8 rounded-[32px] backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,215,0,0.1)] group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{skill.icon || "🎓"}</div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{skill.name}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                {skill.description || "Master the core competencies required for this career path through verified achievement."}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
                {(skill.tags || ["VLE-Verified", "Path"]).map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-[#ffd700] uppercase tracking-widest">
                        {tag}
                    </span>
                ))}
            </div>

            <button className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2">
                Start Learning
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
