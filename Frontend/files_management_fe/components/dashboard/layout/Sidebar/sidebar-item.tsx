import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
    icon: React.ReactNode;
    title: string;
    href: string;
}

export default function SidebarItem({
    icon,
    title,
    href
}: SidebarItemProps) {

    const pathname = usePathname();

    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
        >
            <span className="shrink-0">{icon}</span>
            <span className="text-sm font-medium">{title}</span>
        </Link>
    )
}