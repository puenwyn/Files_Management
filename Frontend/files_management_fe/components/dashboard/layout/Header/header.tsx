"use client"
import HeaderSearch from "./header-search";
import ThemeToggle from "@/components/theme/theme-toggle";
import UserDropdownMenu from "./DropdownMenu/user-dropdown-menu";
import NotificationDropdownMenu from "./DropdownMenu/NotificationMenu/notification-dropdown-menu";
import { useNotification } from "@/hooks/notification/useNotification.hook";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResourceDetailStore } from "@/stores/resource-detail.store";

export default function Header() {
    useNotification();
    console.log("Notification hook mounted");

    const openPanel = useResourceDetailStore(
        (state) => state.togglePanel
    );

    return (
        <header className="h-20 shrink-0 flex justify-between items-center px-6 border-b border-border">
            <HeaderSearch />
            <section className="flex items-center gap-6">
                <Button onClick={openPanel}>Info</Button>
                <ThemeToggle />
                <NotificationDropdownMenu />
                <UserDropdownMenu />
            </section>
        </header>
    )
}