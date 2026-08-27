import { z } from "zod";

export const folderResponseSchema = z.object({
    id: z.string(),
    folderName: z.string(),
    parentFolderId: z.string().nullable(),
    status: z.enum(["SHOW", "HIDDEN"]),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const folderListResponseSchema = z.array(
    folderResponseSchema
);

export type FolderResponse = z.infer<typeof folderResponseSchema>;
export type FolderListResponse = z.infer<typeof folderListResponseSchema>;