import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import cookie from "cookie";
import { AuthService } from "src/modules/auth/auth.service";
import { Notification } from "@prisma/client";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
})
export class AppWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server!: Server;

    constructor(
        private readonly authService: AuthService,
    ) { }

    async handleConnection(socket: Socket) {
        try {
            const cookies = cookie.parseCookie(socket.handshake.headers.cookie ?? "");
            const token = cookies.access_token;
            const { sub } = await this.authService.verifyAccessToken(token!);

            socket.join(`user:${sub}`);
            console.log(`Client connected: ${socket.id}`);
        } catch {
            socket.disconnect();
        }
    }

    handleDisconnect(socket: Socket) {
        console.log(`Client disconnected: ${socket.id}`);
    }

    sendNotification(receiverId: string, notification: Notification) {
        this.server.to(`user:${receiverId}`).emit("notification", notification);
    }
}