import z from "zod";

export const renameFileRequestSchema = z.object({ newName: z.string().min(1, "You must enter new file name") });

export type RenameFileRequest = z.infer<typeof renameFileRequestSchema>;