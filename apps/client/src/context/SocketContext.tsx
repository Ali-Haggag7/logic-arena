"use client";

import { createContext, useContext } from 'react';

interface SocketContextType {
  sendChallenge: (targetUserId: string) => void;
}

export const SocketContext = createContext<SocketContextType>({
  sendChallenge: () => {},
});

export const useSocket = () => useContext(SocketContext);
