import {
    Check,
    ChevronDown,
    Globe,
    Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareAccessType, SharePermission } from "@/types/share.type";

interface ShareGeneralAccessProps {
    accessType: ShareAccessType;
    permission: SharePermission;

    onAccessTypeChange: (value: ShareAccessType) => void;
    onPermissionChange: (value: SharePermission) => void;
}

export function ShareGeneralAccess({
    accessType,
    permission,
    onAccessTypeChange,
    onPermissionChange,
}: ShareGeneralAccessProps) {
    return (
        <section className="mt-7">
            <h3 className="mb-3 text-sm font-semibold">
                General access
            </h3>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <button className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition hover:bg-muted/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            {accessType === "RESTRICTED" ? (
                                <Lock className="h-5 w-5" />
                            ) : (
                                <Globe className="h-5 w-5" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">
                                {accessType === "RESTRICTED"
                                    ? "Restricted"
                                    : "Anyone with the link"}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {accessType === "RESTRICTED"
                                    ? "Only people with access can open"
                                    : "Anyone with this link can access"}
                            </p>
                        </div>

                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    className="w-[500px]"
                >
                    <DropdownMenuItem
                        onClick={() =>
                            onAccessTypeChange("RESTRICTED")
                        }
                    >
                        <Lock className="mr-3 h-4 w-4" />

                        <div>
                            <p className="font-medium">Restricted</p>
                            <p className="text-xs text-muted-foreground">
                                Only people with access can open
                            </p>
                        </div>

                        {accessType === "RESTRICTED" && (
                            <Check className="ml-auto h-4 w-4" />
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => onAccessTypeChange("PUBLIC")}
                    >
                        <Globe className="mr-3 h-4 w-4" />

                        <div>
                            <p className="font-medium">
                                Anyone with the link
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Anyone with this link can access
                            </p>
                        </div>

                        {accessType === "PUBLIC" && (
                            <Check className="ml-auto h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {accessType === "PUBLIC" && (
                <div className="mt-2 flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
                    <div>
                        <p className="text-sm font-medium">
                            Link permission
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Choose what people with the link can do
                        </p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline" size="sm">
                                {permission === "EDIT"
                                    ? "Can edit"
                                    : "Can view"}

                                <ChevronDown className="ml-2 h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => onPermissionChange("VIEW")}
                            >
                                Can view

                                {permission === "VIEW" && (
                                    <Check className="ml-auto h-4 w-4" />
                                )}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => onPermissionChange("EDIT")}
                            >
                                Can edit

                                {permission === "EDIT" && (
                                    <Check className="ml-auto h-4 w-4" />
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </section>
    );
}