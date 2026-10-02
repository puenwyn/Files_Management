import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Resource } from "@/types/resource.type";
import { ReactNode } from "react";

export interface ResourceTableResource extends Resource {
    owner?: string | null;
    modifiedAt?: string | null;
    size?: string | null;
    location?: string | null;
    sharedBy?: string | null;
    deletedAt?: string | null;
    starredAt?: string | null;
}

export type ResourceTableColumnKey =
    | "name"
    | "owner"
    | "modifiedAt"
    | "size"
    | "location"
    | "sharedBy"
    | "deletedAt"
    | "starredAt"
    | "actions";

export interface ResourceTableColumn {
    key: ResourceTableColumnKey;
    label: string;
    className?: string;
    getValue: (resource: ResourceTableResource) => ReactNode;
}

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

function formatDate(date?: string | null) {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(parsedDate);
}

function renderOwner(owner?: string | null) {
    if (!owner) return "-";

    return (
        <div className="flex items-center gap-2 min-w-0">
            <Avatar className="size-7 shrink-0">
                <AvatarFallback className="text-xs">
                    {getInitials(owner)}
                </AvatarFallback>
            </Avatar>

            <span className="truncate">
                {owner}
            </span>
        </div>
    );
}

export const defaultResourceTableColumns: ResourceTableColumn[] = [
    {
        key: "name",
        label: "Name",
        className: "min-w-[280px]",
        getValue: (resource) => (
            <span className="block truncate max-w-[420px]">
                {resource.name}
            </span>
        ),
    },
    {
        key: "owner",
        label: "Owner",
        className: "w-[180px]",
        getValue: (resource) => renderOwner(resource.owner),
    },
    {
        key: "modifiedAt",
        label: "Modified",
        className: "w-[180px] whitespace-nowrap",
        getValue: (resource) => formatDate(resource.modifiedAt),
    },
    {
        key: "size",
        label: "Size",
        className: "w-[120px] text-right",
        getValue: (resource) => resource.size ?? "-",
    },
    {
        key: "actions",
        label: "",
        className: "w-[60px] text-right",
        getValue: () => null,
    },
];

export const starredResourceTableColumns: ResourceTableColumn[] = [
    {
        key: "name",
        label: "Name",
        className: "min-w-[280px]",
        getValue: (resource) => (
            <span className="block truncate max-w-[420px]">
                {resource.name}
            </span>
        ),
    },
    {
        key: "owner",
        label: "Owner",
        className: "w-[180px]",
        getValue: (resource) => renderOwner(resource.owner),
    },
    {
        key: "modifiedAt",
        label: "Modified",
        className: "w-[180px] whitespace-nowrap",
        getValue: (resource) => formatDate(resource.modifiedAt),
    },
    {
        key: "starredAt",
        label: "Starred",
        className: "w-[180px] whitespace-nowrap",
        getValue: (resource) => formatDate(resource.starredAt),
    },
];