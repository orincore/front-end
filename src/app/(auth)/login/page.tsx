"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response: any = await api.post("/auth/login", { email, password });
            localStorage.setItem("vle_token", response.token);
            localStorage.setItem("vle_user", JSON.stringify(response.user));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
            <div className="w-full max-w-[480px] text-center">
                <Link href="/" className="inline-block text-[2.2rem] font-[800] tracking-[6px] text-[#ffd700] no-underline mb-6 transition-transform hover:scale-105">
                    VLE
                </Link>

                <div className="bg-[#0f172a]/60 border border-white/10 rounded-[24px] p-9 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-[10px] text-left">
                    <div className="mb-8">
                        <h1 className="text-[1.9rem] font-bold text-white mb-2 text-center">Welcome back</h1>
                        <p className="text-[#b0b0d0] text-sm text-center">Continue your verified learning journey.</p>
                    </div>

                    <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-[0.95rem] text-[#c8c8ff]">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3.5 border border-white/10 bg-white/5 rounded-xl text-white outline-none focus:border-[#ffd700] transition-colors"
                                placeholder="alex@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[0.95rem] text-[#c8c8ff]">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3.5 border border-white/10 bg-white/5 rounded-xl text-white outline-none focus:border-[#ffd700] transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between text-[0.9rem]">
                            <div className="flex items-center gap-2 text-[#c8c8ff]">
                                <input type="checkbox" id="remember" className="accent-[#ffd700]" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="#" className="text-[#8ea0ff] hover:underline">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full bg-[#ffd700] text-[#1a1a2e] font-bold py-[14px] rounded-xl text-[1rem] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(247,183,51,0.35)] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                        </button>

                        <p className="text-center text-[0.9rem] text-[#c8c8ff] mt-3">
                            New to VLE?{" "}
                            <Link href="/signup" className="text-[#ffd700] hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </form>
                </div>

                <div className="mt-8 text-[0.9rem] text-[#a0a0c8] max-w-[300px] mx-auto leading-relaxed">
                    Verification is the only gate. No self-reporting. No streak hacks.
                </div>
            </div>
        </div>
    );
}
