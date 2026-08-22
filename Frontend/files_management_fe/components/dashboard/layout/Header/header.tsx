import Image from "next/image";
import HeaderSearch from "./header-search";
import ThemeToggle from "@/components/theme/theme-toggle";
import UserDropdownMenu from "./DropdownMenu/user-dropdown-menu";

export default function Header() {
    return (
        <header className="h-[70px] flex justify-between items-center px-6 border-b border-border">
            <HeaderSearch />
            <section className="flex items-center gap-3">
                <ThemeToggle />

                <UserDropdownMenu />
            </section>
        </header>
    )
}