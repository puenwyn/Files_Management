import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PermissionType } from "@/constants/permission-type";

interface SharePermissionSelectProps {
    value: PermissionType;
    onChange: (value: PermissionType) => void;
}

export function SharePermissionSelect({
    value,
    onChange,
}: SharePermissionSelectProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    variant="outline"
                    className="h-11 min-w-[115px] justify-between"
                >
                    {value === PermissionType.SHARE
                        ? "Can share"
                        : value === PermissionType.EDIT
                            ? "Can edit"
                            : "Can view"}

                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() =>
                        onChange(PermissionType.SHARE)
                    }
                >
                    Can share

                    {value === PermissionType.SHARE && (
                        <Check className="ml-auto h-4 w-4" />
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        onChange(PermissionType.EDIT)
                    }
                >
                    Can edit

                    {value === PermissionType.EDIT && (
                        <Check className="ml-auto h-4 w-4" />
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        onChange(PermissionType.VIEW)
                    }
                >
                    Can view

                    {value === PermissionType.VIEW && (
                        <Check className="ml-auto h-4 w-4" />
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}