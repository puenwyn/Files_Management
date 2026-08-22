interface SidebarSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function SidebarSection({
    title,
    children
}: SidebarSectionProps) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-secondary-foreground/65 text-xs font-semibold uppercase">{title}</span>
            {children}
        </div>
    )
}