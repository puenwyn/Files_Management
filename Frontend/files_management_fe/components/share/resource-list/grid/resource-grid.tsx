import FolderItem from "@/components/dashboard/home/list/gridview/folder-item";
import FileItem from "@/components/dashboard/home/list/gridview/file-item";
import { PermissionType } from "@/constants/permission-type";
import { Resource, ResourceType } from "@/types/resource.type";

interface ResourceGridProps {
    data: Resource[];
}

export default function ResourceGrid({
    data,
}: ResourceGridProps) {
    return (
        <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.map((item) => {
                if (item.type === ResourceType.FOLDER) {
                    return (
                        <FolderItem
                            key={item.id}
                            id={item.id}
                            name={item.name ?? ""}
                            driveId={item.driveId ?? ""}
                            parentFolderId={item.parentFolderId ?? null}
                            isHidden={item.status === "HIDDEN"}
                            permissionType={
                                item.permissionType ?? undefined
                            }
                            canAccess={item.isAccessed}
                        />
                    );
                }

                if (item.type === ResourceType.FILE) {
                    return (
                        <FileItem
                        />
                    );
                }

                return null;
            })}
        </div>
    );
}