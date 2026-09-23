import { ResourceDetailUser } from "@/schemas/folder/folder-detail-response.schema";
import ResourceSection from "../resource-section";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";

interface ResourceDetailAccessProps {
    owner: ResourceDetailUser;
    users: ResourceDetailUser[];
}

export default function ResourceDetailAccess({
    owner,
    users,
}: ResourceDetailAccessProps) {
    const accessUsers = [owner, ...users];

    return (
        <ResourceSection title="Access">
            <div className="flex items-center gap-3">
                <AvatarGroup>
                    {accessUsers.slice(0, 3).map((user) => (
                        <Avatar
                            key={user.id}
                            className="h-9 w-9"
                        >
                            <AvatarFallback>
                                {user.fullName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    ))}

                    {accessUsers.length > 3 && (
                        <AvatarGroupCount>
                            +{accessUsers.length - 3}
                        </AvatarGroupCount>
                    )}
                </AvatarGroup>

                <span className="text-sm text-muted-foreground">
                    {accessUsers.length} people with access
                </span>
            </div>
        </ResourceSection>
    );
}