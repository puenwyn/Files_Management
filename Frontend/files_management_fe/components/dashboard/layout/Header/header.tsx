import Image from "next/image";
import HeaderSearch from "./header-search";
import ThemeToggle from "@/components/theme/theme-toggle";
import UserDropdownMenu from "./DropdownMenu/user-dropdown-menu";
import { Bell } from "lucide-react";
import AppIconButton from "../../iconbutton/app-icon-button";
import NotificationDropdownMenu from "./DropdownMenu/NotificationMenu/notification-dropdown-menu";

export default function Header() {
    return (
        <header className="h-20 shrink-0 flex justify-between items-center px-6 border-b border-border">
            <HeaderSearch />
            <section className="flex items-center gap-6">
                <ThemeToggle />
                <NotificationDropdownMenu />
                <UserDropdownMenu />
            </section>
        </header>
    )
}