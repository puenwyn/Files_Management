import { ResourceType } from "@/types/resource.type"
import ResourceDetailItem from "./resource-detail-item"

interface ResourceDetailProps {
    resource: ResourceType
}

export default function ResourceDetail({
    resource
}: ResourceDetailProps) {
    return (
        <div className="">
            <h3>{`${resource === ResourceType.FOLDER ? "Folder" : "File"} detail`}</h3>
            <ResourceDetailItem
                title="Type"
                content="Video"
            />
            <ResourceDetailItem
                title="Owner"
                content="Nguyen Huy"
            />
            <ResourceDetailItem
                title="Modified"
                content="16 Dec 2026 by me"
            />
            <ResourceDetailItem
                title="Created"
                content="16 Dec 2026 by me"
            />
        </div>
    )
}