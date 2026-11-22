"use client";

import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SharePermissionSelect } from "./share-permission-select";

import { useSharePeople } from "@/hooks/acl/useSharePeople.hook";
import { ResourceType } from "@/types/resource.type";

interface ShareAddPeopleProps {
    resourceId: string;
    resoureType: ResourceType;
}

export function ShareAddPeople({
    resourceId,
    resoureType
}: ShareAddPeopleProps) {
    const {
        keyword,
        users,
        selectedUser,
        permission,
        isLoading,
        isSharing,
        setKeyword,
        selectUser,
        setPermission,
        shareUser,
    } = useSharePeople(resourceId, resoureType);

    return (
        <section>
            <h3 className="mb-3 text-sm font-semibold">
                Add people
            </h3>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <UserPlus
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                        placeholder="Enter name or email..."
                        className="h-11 pl-10"
                    />

                    {keyword.trim() && !selectedUser && (
                        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border bg-background shadow-lg">
                            {isLoading ? (
                                <div className="px-4 py-3 text-sm text-muted-foreground">
                                    Searching...
                                </div>
                            ) : users.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-muted-foreground">
                                    No users found
                                </div>
                            ) : (
                                users.map((user) => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() =>
                                            selectUser(user)
                                        }
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                                            {user.fullName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                {user.fullName}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <SharePermissionSelect
                    value={permission}
                    onChange={setPermission}
                />

                <Button
                    type="button"
                    onClick={shareUser}
                    disabled={!selectedUser || isSharing}
                    className="h-11 px-5"
                >
                    {isSharing ? "Adding..." : "Add"}
                </Button>
            </div>
        </section>
    );
}