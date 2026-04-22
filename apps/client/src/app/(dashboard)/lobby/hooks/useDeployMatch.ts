"use client";

import { useCallback, useState } from "react";
import { Socket } from "socket.io-client";

interface UseDeployMatchOptions {
  socket: Socket;
  onNoScript: () => void;
}

export interface UseDeployMatchReturn {
  handleDeployMatch: () => void;
  deploying: boolean;
}

export function useDeployMatch({ socket, onNoScript }: UseDeployMatchOptions): UseDeployMatchReturn {
  const [deploying, setDeploying] = useState(false);

  const handleDeployMatch = useCallback(() => {
    const scriptId = localStorage.getItem("selectedScriptId");
    if (!scriptId) {
      onNoScript();
      return;
    }
    setDeploying(true);
    socket.emit("createMatch", { scriptId, hostName: "Player" });
    // deploying resets naturally on navigation (matchCreated → unmount)
  }, [socket, onNoScript]);

  return { handleDeployMatch, deploying };
}
