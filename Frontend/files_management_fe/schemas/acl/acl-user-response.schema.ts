import { PermissionType } from "@/constants/permission-type";
import { z } from "zod";

export const aclUserResponseSchema = z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    email: z.string().email(),
    permissionType: z.enum([
        PermissionType.VIEW,
        PermissionType.EDIT,
        PermissionType.SHARE,
    ]),
    isOwner: z.boolean(),
});

export const aclUserListResponseSchema = z.array(
    aclUserResponseSchema
);

export type ACLUserResponse = z.infer<
    typeof aclUserResponseSchema
>;

export type ACLUserListResponse = z.infer<
    typeof aclUserListResponseSchema
>;