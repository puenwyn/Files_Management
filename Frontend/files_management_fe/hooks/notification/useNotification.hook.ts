import { toast } from "@/components/ui/toast";
import { socket } from "@/infrastructure/websocket/socket";
import { NotificationResponse } from "@/schemas/notification/notification-response.schema";
import { useEffect } from "react";

export function useNotification() {
    console.log("Register notification listener");
    console.log("Socket connected:", socket.connected);

    useEffect(() => {
        const handleNotification = (notification: NotificationResponse) => {
            console.log("🔥 RECEIVED NOTIFICATION:", notification);

            toast.add({
                title: "Notification",
                description: "You have new notification",
            });
        };

        socket.on("notification", handleNotification);

        return () => {
            socket.off("notification", handleNotification);
        };
    }, []);
}