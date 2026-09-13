import { Button } from "@/components/ui/button";

interface ShareFooterProps {
    onCancel: () => void;
    onDone: () => void;
}

export function ShareFooter({
    onCancel,
    onDone,
}: ShareFooterProps) {
    return (
        <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
            <Button variant="outline" onClick={onCancel}>
                Cancel
            </Button>

            <Button onClick={onDone} className="min-w-[90px]">
                Done
            </Button>
        </div>
    );
}