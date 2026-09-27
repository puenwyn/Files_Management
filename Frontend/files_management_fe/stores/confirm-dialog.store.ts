import { create } from "zustand";

type ConfirmOptions = {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    onConfirm: () => void;
};

type ConfirmDialogState = {
    isOpen: boolean;
    options: ConfirmOptions | null;
    openConfirm: (options: ConfirmOptions) => void;
    closeConfirm: () => void;
};

export const useConfirmDialogStore = create<ConfirmDialogState>((set) => ({
    isOpen: false,
    options: null,

    openConfirm: (options) =>
        set({
            isOpen: true,
            options,
        }),

    closeConfirm: () =>
        set({
            isOpen: false,
            options: null,
        }),
}));