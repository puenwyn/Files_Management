import Image from "next/image";
import HeaderSearch from "./header-search";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function Header() {
    return (
        <header className="h-[70px] flex justify-between items-center px-6 border-b border-border">
            <HeaderSearch />
            <section className="flex items-center gap-3">
                <ThemeToggle />

                <Image
                    className="size-8 rounded-full object-cover cursor-pointer"
                    src={"/assets/images/aurorabackground.jpg"}
                    alt="Avatar"
                    width={30}
                    height={30}
                />
            </section>
        </header>
    )
}