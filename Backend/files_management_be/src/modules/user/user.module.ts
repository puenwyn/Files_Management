import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}