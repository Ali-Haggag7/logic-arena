"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "../../../lib/api-client";
import { CustomSelect } from "./components/CustomSelect";
import { ScriptSkeleton } from "./components/ScriptSkeleton";
import { ScriptCard, RobotScript } from "./components/ScriptCard";
import { ProtocolForm } from "./components/ProtocolForm";

const DashboardPage = () => {
    const [scripts, setScripts] = useState<RobotScript[]>([]);
    const [initialLoad, setInitialLoad] = useState(true);
    const [newScriptTitle, setNewScriptTitle] = useState("");
    const [status, setStatus] = useState<{ message: string; type: "error" | "success" | null }>({ message: "", type: null });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMode, setSelectedMode] = useState<"COMBAT" | "RACING" | "TRAINING_SOLO">("COMBAT");
    const router = useRouter();

    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const response = await apiClient.get("/scripts");
                setScripts(response.data);
            } catch (error: any) {
                console.error("Failed to fetch scripts:", error.response?.data?.message || error.message);
                if (error.response?.status === 401) {
                    router.push("/login");
                }
            } finally {
                setInitialLoad(false);
            }
        };
        fetchScripts();
    }, [router]);

    const handleCreateScript = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newScriptTitle.trim()) return;

        setIsLoading(true);
        setStatus({ message: "COMPILING NEURAL CORE...", type: null });

        try {
            const response = await apiClient.post("/scripts", { title: newScriptTitle, content: "// Write your AliScript here" });
            setScripts([...scripts, response.data]);
            setNewScriptTitle("");
            setStatus({ message: "[SYS] NEW SCRIPT PROTOCOL INITIALIZED.", type: "success" });

            setTimeout(() => setStatus({ message: "", type: null }), 3000);
        } catch (error: any) {
            console.error("Failed to create script:", error.response?.data?.message || error.message);
            setStatus({
                message: `[ERR] COMPILATION FAILED: ${error.response?.data?.message || error.message}`,
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToArena = (scriptId: string) => {
        router.push(`/arena?scriptId=${scriptId}&mode=${selectedMode}`);
    };

    const handleGoToLobby = (scriptId: string) => {
        localStorage.setItem("selectedScriptId", scriptId);
        router.push("/lobby");
    };

    return (
        <div className="min-h-screen bg-gray-950 font-mono text-cyan-300 selection:bg-cyan-500/30 relative overflow-hidden pb-12">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none fixed"
                style={{ backgroundImage: 'linear-gradient(rgba(8, 145, 178, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(8, 145, 178, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="max-w-5xl mx-auto pt-10 sm:pt-16 px-4 sm:px-6 relative z-20">
                <div className="mb-8 sm:mb-12 border-b border-cyan-900/60 pb-4 sm:pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-cyan-400 font-black text-3xl sm:text-4xl tracking-[0.15em] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] mb-2">
                            COMMAND CENTER
                        </h1>
                        <h2 className="text-cyan-600/80 text-[10px] sm:text-xs tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e] shrink-0"></span>
                            Uplink Established | Operator Dashboard
                        </h2>
                    </div>
                    <Link
                        href="/leaderboard"
                        className="px-4 py-2 bg-cyan-600/10 border border-cyan-500/40 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-cyan-600/30 hover:border-cyan-400 hover:text-white transition-all rounded shadow-[0_0_10px_rgba(34,211,238,0)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] whitespace-nowrap"
                    >
                        LEADERBOARD
                    </Link>
                </div>

                {status.message && (
                    <div className={`mb-6 sm:mb-8 p-3 rounded border text-[10px] sm:text-xs break-words ${status.type === 'error' ? 'bg-red-950/40 border-red-900/50 text-red-400' :
                        status.type === 'success' ? 'bg-green-950/40 border-green-900/50 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]' :
                            'bg-cyan-950/40 border-cyan-900/50 text-cyan-400 animate-pulse'
                        }`}>
                        {status.message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 flex-col">
                    <div className="order-2 lg:order-1 lg:col-span-2 flex flex-col gap-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-cyan-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">Neural Scripts Repository</h3>
                            <div className="flex items-center gap-4">
                                <CustomSelect
                                    value={selectedMode}
                                    onChange={(val) => setSelectedMode(val as any)}
                                />
                                <span className="text-cyan-800 text-[10px]">TOTAL: {scripts.length}</span>
                            </div>
                        </div>

                        {initialLoad ? (
                            <ScriptSkeleton />
                        ) : scripts.length === 0 ? (
                            <div className="bg-black/40 border border-cyan-900/50 border-dashed rounded-lg p-8 sm:p-10 text-center text-cyan-800 text-[10px] sm:text-sm tracking-wider">
                                NO PROTOCOLS FOUND. INITIALIZE A NEW SCRIPT TO BEGIN.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {scripts.map((script) => (
                                    <ScriptCard
                                        key={script.id}
                                        script={script}
                                        onEditBrain={(id) => console.log("Edit script:", id)}
                                        onDeployToLobby={handleGoToLobby}
                                        onDeployToArena={handleGoToArena}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="order-1 lg:order-2 lg:col-span-1">
                        <ProtocolForm
                            newScriptTitle={newScriptTitle}
                            setNewScriptTitle={setNewScriptTitle}
                            isLoading={isLoading}
                            onSubmit={handleCreateScript}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;