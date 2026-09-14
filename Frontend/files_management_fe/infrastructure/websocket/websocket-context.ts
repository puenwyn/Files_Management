"use client"
import { createContext } from "react";
import { socket } from "./socket"

type WebSocketContextValue = {
    socket: typeof socket;
}

export const WebSocketContext = createContext<WebSocketContextValue | null>(null);