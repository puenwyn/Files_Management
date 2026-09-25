"use client";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { MenuItem } from "@/constants/dashboard/menu";
import React from "react";
import AppContextMenuItem from "./context-menu-item";

interface AppContextMenuProps {
    children: React.ReactNode;
    items: MenuItem[];
}

export default function AppContextMenu({
    children,
    items
}: AppContextMenuProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger className="w-full flex-1">
                {children}
            </ContextMenuTrigger>

            <ContextMenuContent className="w-64">
                {items.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <React.Fragment key={`${item.action}-${index}`}>
                            {item.separator && <ContextMenuSeparator />}

                            {item.subMenu ? (
                                <ContextMenuSub>
                                    <ContextMenuSubTrigger className="px-3 py-1.5 cursor-pointer">
                                        {Icon && <Icon className="size-4" />}
                                        {item.label}
                                    </ContextMenuSubTrigger>

                                    <ContextMenuSubContent className="w-64">
                                        {item.subMenu.map(
                                            (subItem, subIndex) => {
                                                const SubIcon = subItem.icon;

                                                return (
                                                    <React.Fragment key={`${subItem.action}-${subIndex}`}>
                                                        {subItem.separator && (<ContextMenuSeparator />)}

                                                        <AppContextMenuItem
                                                            icon={
                                                                SubIcon ? (
                                                                    <SubIcon className="size-4" />
                                                                ) : undefined
                                                            }
                                                            action={subItem.action}
                                                            destructive={subItem.destructive}
                                                            onClick={subItem.onClick}
                                                        />
                                                    </React.Fragment>
                                                );
                                            }
                                        )}
                                    </ContextMenuSubContent>
                                </ContextMenuSub>
                            ) : (
                                <AppContextMenuItem
                                    icon={
                                        Icon ? (
                                            <Icon className="size-4" />
                                        ) : undefined
                                    }
                                    action={item.action}
                                    destructive={item.destructive}
                                    onClick={item.onClick}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </ContextMenuContent>
        </ContextMenu>
    );
}