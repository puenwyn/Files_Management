"use client";

import { Copy, Link } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { ShareHeader } from "./share-header";
import { ShareAddPeople } from "./share-add-people";
import { SharePeopleList } from "./share-people-list";
import { ShareFooter } from "./share-footer";
import { ShareGeneralAccess } from "./share-general-access";
import { ResourceType } from "@/types/resource.type";

interface ShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    resourceId: string;
    resourceName: string;
    resourceType: ResourceType;
}

export function ShareDialog({
    open,
    onOpenChange,
    resourceId,
    resourceName,
    resourceType,
}: ShareDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="w-[600px] !max-w-[600px] gap-0 overflow-hidden rounded-2xl p-0">
                <DialogHeader className="border-b px-6 py-5">
                    <ShareHeader
                        resourceName={resourceName}
                        resourceType={resourceType}
                    />
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                    <ShareAddPeople
                        resourceId={resourceId}
                        resoureType={resourceType}
                    />

                    <SharePeopleList
                        resourceId={resourceId}
                        resourceType={resourceType}
                    />

                    <section className="mt-7">
                        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                <Link className="h-5 w-5 text-blue-500" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium">
                                    Copy link
                                </p>

                                <p className="truncate text-xs text-muted-foreground">
                                    Only people with access can open
                                </p>
                            </div>

                            <Button variant="outline">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                            </Button>
                        </div>
                    </section>
                </div>

                <ShareFooter
                    onCancel={() => onOpenChange(false)}
                    onDone={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}