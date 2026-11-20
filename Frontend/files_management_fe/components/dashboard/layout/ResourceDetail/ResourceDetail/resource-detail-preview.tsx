interface ResourceDetailPreviewProps {
    extension: string;
    previewUrl?: string | null;
}

export default function ResourceDetailPreview({
    extension,
    previewUrl,
}: ResourceDetailPreviewProps) {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const videoExtensions = ["mp4", "mov", "webm", "mkv"];

    const normalizedExtension = extension.toLowerCase().replace(".", "");

    const isImage = imageExtensions.includes(normalizedExtension);
    const isVideo = videoExtensions.includes(normalizedExtension);

    if (!previewUrl) return null;

    if (isImage) {
        return (
            <div className="mb-5 overflow-hidden rounded-xl border bg-muted">
                <img
                    src={previewUrl}
                    alt="File preview"
                    className="aspect-video w-full object-contain"
                />
            </div>
        );
    }

    if (isVideo) {
        return (
            <div className="mb-5 overflow-hidden rounded-xl border bg-black">
                <video
                    src={previewUrl}
                    controls
                    className="aspect-video w-full object-contain"
                />
            </div>
        );
    }

    return null;
}