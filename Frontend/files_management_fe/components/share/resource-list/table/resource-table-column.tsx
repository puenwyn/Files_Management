import { ResourceType } from "@/types/resource.type";
import { ReactNode } from "react";

export interface ResourceTableResource {
    id: string;
    name: string;
    type: ResourceType;
    owner?: string | null;
    modifiedAt?: string | null;
    size?: string | null;
    location?: string | null;
    sharedBy?: string | null;
    deletedAt?: string | null;
}

export type ResourceTableColumnKey =
    | "name"
    | "owner"
    | "modifiedAt"
    | "size"
    | "location"
    | "sharedBy"
    | "deletedAt"
    | "actions";

export interface ResourceTableColumn {
    key: ResourceTableColumnKey;
    label: string;
    className?: string;
    getValue: (resource: ResourceTableResource) => ReactNode;
}

export const defaultResourceTableColumns: ResourceTableColumn[] = [
    {
        key: "name",
        label: "Name",
        className: "w-full",
        getValue: (resource) => resource.name,
    },
    {
        key: "owner",
        label: "Owner",
        getValue: (resource) => resource.owner ?? "-",
    },
    {
        key: "modifiedAt",
        label: "Modified",
        getValue: (resource) => resource.modifiedAt ?? "-",
    },
    {
        key: "size",
        label: "Size",
        getValue: (resource) => resource.size ?? "-",
    },
];