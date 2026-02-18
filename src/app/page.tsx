import { ArrowRight, CheckCircle2, LayoutDashboard, Database, Lock, RefreshCw, FileText } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 w-full h-20 px-8 flex items-center justify-between z-50 bg-[#0f172a]/30 backdrop-blur-xl border-b border-white/5">
                <div className="text-2xl font-black text-white tracking-tight">VLE</div>
                <div className="hidden md:flex items-center gap-10">
                    <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How It Works</Link>
                    <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Login</Link>
                    <Link href="/signup" className="btn-primary py-2 px-6 text-sm">Get Started</Link>
                </div>
            </nav>

            <main className="flex-1 pt-20">
                {/* Hero Section */}
                <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
                    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
                            <span className="block text-white">Stop Tracking What You Watch.</span>
                            <span className="block text-[#ffd700] mt-2">Start Verifying What You Can Do.</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-xl text-slate-400 leading-relaxed">
                            Verified Learning Engine (VLE) transforms unstructured online learning into verified,
                            goal-oriented skill progression. Progress is measured by demonstrated ability — not course completion.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                            <Link href="/signup" className="btn-primary flex items-center gap-2 group">
                                Build Verified Skills
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link href="#how-it-works" className="btn-secondary">
                                How It Works ↓
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 px-8 container mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white">
                            Core Capabilities<br />
                            <span className="text-[#ffd700]">of Verified Learning Engine</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon="🎯"
                            title="Goal Selection"
                            desc="Users choose a target role or learning objective. Learning gains direction through competency graphs."
                        />
                        <FeatureCard
                            icon="📊"
                            title="Competency Graph"
                            desc="Skills are structured as interconnected competencies. Dependencies define progression logic."
                        />
                        <FeatureCard
                            icon="🔒"
                            title="Locked Progression"
                            desc="Competencies unlock only after prerequisites are verified. Prevents skipping and false advancement."
                        />
                        <FeatureCard
                            icon="✅"
                            title="Verification System"
                            desc="Progress requires demonstrated ability through verification tasks. Watching resources does not unlock skills."
                        />
                        <FeatureCard
                            icon="🔄"
                            title="Dynamic Updates"
                            desc="Skill states update automatically after evaluation. Dependent competencies unlock dynamically."
                        />
                        <FeatureCard
                            icon="📄"
                            title="CV Builder"
                            desc="Transforms verified competencies into an ATS-friendly resume. Multiple resume formats available."
                        />
                    </div>
                </section>

                {/* Philosophy / About Section matches original old style */}
                <section id="about" className="py-24 px-8 bg-black/20">
                    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-5xl font-black text-white">
                                Redefining<br />
                                <span className="text-[#ffd700]">Online Learning</span>
                            </h2>
                            <p className="text-xl text-slate-300">
                                Verified Learning Engine (VLE) addresses the fundamental flaw in modern ed-tech: <strong>measuring activity instead of competence.</strong>
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                                    <h4 className="font-bold text-red-500 mb-4">Traditional Platforms</h4>
                                    <ul className="space-y-2 text-sm text-slate-400">
                                        <li>✕ Videos watched</li>
                                        <li>✕ Courses completed</li>
                                        <li>✕ Streaks maintained</li>
                                        <li>✕ False confidence</li>
                                    </ul>
                                </div>
                                <div className="p-6 rounded-2xl bg-[#ffd700]/5 border border-[#ffd700]/10">
                                    <h4 className="font-bold text-[#ffd700] mb-4">The VLE Way</h4>
                                    <ul className="space-y-2 text-sm text-slate-400">
                                        <li>✓ Demonstrated competence</li>
                                        <li>✓ Verified ability</li>
                                        <li>✓ Locked progression</li>
                                        <li>✓ True capability</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="liquid-glass rounded-3xl p-1 overflow-hidden">
                                <div className="bg-[#0f172a] rounded-[22px] overflow-hidden">
                                    <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-mono tracking-widest">vle-dashboard.exe</span>
                                    </div>
                                    <div className="p-8 aspect-video flex flex-col items-center justify-center text-center space-y-4">
                                        <LayoutDashboard className="w-12 h-12 text-[#ffd700] opacity-50" />
                                        <p className="text-slate-500 font-mono text-sm leading-relaxed">
                                            [ SYSTEM INITIALIZED ]<br />
                                            FETCHING COMPETENCY GRAPH...<br />
                                            USER_ID: VLE_0821_BETA
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 text-center text-sm font-medium text-slate-500">
                                Visualize your progress on the <strong>Interactive Dashboard</strong>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-32 text-center px-8">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-10">
                        Build proof of skill.<br />Not proof of completion.
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/signup" className="btn-primary py-4 px-12 text-lg">Get Started Now</Link>
                        <Link href="/login" className="btn-secondary py-4 px-12 text-lg">Login</Link>
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t border-white/5 px-8 text-center text-slate-600 text-sm">
                <p>© 2024 VLE - Verified Learning Engine. All rights reserved.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group">
            <div className="text-4xl mb-6">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ffd700] transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {desc}
            </p>
        </div>
    )
}
