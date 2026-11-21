"use client"
import Header from "@/components/dashboard/layout/Header/header";
import { Resource } from "@/components/dashboard/layout/ResourceDetail/resource";
import Sidebar from "@/components/dashboard/layout/Sidebar/sidebar";
import AppConfirmDialog from "@/components/shared/dialog/app-confirm-dialog";
import ResourceDialogs from "@/components/shared/dialog/resource-dialog";
import { useConfirmDialogStore } from "@/stores/confirm-dialog.store";
import { useResourceDetailStore } from "@/stores/resource-detail.store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const { isOpen: isResourceOpen, resourceId, resourceType } = useResourceDetailStore();

    const { isOpen: isConfirmOpen, options, closeConfirm } = useConfirmDialogStore();

    return (
        <main className="h-dvh flex">
            <Sidebar />
            <section className="min-w-0 min-h-0 flex-1 flex flex-col">
                <Header />
                <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pt-6 px-6 bg-background flex flex-col">
                    {children}
                </div>
            </section>
            {isResourceOpen && (
                <Resource resourceId={resourceId} resourceType={resourceType} />
            )}
            {options && (
                <AppConfirmDialog
                    open={isConfirmOpen}
                    onOpenChange={(open) => { if (!open) closeConfirm(); }}
                    title={options.title}
                    description={options.description}
                    confirmText={options.confirmText}
                    cancelText={options.cancelText}
                    destructive={options.destructive}
                    onConfirm={() => {
                        options.onConfirm();
                        closeConfirm();
                    }}
                />
            )}
            <ResourceDialogs />
        </main>
    )
}