"use client"
import { ReactNode, useEffect } from "react";
import { socket } from "./socket";
import { WebSocketContext } from "./websocket-context";

interface WebSocketProviderProps {
    children: ReactNode;
}

export function WebSocketProvider({
    children
}: WebSocketProviderProps) {
    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        }
    }, []);

    return (
        <WebSocketContext value={{ socket }}>
            {children}
        </WebSocketContext>
    )
}