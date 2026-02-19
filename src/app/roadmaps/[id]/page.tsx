"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { ChevronDown, ChevronUp, Play, CheckCircle, Clock } from "lucide-react";

interface Resource {
    id: number;
    resource_type: string;
    title: string;
    url: string;
    duration_minutes: number | null;
    provider: string;
}

interface Node {
    id: number;
    title: string;
    description: string;
    estimated_hours: number;
    resources?: Resource[];
}

interface Phase {
    id: number;
    phase_number: number;
    title: string;
    description: string;
    nodes: Node[];
}

interface Roadmap {
    id: number;
    name: string;
    description: string;
    icon: string;
    category: string;
    difficulty: string;
    estimated_hours: number;
    phases: Phase[];
}

export default function RoadmapDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1]));
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
    const [nodeResources, setNodeResources] = useState<Record<number, Resource[]>>({});

    useEffect(() => {
        fetchRoadmap();
    }, [params.id]);

    const fetchRoadmap = async () => {
        try {
            const data: any = await api.get(`/roadmaps/${params.id}`);
            setRoadmap(data);
        } catch (err) {
            console.error("Failed to fetch roadmap:", err);
        } finally {
            setLoading(false);
        }
    };

    const togglePhase = (phaseNumber: number) => {
        const newExpanded = new Set(expandedPhases);
        if (newExpanded.has(phaseNumber)) {
            newExpanded.delete(phaseNumber);
        } else {
            newExpanded.add(phaseNumber);
        }
        setExpandedPhases(newExpanded);
    };

    const toggleNode = async (nodeId: number) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
            // Fetch resources if not already loaded
            if (!nodeResources[nodeId]) {
                try {
                    const data: any = await api.get(`/roadmaps/${params.id}/nodes/${nodeId}/resources`);
                    setNodeResources(prev => ({ ...prev, [nodeId]: data.resources }));
                } catch (err) {
                    console.error("Failed to fetch resources:", err);
                }
            }
        }
        setExpandedNodes(newExpanded);
    };

    const startRoadmap = async () => {
        // Check if user is logged in
        const token = localStorage.getItem("vle_token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            await api.post(`/roadmaps/${params.id}/start`);
            alert("Roadmap started! Check your progress in My Learning.");
            // Optionally redirect to My Learning
            router.push("/my-learning");
        } catch (err: any) {
            console.error("Failed to start roadmap:", err);
            alert("Failed to start roadmap. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-white">Loading...</div>
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-white">Roadmap not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/roadmaps" className="text-[#ffd700] hover:underline mb-4 inline-block">
                        ← Back to Roadmaps
                    </Link>
                    <div className="flex items-start gap-6">
                        <div className="text-7xl">{roadmap.icon}</div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-2">{roadmap.name}</h1>
                            <p className="text-xl text-gray-300 mb-4">{roadmap.description}</p>
                            <div className="flex gap-4 text-sm">
                                <span className="px-3 py-1 bg-white/10 rounded-full text-white capitalize">
                                    {roadmap.difficulty}
                                </span>
                                <span className="px-3 py-1 bg-white/10 rounded-full text-white">
                                    {roadmap.category}
                                </span>
                                <span className="px-3 py-1 bg-white/10 rounded-full text-white flex items-center gap-1">
                                    <Clock size={14} />
                                    ~{roadmap.estimated_hours}h
                                </span>
                            </div>
                            <button
                                onClick={startRoadmap}
                                className="mt-4 bg-[#ffd700] text-[#0f172a] px-6 py-2 rounded-lg font-bold hover:bg-[#ffed4e] transition-all flex items-center gap-2"
                            >
                                <Play size={18} />
                                Start Learning
                            </button>
                        </div>
                    </div>
                </div>

                {/* Phases */}
                <div className="space-y-4">
                    {roadmap.phases.map(phase => (
                        <div key={phase.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                            <button
                                onClick={() => togglePhase(phase.phase_number)}
                                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all"
                            >
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        Phase {phase.phase_number}: {phase.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">{phase.description}</p>
                                </div>
                                {expandedPhases.has(phase.phase_number) ? (
                                    <ChevronUp className="text-[#ffd700]" size={24} />
                                ) : (
                                    <ChevronDown className="text-gray-400" size={24} />
                                )}
                            </button>

                            {expandedPhases.has(phase.phase_number) && (
                                <div className="px-6 pb-6 space-y-3">
                                    {phase.nodes.map(node => (
                                        <div key={node.id} className="bg-white/5 rounded-lg border border-white/5">
                                            <button
                                                onClick={() => toggleNode(node.id)}
                                                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all"
                                            >
                                                <div className="text-left flex-1">
                                                    <h4 className="text-lg font-semibold text-white">{node.title}</h4>
                                                    <p className="text-gray-400 text-sm">{node.description}</p>
                                                    <span className="text-xs text-gray-500 mt-1 inline-block">
                                                        ~{node.estimated_hours}h
                                                    </span>
                                                </div>
                                                {expandedNodes.has(node.id) ? (
                                                    <ChevronUp className="text-[#ffd700]" size={20} />
                                                ) : (
                                                    <ChevronDown className="text-gray-400" size={20} />
                                                )}
                                            </button>

                                            {expandedNodes.has(node.id) && nodeResources[node.id] && (
                                                <div className="px-4 pb-4 space-y-2">
                                                    <h5 className="text-sm font-semibold text-gray-300 mb-2">Learning Resources:</h5>
                                                    {nodeResources[node.id].map(resource => (
                                                        <a
                                                            key={resource.id}
                                                            href={resource.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/5 hover:border-[#ffd700]/30"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-xs px-2 py-0.5 bg-[#ffd700]/20 text-[#ffd700] rounded uppercase font-medium">
                                                                            {resource.resource_type}
                                                                        </span>
                                                                        {resource.duration_minutes && (
                                                                            <span className="text-xs text-gray-500">
                                                                                {resource.duration_minutes}min
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-white text-sm font-medium">{resource.title}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">{resource.provider}</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
