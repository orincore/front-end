"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { CheckCircle2, Circle, PlayCircle, FileText, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

function LearningContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathId = searchParams.get("path");
    
    const [path, setPath] = useState<any>(null);
    const [topics, setTopics] = useState<any[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<any>(null);
    const [resources, setResources] = useState<any[]>([]);
    const [progress, setProgress] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!pathId) {
            loadMyPaths();
        } else {
            loadPathData();
        }
    }, [pathId]);

    const loadMyPaths = async () => {
        try {
            const data: any = await api.get("/learning/my-paths");
            if (data.length > 0) {
                router.push(`/learning?path=${data[0].id}`);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error("Failed to load paths", err);
            setLoading(false);
        }
    };

    const loadPathData = async () => {
        try {
            const [pathData, progressData]: any = await Promise.all([
                api.get(`/learning/paths/${pathId}`),
                api.get(`/learning/progress/${pathId}`)
            ]);
            
            setPath(pathData);
            setTopics(pathData.topics || []);
            setProgress(progressData);
            
            if (pathData.topics && pathData.topics.length > 0) {
                selectTopic(pathData.topics[0]);
            }
        } catch (err) {
            console.error("Failed to load path data", err);
        } finally {
            setLoading(false);
        }
    };

    const selectTopic = async (topic: any) => {
        setSelectedTopic(topic);
        try {
            const data: any = await api.get(`/learning/topics/${topic.id}/resources`);
            setResources(data);
        } catch (err) {
            console.error("Failed to load resources", err);
        }
    };

    const updateProgress = async (topicId: number, status: string, percent: number) => {
        try {
            await api.post("/learning/progress", {
                topicId,
                status,
                progressPercent: percent
            });
            loadPathData(); // Reload to update progress
        } catch (err) {
            console.error("Failed to update progress", err);
        }
    };

    const getTopicProgress = (topicId: number) => {
        const prog = progress.find(p => p.id === topicId);
        return prog?.status || "not_started";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-[#ffd700] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400">Loading your learning path...</p>
                </div>
            </div>
        );
    }

    if (!pathId || !path) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-6">
                    <h1 className="text-5xl font-black text-[#ffd700]">No Learning Path Selected</h1>
                    <p className="text-slate-400 text-xl">Choose a learning path to get started</p>
                    <Link href="/explore" className="inline-block btn-primary py-4 px-8 rounded-2xl">
                        Explore Learning Paths
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 py-8 px-8">
                <div className="max-w-[1600px] mx-auto">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#ffd700] mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Explore
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">{path.icon}</div>
                        <div>
                            <h1 className="text-4xl font-black text-[#ffd700]">{path.name}</h1>
                            <p className="text-slate-400 mt-2">{path.description}</p>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Overall Progress</span>
                            <span className="text-[#ffd700] font-bold">
                                {Math.round((progress.filter(p => p.status === 'completed').length / topics.length) * 100)}%
                            </span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-[#ffd700] to-[#ffed4e] transition-all duration-500"
                                style={{ width: `${(progress.filter(p => p.status === 'completed').length / topics.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Topics Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#0f172a]/95 border border-white/10 rounded-[24px] p-6 backdrop-blur-md sticky top-8">
                            <h2 className="text-xl font-black text-[#ffd700] mb-6 uppercase tracking-widest">Topics</h2>
                            <div className="space-y-2">
                                {topics.map((topic, index) => {
                                    const status = getTopicProgress(topic.id);
                                    const isActive = selectedTopic?.id === topic.id;
                                    
                                    return (
                                        <button
                                            key={topic.id}
                                            onClick={() => selectTopic(topic)}
                                            className={`w-full text-left p-4 rounded-xl transition-all ${
                                                isActive 
                                                    ? "bg-[#ffd700]/10 border-2 border-[#ffd700]" 
                                                    : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    {status === 'completed' ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    ) : status === 'in_progress' ? (
                                                        <Circle className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-slate-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-white mb-1">{topic.title}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        {topic.estimated_hours}h
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-2">
                        {selectedTopic && (
                            <div className="space-y-6">
                                <div className="bg-[#0f172a]/95 border border-white/10 rounded-[24px] p-8 backdrop-blur-md">
                                    <h2 className="text-3xl font-black text-white mb-4">{selectedTopic.title}</h2>
                                    <p className="text-slate-400 mb-6">{selectedTopic.description}</p>
                                    
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => updateProgress(selectedTopic.id, 'in_progress', 50)}
                                            className="btn-primary py-3 px-6 rounded-xl"
                                        >
                                            Mark as In Progress
                                        </button>
                                        <button
                                            onClick={() => updateProgress(selectedTopic.id, 'completed', 100)}
                                            className="bg-green-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-600 transition-colors"
                                        >
                                            Mark as Completed
                                        </button>
                                    </div>
                                </div>

                                {/* Resources */}
                                <div className="bg-[#0f172a]/95 border border-white/10 rounded-[24px] p-8 backdrop-blur-md">
                                    <h3 className="text-xl font-black text-[#ffd700] mb-6 uppercase tracking-widest">Learning Resources</h3>
                                    
                                    {resources.length === 0 ? (
                                        <p className="text-slate-500 text-center py-8">No resources available yet</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {resources.map((resource) => (
                                                <a
                                                    key={resource.id}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#ffd700]/50 transition-all group"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                            resource.resource_type === 'video' 
                                                                ? 'bg-red-500/20 text-red-500' 
                                                                : 'bg-blue-500/20 text-blue-500'
                                                        }`}>
                                                            {resource.resource_type === 'video' ? (
                                                                <PlayCircle className="w-6 h-6" />
                                                            ) : (
                                                                <FileText className="w-6 h-6" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-white font-bold mb-1 group-hover:text-[#ffd700] transition-colors">
                                                                {resource.title}
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                                <span className="uppercase font-bold">{resource.resource_type}</span>
                                                                {resource.duration && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {resource.duration} min
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LearningPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-[#ffd700] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        }>
            <LearningContent />
        </Suspense>
    );
}
