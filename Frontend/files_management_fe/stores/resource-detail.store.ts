import { ResourceType } from "@/types/resource.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ResourceDetailState = {
    resourceId: string | null;
    resourceType: ResourceType | null;
    isOpen: boolean;
    togglePanel: () => void;
    openResource: (id: string, type: ResourceType) => void;
    closeResource: () => void;
}

export const useResourceDetailStore = create<ResourceDetailState>()(
    persist(
        (set) => ({
            resourceId: null,
            resourceType: null,
            isOpen: false,

            togglePanel: () =>
                set((state) => ({
                    isOpen: !state.isOpen
                })),

            openResource: (id, type) =>
                set({
                    resourceId: id,
                    resourceType: type,
                    isOpen: true,
                }),

            closeResource: () =>
                set({
                    resourceId: null,
                    resourceType: null,
                    isOpen: false,
                }),
        }),
        {
            name: "resource-detail",
            partialize: (state) => ({
                isOpen: state.isOpen,
            }),
        }
    )
)