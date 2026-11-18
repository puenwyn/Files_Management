
import FolderItem from "@/components/dashboard/home/list/gridview/folder-item";
import FileItem from "@/components/dashboard/home/list/gridview/file-item";
import { Resource, ResourceType } from "@/types/resource.type";

interface ResourceGridProps {
    data: Resource[];
}

export default function ResourceGrid({
    data,
}: ResourceGridProps) {
    const folders = data.filter((item) => item.type === ResourceType.FOLDER);
    const files = data.filter((item) => item.type === ResourceType.FILE);

    return (
        <div className="w-full flex flex-col gap-8">
            {folders.length > 0 && (
                <section className="flex flex-col gap-4">
                    <h3 className="text-base font-semibold">
                        Folders
                    </h3>

                    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {folders.map((item) => (
                            <FolderItem
                                key={item.id}
                                id={item.id}
                                name={item.name ?? ""}
                                driveId={item.driveId ?? ""}
                                parentFolderId={item.parentFolderId ?? null}
                                isHidden={item.status === "HIDDEN"}
                                permissionType={item.permissionType ?? undefined}
                                canAccess={item.isAccessed}
                                isStarred={item.isStarred}
                            />
                        ))}
                    </div>
                </section>
            )}

            {files.length > 0 && (
                <section className="flex flex-col gap-4">
                    <h3 className="text-base font-semibold">
                        Files
                    </h3>

                    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {files.map((item) => (
                            <FileItem
                                key={item.id}
                                id={item.id}
                                name={item.name ?? ""}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
