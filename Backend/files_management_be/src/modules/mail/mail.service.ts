import { Injectable } from "@nestjs/common";
import { AppConfigService } from "src/config/app_config.service";
import * as nodemailer from "nodemailer";
import * as path from "path";
import * as fs from 'fs';

@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter;

    constructor(private readonly appConfig: AppConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.appConfig.MAIL_HOST,
            port: this.appConfig.MAIL_PORT,
            secure: this.appConfig.MAIL_SECURE,
            auth: {
                user: this.appConfig.MAIL_USER,
                pass: this.appConfig.MAIL_PASSWORD
            }
        });
    }

    async sendOTP(email: string, otp: string) {
        const filePath = path.join(process.cwd(), "src/modules/mail/otp.html");

        let html = fs.readFileSync(filePath, "utf-8");

        html = html.replace("{{otp}}", otp);

        console.log(`${this.appConfig.MAIL_HOST} + ${this.appConfig.MAIL_PORT} + ${this.appConfig.MAIL_SECURE}`);

        await this.transporter.sendMail({
            from: this.appConfig.MAIL_USER,
            to: email,
            subject: 'Reset Password OTP',
            html: html,
        });
    }
}