"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LiquidBackground from "@/components/LiquidBackground";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const aboutRef = useRef<HTMLElement>(null);
    const featuresRef = useRef<HTMLElement>(null);
    const howItWorksRef = useRef<HTMLElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrolled / maxScroll;
            setScrollProgress(progress);

            // Intersection Observer for scroll animations
            const sections = [aboutRef.current, featuresRef.current, howItWorksRef.current];
            sections.forEach(section => {
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
                    if (isVisible) {
                        section.classList.add('visible');
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <LiquidBackground />
            
            {/* Navigation */}
            <nav className="fixed top-0 w-full h-20 px-8 flex items-center justify-between z-50 bg-[#0f172a]/30 backdrop-blur-xl border-b border-white/5">
                <div className="text-2xl font-black text-white tracking-tight">VLE</div>
                <div className="hidden md:flex items-center gap-10">
                    <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How It Works</Link>
                    <Link href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</Link>
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
                <section ref={featuresRef} id="features" className="py-24 px-8 container mx-auto scroll-fade-in">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white" style={{
                            color: `rgb(${255 - scrollProgress * 50}, ${255 - scrollProgress * 50}, ${255})`
                        }}>
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

                {/* How It Works Section */}
                <section ref={howItWorksRef} id="how-it-works" className="py-24 px-8 container mx-auto scroll-fade-in">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white">How It Works</h2>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                            <StepCard number="01" title="Select Goal" desc="Choose your target role or learning direction." />
                            <div className="hidden md:block relative h-24">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ffd700] to-transparent"></div>
                            </div>
                            <StepCard number="02" title="Explore Graph" desc="View a structured roadmap of required skills." />
                            <div className="hidden md:block relative h-24">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ffd700] to-transparent"></div>
                            </div>
                            <StepCard number="03" title="Verify Skills" desc="Complete verification tasks to unlock progress." />
                            <div className="hidden md:block relative h-24">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ffd700] to-transparent"></div>
                            </div>
                            <StepCard number="04" title="Progress" desc="Unlock new skills and build your verified profile." />
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section ref={aboutRef} id="about" className="py-24 px-8 bg-black/20 scroll-fade-in">
                    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-5xl font-black text-white">
                                Redefining<br />
                                <span className="text-[#ffd700]">Online Learning</span>
                            </h2>
                            <p className="text-xl text-slate-300 leading-relaxed">
                                Verified Learning Engine (VLE) addresses the fundamental flaw in modern ed-tech: <strong>measuring activity instead of competence.</strong>
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                                    <h4 className="font-bold text-red-500 mb-4">Traditional Platforms</h4>
                                    <ul className="space-y-2 text-sm text-slate-400">
                                        <li>❌ Videos watched</li>
                                        <li>❌ Courses completed</li>
                                        <li>❌ Streaks maintained</li>
                                        <li>❌ False confidence</li>
                                    </ul>
                                </div>
                                <div className="p-6 rounded-2xl bg-[#ffd700]/5 border border-[#ffd700]/10">
                                    <h4 className="font-bold text-[#ffd700] mb-4">The VLE Way</h4>
                                    <ul className="space-y-2 text-sm text-slate-400">
                                        <li>✅ Demonstrated competence</li>
                                        <li>✅ Verified ability</li>
                                        <li>✅ Locked progression</li>
                                        <li>✅ True capability</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-3">Our Philosophy</h3>
                                <p className="text-slate-400">Watching resources does not unlock skills. Verification governs progression.</p>
                            </div>
                        </div>

                        <div className="relative">
                            <Image 
                                src="/ChatGPT Image Feb 19, 2026, 07_48_32 PM.png" 
                                alt="VLE Dashboard Visualization" 
                                width={800} 
                                height={600} 
                                className="rounded-3xl shadow-2xl border border-white/10"
                            />
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
                <p>© 2026 VLE - Verified Learning Engine. All rights reserved.</p>
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
    );
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ffd700]/10 border-2 border-[#ffd700] text-[#ffd700] font-black text-xl">
                {number}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-slate-400 text-sm">{desc}</p>
        </div>
    );
}
