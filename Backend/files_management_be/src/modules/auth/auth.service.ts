import { RegisterDTO } from "./dtos/register.dto";
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { LoginDTO } from "./dtos/login.dto";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    private async generateAccessToken(userId: string) {
        return this.jwtService.signAsync({
            sub: userId,
        });
    }

    async register(dto: RegisterDTO) {
        const existedUsername = await this.userService.findByUsername(dto.username);
        const existedEmail = await this.userService.findByEmail(dto.email);

        if (existedUsername) throw new ConflictException("This username already exists!");
        if (existedEmail) throw new ConflictException("This email already exists!");

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        await this.userService.create({
            fullName: dto.fullName,
            username: dto.username,
            email: dto.email,
            hashedPassword,
        });
    }

    async login(dto: LoginDTO) {
        const user = await this.userService.findByUsername(dto.username);
        if (!user) throw new UnauthorizedException("Invalid username or password!");

        const isMatched = await bcrypt.compare(
            dto.password,
            user.hashedPassword
        );
        if (!isMatched) throw new UnauthorizedException("Invalid username or password!");

        const accessToken = await this.generateAccessToken(user.id);

        return {
            accessToken,
        };
    }
}