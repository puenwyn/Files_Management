import { Skeleton } from "@/components/ui/skeleton";

export default function FolderItemSkeleton() {
    return (
        <div className="bg-card p-3 rounded-lg">
            <div className="flex justify-between">
                <Skeleton className="size-[30px] rounded-md" />
            </div>

            <Skeleton className="mt-2 h-5 w-3/4" />
        </div>
    );
}