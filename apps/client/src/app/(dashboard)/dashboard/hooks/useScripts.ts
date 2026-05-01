import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../../../lib/api-client";
import { RobotScript } from "../components/ScriptCard";

export type GameMode = "COMBAT" | "RACING" | "TRAINING_SOLO";

export const GUEST_SCRIPT: RobotScript = {
    id: "guest-script",
    title: "DEFAULT_GUEST_SCRIPT",
    content: "// Standard operating logic\n// Register to edit this script!\nSCAN;\nMOVE_FAST;",
    version: 1,
    createdAt: new Date().toISOString()
};

export function useScripts() {
    const [scripts, setScripts] = useState<RobotScript[]>([]);
    const [initialLoad, setInitialLoad] = useState(true);
    const [newScriptTitle, setNewScriptTitle] = useState("");
    const [status, setStatus] = useState<{ message: string; type: "error" | "success" | null }>({ message: "", type: null });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMode, setSelectedMode] = useState<GameMode>("COMBAT");
    const [editingScript, setEditingScript] = useState<RobotScript | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const response = await apiClient.get("/scripts");
                setScripts(response.data);
            } catch (error: unknown) {
                const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
                console.error("Failed to fetch scripts:", axiosError.response?.data?.message ?? axiosError.message);
                if (axiosError.response?.status === 401) {
                    setIsGuest(true);
                    setScripts([GUEST_SCRIPT]);
                }
            } finally {
                setInitialLoad(false);
            }
        };
        fetchScripts();
    }, [router]);

    const handleCreateScript = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isGuest) {
            setShowAuthModal(true);
            return;
        }
        if (!newScriptTitle.trim()) return;

        setIsLoading(true);
        setStatus({ message: "CREATING NEW SCRIPT...", type: null });

        try {
            const response = await apiClient.post("/scripts", { title: newScriptTitle, content: "// Write your AliScript here" });
            setScripts((prev) => [...prev, response.data]);
            setNewScriptTitle("");
            setStatus({ message: "[SYS] SCRIPT CREATED.", type: "success" });
            setTimeout(() => setStatus({ message: "", type: null }), 3000);
        } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number, data?: { message?: string } }; message?: string };
            const errMsg = axiosError.response?.status === 401
                ? "Unauthorized. Please log in to create scripts."
                : (axiosError.response?.data?.message ?? "An unexpected error occurred.");
            console.error("Failed to create script:", errMsg);
            setStatus({
                message: `[ERR] COMPILATION FAILED: ${errMsg}`,
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToArena = useCallback((scriptId: string) => {
        router.push(`/arena?scriptId=${scriptId}&mode=${selectedMode}`);
    }, [router, selectedMode]);

    const handleGoToLobby = useCallback((scriptId: string) => {
        localStorage.setItem("selectedScriptId", scriptId);
        router.push("/lobby");
    }, [router]);

    const handleEditScript = useCallback((id: string) => {
        if (isGuest) {
            setShowAuthModal(true);
            return;
        }
        const found = scripts.find((s) => s.id === id) ?? null;
        setEditingScript(found);
    }, [scripts, isGuest]);

    const handleOptimisticUpdate = useCallback((updated: RobotScript) => {
        setScripts((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }, []);

    const handleRevert = useCallback((original: RobotScript) => {
        setScripts((prev) => prev.map((s) => (s.id === original.id ? original : s)));
    }, []);

    const handleDeleteScript = useCallback(async (id: string) => {
        if (isGuest) {
            setShowAuthModal(true);
            return;
        }
        // Optimistic removal
        const snapshot = scripts.find((s) => s.id === id);
        setScripts((prev) => prev.filter((s) => s.id !== id));
        setStatus({ message: "SCRIPT DELETED", type: "error" });
        setTimeout(() => setStatus({ message: "", type: null }), 1000);

        try {
            await apiClient.delete(`/scripts/${id}`);
        } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number, data?: { message?: string } }; message?: string };
            const errMsg = axiosError.response?.status === 401
                ? "Unauthorized. Please log in to delete scripts."
                : (axiosError.response?.data?.message ?? "An unexpected error occurred.");
            console.error("Failed to delete script:", errMsg);
            // Restore on failure
            if (snapshot) {
                setScripts((prev) => {
                    const exists = prev.some((s) => s.id === snapshot.id);
                    return exists ? prev : [...prev, snapshot];
                });
            }
            setStatus({ message: `[ERR] TERMINATION FAILED: ${errMsg}`, type: "error" });
            setTimeout(() => setStatus({ message: "", type: null }), 3000);
        }
    }, [scripts, isGuest]);

    return {
        scripts,
        initialLoad,
        newScriptTitle,
        setNewScriptTitle,
        status,
        isLoading,
        selectedMode,
        setSelectedMode,
        editingScript,
        setEditingScript,
        isGuest,
        showAuthModal,
        setShowAuthModal,
        handleCreateScript,
        handleGoToArena,
        handleGoToLobby,
        handleEditScript,
        handleOptimisticUpdate,
        handleRevert,
        handleDeleteScript
    };
}
