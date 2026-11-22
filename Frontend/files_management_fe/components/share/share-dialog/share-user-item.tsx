import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ACLUserResponse } from "@/schemas/acl/acl-user-response.schema";
import { PermissionType } from "@/constants/permission-type";
import { SharePermissionSelect } from "./share-permission-select";
import { X } from "lucide-react";

interface ShareUserItemProps {
    user: ACLUserResponse;
    onPermissionChange: (
        id: string,
        permission: PermissionType,
    ) => void;
    onRemove: (userId: string) => void;
    isRemoving?: boolean;
}

export function ShareUserItem({
    user,
    onPermissionChange,
    onRemove,
    isRemoving = false,
}: ShareUserItemProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <Avatar className="size-10">
                <AvatarImage
                    src="/assets/images/aurorabackground.jpg"
                />
                <AvatarFallback>
                    {user.fullName.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                        {user.fullName}
                    </p>

                    {user.isOwner && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                            Owner
                        </span>
                    )}
                </div>

                <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                </p>
            </div>

            {user.isOwner ? (
                <span className="text-sm text-muted-foreground">
                    Owner
                </span>
            ) : (
                <>
                    <SharePermissionSelect
                        value={user.permissionType}
                        onChange={(permission) =>
                            onPermissionChange(user.id, permission)
                        }
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isRemoving}
                        onClick={() => onRemove(user.id)}
                        title="Remove access"
                        className="shrink-0"
                    >
                        <X className="size-4 text-muted-foreground" />
                    </Button>
                </>
            )}
        </div>
    );
}