"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import { getSelectedScriptId } from "../../../../lib/client-security";
import type { MatchMode } from "../../../../context/SocketContext";

const DEPLOY_TIMEOUT_MS = 10000;

interface UseDeployMatchOptions {
  socket: Socket;
  mode: MatchMode;
  onNoScript: () => void;
}

export interface UseDeployMatchReturn {
  handleDeployMatch: () => void;
  handleAIMatch: (difficulty: "easy" | "medium" | "hard") => void;
  deploying: boolean;
  aiDeploying: "easy" | "medium" | "hard" | null;
}

export function useDeployMatch({ socket, mode, onNoScript }: UseDeployMatchOptions): UseDeployMatchReturn {
  const router = useRouter();
  const [deploying, setDeploying] = useState(false);
  const [aiDeploying, setAiDeploying] = useState<"easy" | "medium" | "hard" | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onMatchCreated = (data: { matchId: string }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDeploying(false);
      setAiDeploying(null);
    };

    const onCreateMatchError = (data: { message: string }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDeploying(false);
      setAiDeploying(null);
      alert(`Error: ${data.message}`);
    };

    socket.on("matchCreated", onMatchCreated);
    socket.on("createMatchError", onCreateMatchError);

    return () => {
      socket.off("matchCreated", onMatchCreated);
      socket.off("createMatchError", onCreateMatchError);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [socket]);

  const handleDeployMatch = useCallback(() => {
    const scriptId = getSelectedScriptId();
    if (!scriptId) {
      onNoScript();
      return;
    }
    setDeploying(true);
    socket.emit("createMatch", { scriptId, hostName: "Player", mode });

    timeoutRef.current = setTimeout(() => {
      setDeploying(false);
      alert("Match creation timed out. Please try again.");
    }, DEPLOY_TIMEOUT_MS);
  }, [socket, mode, onNoScript]);

  const handleAIMatch = useCallback((difficulty: "easy" | "medium" | "hard") => {
    const scriptId = getSelectedScriptId();
    if (!scriptId) {
      onNoScript();
      return;
    }
    setAiDeploying(difficulty);
    const matchId = crypto.randomUUID();
    router.push(`/arena?scriptId=${scriptId}&matchId=${matchId}&mode=CLASSIC&matchMode=CLASSIC&aiDifficulty=${difficulty}`);
  }, [router, onNoScript]);

  return { handleDeployMatch, handleAIMatch, deploying, aiDeploying };
}
