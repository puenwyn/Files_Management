import { User } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
    user: Pick<User, "id">;
    cookies: {
        hidden_token?: string;
    };
}