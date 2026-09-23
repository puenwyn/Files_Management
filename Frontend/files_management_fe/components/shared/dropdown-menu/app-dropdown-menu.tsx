"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItem } from "@/constants/dashboard/menu";
import React from "react";
import AppDropdownMenuItem from "./dropdown-menu-item";

interface AppDropdownMenuProps {
    children: React.ReactNode;
    items: MenuItem[];
}

export default function AppDropdownMenu({
    children,
    items,
}: AppDropdownMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <React.Fragment key={`${item.action}-${index}`}>
                            {item.separator && <DropdownMenuSeparator />}
                            {item.subMenu ? (
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="px-3 py-1.5 cursor-pointer">
                                        {Icon && (<Icon className="size-4" />)}{item.label}
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-64">
                                        {item.subMenu.map(
                                            (subItem, subIndex) => {
                                                const SubIcon = subItem.icon;
                                                return (
                                                    <React.Fragment key={`${subItem.action}-${subIndex}`}>
                                                        {subItem.separator && (<DropdownMenuSeparator />)}

                                                        <AppDropdownMenuItem
                                                            icon={
                                                                SubIcon ? (
                                                                    <SubIcon className="size-4" />
                                                                ) : undefined
                                                            }
                                                            action={subItem.label}
                                                            destructive={subItem.destructive}
                                                            disabled={subItem.disabled}
                                                            onClick={subItem.onClick}
                                                        />
                                                    </React.Fragment>
                                                );
                                            }
                                        )}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            ) : (
                                <AppDropdownMenuItem
                                    icon={
                                        Icon ? (
                                            <Icon className="size-4" />
                                        ) : undefined
                                    }
                                    action={item.label}
                                    destructive={item.destructive}
                                    disabled={item.disabled}
                                    onClick={item.onClick}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}