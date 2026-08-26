import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
    loading: boolean;
}

export default function LoadingOverlay({
    loading,
}: LoadingOverlayProps) {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader2 className="size-14 animate-spin text-foreground/50" />
        </div>
    );
}