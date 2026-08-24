interface PageTitleProps {
    title: string;
    subTitle: string;
}

export default function PageTitle({
    title,
    subTitle
}: PageTitleProps) {
    return (
        <div className="flex flex-col">
            <span className="text-xl text-foreground font-bold">{title}</span>
            <span className="text-xs text-foreground/50 font-medium">{subTitle}</span>
        </div>
    )
}