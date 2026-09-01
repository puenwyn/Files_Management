import z from "zod";

export const folderPathItemSchema = z.object({
    id: z.string(),
    folderName: z.string(),
});

export const folderPathResponseSchema = z.object({
    driveId: z.string(),
    folders: z.array(folderPathItemSchema),
});

export type FolderPathItem = z.infer<typeof folderPathItemSchema>;
export type FolderPathResponse = z.infer<typeof folderPathResponseSchema>;