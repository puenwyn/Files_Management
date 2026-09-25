import z from "zod";

export const createFolderRequestSchema = z.object({
    folderName: z.string().min(1, "Folder name is required"),
    parentFolderId: z.string().uuid().optional(),
    driveId: z.string().uuid().optional(),
});

export type CreateFolderRequest = z.infer<typeof createFolderRequestSchema>;