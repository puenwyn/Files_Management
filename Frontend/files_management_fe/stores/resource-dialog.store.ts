import { create } from "zustand";
import { ResourceType } from "@/types/resource.type";
import { PermissionType } from "@/constants/permission-type";

interface ResourceDialogState {
    resource: {
        id: string;
        name: string;
        type: ResourceType;
        driveId: string | null;
        parentFolderId: string | null;
        permissionType?: PermissionType | null;
        extension?: string;
    } | null;

    renameOpen: boolean;
    shareOpen: boolean;

    openRename: (resource: ResourceDialogState["resource"]) => void;
    openShare: (resource: ResourceDialogState["resource"]) => void;
    closeDialogs: () => void;
}

export const useResourceDialogStore = create<ResourceDialogState>((set) => ({
    resource: null,
    renameOpen: false,
    shareOpen: false,

    openRename: (resource) => set({ resource, renameOpen: true }),

    openShare: (resource) => set({ resource, shareOpen: true }),

    closeDialogs: () =>
        set({
            resource: null,
            renameOpen: false,
            shareOpen: false,
        }),
}));