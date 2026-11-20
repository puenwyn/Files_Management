
"use client";

import { ResourceType } from "@/types/resource.type";

import { useGetFolderDetail } from "@/hooks/folder/useGetFolderDetail.hook";
import { useGetFileDetail } from "@/hooks/file/useGetFileDetail.hook";
import { useGetFilePreview } from "@/hooks/file/useGetFilePreview.hook";

import ResourceSection from "../resource-section";
import ResourceDetailInfoItem from "./resource-detail-info-item";
import ResourceDetailAccess from "./resource-detail-access";
import ResourceDetailPreview from "./resource-detail-preview";

interface ResourceDetailProps {
    resource: ResourceType | null;
    resourceId: string | null;
}

export default function ResourceDetail({
    resource,
    resourceId,
}: ResourceDetailProps) {
    const isFolder = resource === ResourceType.FOLDER;
    const isFile = resource === ResourceType.FILE;

    const folderQuery = useGetFolderDetail(
        isFolder ? resourceId ?? "" : ""
    );

    const fileQuery = useGetFileDetail(
        isFile ? resourceId ?? "" : ""
    );

    const previewQuery = useGetFilePreview(
        isFile ? resourceId ?? "" : ""
    );

    if (!resource || !resourceId) return null;

    if (isFolder && folderQuery.isLoading) {
        return <div>Loading...</div>;
    }

    if (isFile && fileQuery.isLoading) {
        return <div>Loading...</div>;
    }

    // Folder detail
    if (isFolder) {
        const folder = folderQuery.data;

        if (!folder) return null;

        return (
            <div>
                <ResourceSection title="Folder detail">
                    <ResourceDetailInfoItem
                        title="Owner"
                        content={folder.owner.fullName}
                    />

                    <ResourceDetailInfoItem
                        title="Modified"
                        content={folder.updatedAt.toLocaleString()}
                    />

                    <ResourceDetailInfoItem
                        title="Created"
                        content={folder.createdAt.toLocaleString()}
                    />
                </ResourceSection>

                <ResourceDetailAccess
                    owner={folder.owner}
                    users={folder.users}
                />
            </div>
        );
    }

    // File detail
    if (isFile) {
        const file = fileQuery.data;

        if (!file) return null;

        return (
            <div>
                <ResourceDetailPreview
                    extension={file.extension}
                    previewUrl={previewQuery.data?.url}
                />

                <ResourceSection title="File detail">
                    <ResourceDetailInfoItem
                        title="Type"
                        content={file.mimeType || file.extension}
                    />

                    <ResourceDetailInfoItem
                        title="Owner"
                        content={file.owner.fullName}
                    />

                    <ResourceDetailInfoItem
                        title="Modified"
                        content={file.updatedAt.toLocaleString()}
                    />

                    <ResourceDetailInfoItem
                        title="Created"
                        content={file.createdAt.toLocaleString()}
                    />
                </ResourceSection>

                <ResourceDetailAccess
                    owner={file.owner}
                    users={file.users}
                />
            </div>
        );
    }

    return null;
}
