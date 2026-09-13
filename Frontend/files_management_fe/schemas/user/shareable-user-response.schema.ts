import { z } from "zod";

export const shareableUserResponseSchema = z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    email: z.string().email(),
});

export const shareableUserListResponseSchema = z.array(
    shareableUserResponseSchema,
);

export type ShareableUserResponse = z.infer<
    typeof shareableUserResponseSchema
>;

export type ShareableUserListResponse = z.infer<
    typeof shareableUserListResponseSchema
>;