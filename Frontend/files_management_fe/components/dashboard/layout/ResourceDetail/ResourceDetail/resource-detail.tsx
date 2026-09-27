"use client"
import { ResourceType } from "@/types/resource.type"
import ResourceDetailInfoItem from "./resource-detail-info-item"
import ResourceSection from "../resource-section"
import ResourceDetailAccess from "./resource-detail-access"
import { useGetFolderDetail } from "@/hooks/folder/useGetFolderDetail.hook";

interface ResourceDetailProps {
    resource: ResourceType | null;
    resourceId: string | null;
}

export default function ResourceDetail({
    resource,
    resourceId
}: ResourceDetailProps) {

    const { data, isLoading } = useGetFolderDetail(resourceId ?? "");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return null;
    }

    return (
        <div className="">
            <ResourceSection title={`${resource === ResourceType.FOLDER ? "Folder" : "File"} detail`}>
                {resource === ResourceType.FILE && (
                    <ResourceDetailInfoItem
                        title="Type"
                        content="Video"
                    />
                )}
                <ResourceDetailInfoItem
                    title="Type"
                    content="Video"
                />
                <ResourceDetailInfoItem
                    title="Owner"
                    content={data.owner.fullName}
                />
                <ResourceDetailInfoItem
                    title="Modified"
                    content={data.updatedAt}
                />
                <ResourceDetailInfoItem
                    title="Created"
                    content={data.createdAt}
                />
            </ResourceSection>

            <ResourceDetailAccess
                owner={data.owner}
                users={data.users}
            />
        </div>
    )
}