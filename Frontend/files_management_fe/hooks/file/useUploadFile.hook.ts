import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { fileService } from "@/services/file/file.service";
import { UploadFile } from "@/types/file-upload.type";

interface UseUploadFilesProps {
    driveId: string | null;
    parentFolderId: string | null;
    onSuccess?: () => void;
}

const getFileInfo = (file: File) => {
    const index = file.name.lastIndexOf(".");
    return {
        name: index === -1 ? file.name : file.name.slice(0, index),
        extension: index === -1 ? "" : file.name.slice(index + 1).toLowerCase(),
    };
};

const generateSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hash = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
};

export function useUploadFiles({ driveId, parentFolderId, onSuccess }: UseUploadFilesProps) {
    const queryClient = useQueryClient();
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isPreparing, setIsPreparing] = useState(false);

    const setFileStatus = (label: string, status: UploadFile["status"], error?: string) => {
        setFiles(prev => prev.map(item => item.metadata.label === label ? { ...item, status, error } : item));
    };

    const addFiles = async (selectedFiles: File[]) => {
        if (!selectedFiles.length) return;
        setIsPreparing(true);

        try {
            const preparedFiles = await Promise.all(selectedFiles.map(async file => {
                const { name, extension } = getFileInfo(file);
                const label = crypto.randomUUID();
                const sha256 = await generateSHA256(file);

                return {
                    file,
                    metadata: { label, name, extension, size: file.size, mimeType: file.type, sha256 },
                    status: "pending" as const,
                };
            }));

            setFiles(prev => [...prev, ...preparedFiles]);
        } catch (error) {
            toast.add({
                type: "error",
                description: error instanceof Error ? error.message : "Failed to prepare files",
            });
        } finally {
            setIsPreparing(false);
        }
    };

    const removeFile = (label: string) => {
        setFiles(prev => prev.filter(item => item.metadata.label !== label));
    };

    const clearFiles = () => setFiles([]);

    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!files.length) throw new Error("No files selected");

            const response = await fileService.createUpload({
                ...(parentFolderId ? { parentFolderId } : { driveId: driveId! }),
                files: files.map(item => item.metadata),
            });

            const results = await Promise.all(response.uploads.map(async upload => {
                const item = files.find(item => item.metadata.label === upload.label);
                if (!item) return false;

                try {
                    setFileStatus(upload.label, "uploading");
                    await fileService.uploadToStorage(upload.url, item.file);
                    await fileService.completeUpload(upload.fileVersionId);
                    setFileStatus(upload.label, "success");
                    return true;
                } catch (error) {
                    setFileStatus(
                        upload.label,
                        "error",
                        error instanceof Error ? error.message : "Upload failed"
                    );
                    return false;
                }
            }));

            return results;
        },
        onSuccess: results => {
            const successCount = results.filter(Boolean).length;
            const failedCount = results.length - successCount;

            queryClient.invalidateQueries({
                queryKey: parentFolderId
                    ? ["folder-children", parentFolderId]
                    : ["drive-folders", driveId],
            });

            if (failedCount === 0) {
                toast.add({ type: "success", description: "Files uploaded successfully!" });
            } else {
                toast.add({
                    type: "error",
                    description: `${successCount} files uploaded, ${failedCount} failed.`,
                });
            }
        },
    });

    return {
        files,
        addFiles,
        removeFile,
        clearFiles,
        upload: uploadMutation.mutate,
        isPreparing,
        isLoading: uploadMutation.isPending,
        isError: uploadMutation.isError,
        error: uploadMutation.error,
        isSuccess: uploadMutation.isSuccess,
    };
}