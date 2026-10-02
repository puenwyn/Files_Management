import { z } from "zod";
import { folderResponseSchema } from "../folder/folder-response.schema";

export const starredFolderResponseSchema = folderResponseSchema.extend({
    starredAt: z.coerce.date(),
});

export const starredListResponseSchema = z.object({
    folders: z.array(starredFolderResponseSchema),
});

export type StarredFolderResponse = z.infer<
    typeof starredFolderResponseSchema
>;

export type StarredListResponse = z.infer<
    typeof starredListResponseSchema
>;