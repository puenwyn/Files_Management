"use client";

import { useEffect } from "react";
import { useWebSocket } from "@/hooks/socket/useWebSocket";

export function WebSocketTest() {
    const { socket } = useWebSocket();

    useEffect(() => {
        const handleTest = (data: { message: string }) => {
            console.log("🔥 SERVER:", data.message);
        };

        socket.on("test", handleTest);

        return () => {
            socket.off("test", handleTest);
        };
    }, [socket]);

    return null;
}
