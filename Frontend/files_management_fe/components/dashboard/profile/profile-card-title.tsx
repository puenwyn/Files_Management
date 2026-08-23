interface ProfileCardTitleProps {
    icon: React.ReactNode;
    title: string;
    titleSub: string;
    component?: React.ReactNode
}

export default function ProfileCardTitle({
    icon,
    title,
    titleSub,
    component
}: ProfileCardTitleProps) {
    return (
        <div className="w-full flex gap-5 items-center justify-between">
            <div className="flex gap-3 items-center">
                <span className="shrink-0 text-primary">{icon}</span>
                <div className="flex-1 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-foreground">{title}</span>
                        <span className="text-xs text-foreground/50">{titleSub}</span>
                    </div>
                </div>
            </div>
            {component}
        </div>
    )
}