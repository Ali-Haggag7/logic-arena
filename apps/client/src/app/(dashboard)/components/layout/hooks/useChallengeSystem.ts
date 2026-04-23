import { useState, useCallback } from "react";
import { useGlobalSocket } from "../../../../../hooks/useGlobalSocket";

export function useChallengeSystem() {
  const [incomingChallenge, setIncoming] = useState<{ challengerId: string; challengerName: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "info" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "info" | "error" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const { sendChallenge, acceptChallenge } = useGlobalSocket({
    onChallengeReceived: (data) => setIncoming(data),
    onChallengeSent: () => showToast("⚔ CHALLENGE SENT — AWAITING RESPONSE"),
    onChallengeFailed: () => showToast("TARGET IS OFFLINE", "error"),
    onChallengeAccepted: () => showToast("CHALLENGE ACCEPTED — DEPLOYING TO ARENA"),
  });

  return { incomingChallenge, setIncoming, toast, sendChallenge, acceptChallenge };
}
