"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { LobbyMatch } from "../components/LobbyMatchCard";
// Socket.IO connects to the server origin — strip the /api path suffix if present
const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api").replace(/\/api$/, "");

export type ConnectionStatus = "connecting" | "connected" | "error";

export interface UseLobbySocketReturn {
  matches: LobbyMatch[];
  connectionStatus: ConnectionStatus;
  retryKey: number;
  setRetryKey: React.Dispatch<React.SetStateAction<number>>;
  socket: Socket;
}

export function useLobbySocket(): UseLobbySocketReturn {
  const router = useRouter();
  const [matches, setMatches] = useState<LobbyMatch[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [retryKey, setRetryKey] = useState(0);

  const socket = useMemo(() => {
    if (typeof window === "undefined") return io(SOCKET_URL, { autoConnect: false });

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwtToken") ||
      null;

    if (!token) {
      // Token not yet available — surface an error immediately instead of
      // firing a doomed handshake that the server will reject.
      setConnectionStatus("error");
      return io(SOCKET_URL, { autoConnect: false });
    }

    return io(SOCKET_URL, {
      autoConnect: false,
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }, [retryKey]);

  useEffect(() => {
    const storedScriptId = localStorage.getItem("selectedScriptId");

    socket.connect();
    setConnectionStatus("connecting");

    const onConnect = () => {
      console.log("Connected to lobby socket");
      socket.emit("getLobby");
      setTimeout(() => setConnectionStatus("connected"), 500);
    };

    const onConnectError = () => {
      setConnectionStatus("error");
    };

    const onLobbyList = (data: LobbyMatch[]) => {
      setMatches(data);
      setConnectionStatus("connected");
    };

    const onLobbyUpdated = (data: LobbyMatch[]) => {
      setMatches(data);
    };

    const onMatchCreated = (data: { matchId: string }) => {
      if (storedScriptId) {
        router.push(`/arena?scriptId=${storedScriptId}&matchId=${data.matchId}`);
      }
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("lobbyList", onLobbyList);
    socket.on("lobbyUpdated", onLobbyUpdated);
    socket.on("matchCreated", onMatchCreated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("lobbyList", onLobbyList);
      socket.off("lobbyUpdated", onLobbyUpdated);
      socket.off("matchCreated", onMatchCreated);
      socket.disconnect();
    };
  }, [socket, router]);

  return { matches, connectionStatus, retryKey, setRetryKey, socket };
}
