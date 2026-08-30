import z from "zod";

export const renameFolderRequestSchema = z.object({
    newFolderName: z.string().min(1, "You must to enter new folder name")
});

export type RenameFolderRequest = z.infer<typeof renameFolderRequestSchema>;