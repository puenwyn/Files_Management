interface CategoryItemProps {
    icon: React.ReactNode;
    text: string;
    active: boolean;
    onActive: () => void
}

export default function CategoryItem({
    icon,
    text,
    active,
    onActive
}: CategoryItemProps) {
    return (
        <div
            onClick={onActive}
            className={`
                flex w-full items-center gap-1 
                px-2.5 py-1 rounded-lg cursor-pointer
                bg-muted
                ${active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }
        `}>
            <span className="shrink-0">{icon}</span>
            <span className="text-sm font-medium">{text}</span>
        </div>
    )
}