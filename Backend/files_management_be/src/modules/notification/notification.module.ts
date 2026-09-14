import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { UserModule } from "../user/user.module";
import { NotificationController } from "./notification.controller";
import { WebSocketModule } from "src/infrastructure/websocket/websocket.module";

@Module({
    imports: [UserModule, WebSocketModule],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService]
})
export class NotificationModule { }