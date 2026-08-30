import { Request } from "express";

export interface RefreshRequest extends Request {
    user: {
        id: string;
        jti: string;
    };
}