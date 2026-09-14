import { Module } from '@nestjs/common';
import { AppWebSocketGateway } from './websocket.gateway';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [AppWebSocketGateway],
    exports: [AppWebSocketGateway]
})
export class WebSocketModule { }
