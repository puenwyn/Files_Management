import { User } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
    user: Pick<User, "id">;
}