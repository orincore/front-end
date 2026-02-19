"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Download, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Loader2 } from "lucide-react";
import Header from "@/components/Header";

interface UserProfile {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    title?: string;
    summary?: string;
}

interface Skill {
    name: string;
    verified: boolean;
    completedAt?: string;
}

export default function CvBuilderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile>({
        name: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        summary: ""
    });

    useEffect(() => {
        checkAuthAndFetchData();
    }, []);

    const checkAuthAndFetchData = async () => {
        try {
            const token = localStorage.getItem("vle_token");
            if (!token) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            setIsLoggedIn(true);

            // Fetch user data
            const userData: any = await api.get("/auth/me");
            const userProfile = {
                name: userData.name,
                email: userData.email,
                phone: "",
                location: "",
                title: "Software Developer",
                summary: "Passionate learner with verified skills in modern technologies"
            };
            setProfile(userProfile);
            setFormData(userProfile);

            // Fetch user's progress to get verified skills
            try {
                const progressData: any = await api.get("/roadmaps/my-progress");
                const verifiedSkills: Skill[] = [];
                
                progressData.roadmaps?.forEach((roadmap: any) => {
                    if (roadmap.completed_nodes > 0) {
                        verifiedSkills.push({
                            name: roadmap.name,
                            verified: true,
                            completedAt: roadmap.last_accessed
                        });
                    }
                });

                setSkills(verifiedSkills);
            } catch (err) {
                console.error("Failed to fetch skills:", err);
            }
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        setProfile(formData);
        setEditing(false);
    };

    const handleDownload = () => {
        // Create a simple text CV
        const cvContent = `
${formData.name}
${formData.title}
${formData.email} | ${formData.phone} | ${formData.location}

PROFESSIONAL SUMMARY
${formData.summary}

VERIFIED SKILLS
${skills.map(skill => `• ${skill.name} (Verified)`).join('\n')}

EDUCATION & CERTIFICATIONS
• Verified Learning Engine (VLE) - Skill Verification Platform
• Completed ${skills.length} verified learning paths

Generated from VLE - Verified Learning Engine
        `.trim();

        const blob = new Blob([cvContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.name.replace(/\s+/g, '_')}_CV.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
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

    if (!isLoggedIn) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center p-8 pt-20">
                    <div className="max-w-md text-center">
                        <Award className="w-16 h-16 text-[#ffd700] mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-4">Login Required</h1>
                        <p className="text-gray-400 mb-6">
                            Please login to build your CV with verified skills.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => router.push("/login")}
                                className="bg-[#ffd700] text-[#0f172a] px-6 py-3 rounded-lg font-bold hover:bg-[#ffed4e] transition-all"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => router.push("/signup")}
                                className="bg-white/5 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-all border border-white/10"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen p-8 pt-28">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">CV Builder</h1>
                            <p className="text-gray-400">Generate your verified skills resume</p>
                        </div>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 bg-[#ffd700] text-[#0f172a] px-6 py-3 rounded-lg font-bold hover:bg-[#ffed4e] transition-all"
                        >
                            <Download size={20} />
                            Download CV
                        </button>
                    </div>

                    {/* CV Preview */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6">
                        {/* Header Section */}
                        <div className="mb-8 pb-8 border-b border-white/10">
                            {editing ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-2xl font-bold"
                                        placeholder="Your Name"
                                    />
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-300"
                                        placeholder="Your Title"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-300 text-sm"
                                            placeholder="Email"
                                        />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-300 text-sm"
                                            placeholder="Phone"
                                        />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-300 text-sm"
                                            placeholder="Location"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSave}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-all"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFormData(profile!);
                                                setEditing(false);
                                            }}
                                            className="bg-white/5 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2">{profile?.name}</h2>
                                            <p className="text-xl text-gray-300 mb-4">{profile?.title}</p>
                                        </div>
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="text-[#ffd700] hover:text-[#ffed4e] transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} />
                                            {profile?.email}
                                        </div>
                                        {profile?.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} />
                                                {profile.phone}
                                            </div>
                                        )}
                                        {profile?.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                {profile.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary Section */}
                        <div className="mb-8 pb-8 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <User size={20} className="text-[#ffd700]" />
                                Professional Summary
                            </h3>
                            {editing ? (
                                <textarea
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-300 min-h-[100px]"
                                    placeholder="Write a brief summary about yourself..."
                                />
                            ) : (
                                <p className="text-gray-300 leading-relaxed">{profile?.summary}</p>
                            )}
                        </div>

                        {/* Verified Skills Section */}
                        <div className="mb-8 pb-8 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Award size={20} className="text-[#ffd700]" />
                                Verified Skills
                            </h3>
                            {skills.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <Award size={16} className="text-green-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{skill.name}</p>
                                                <p className="text-xs text-gray-500">Verified on VLE</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 mb-4">No verified skills yet</p>
                                    <button
                                        onClick={() => router.push("/explore")}
                                        className="text-[#ffd700] hover:underline"
                                    >
                                        Start learning to add verified skills
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Education Section */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <GraduationCap size={20} className="text-[#ffd700]" />
                                Education & Certifications
                            </h3>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <p className="text-white font-medium mb-1">Verified Learning Engine (VLE)</p>
                                <p className="text-gray-400 text-sm mb-2">Skill Verification Platform</p>
                                <p className="text-gray-500 text-sm">
                                    Completed {skills.length} verified learning path{skills.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-blue-300 text-sm">
                            💡 <strong>Tip:</strong> Complete more learning paths in the Explore section to add more verified skills to your CV.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
