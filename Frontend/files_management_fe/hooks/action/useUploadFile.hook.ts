import { useState } from "react";

export function useUploadFiles() {
    const [files, setFiles] = useState<File[]>([]);

    const addFiles = (newFiles: File[]) => {
        setFiles((current) => [
            ...current,
            ...newFiles
        ]); 
    }

    const removeFile = (index: number) => {
        setFiles((current) => current.filter((_, i) => i !== index));
    }

    const clearFiles = () => setFiles([]);

    return {
        files,
        addFiles,
        removeFile,
        clearFiles
    }
}