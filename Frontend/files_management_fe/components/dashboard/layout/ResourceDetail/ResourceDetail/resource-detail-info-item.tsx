interface ResourceDetailInfoItemProps {
    title: string;
    content: string;
}

export default function ResourceDetailInfoItem({
    title,
    content
}: ResourceDetailInfoItemProps) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-xs">{title}</p>
            <p className="text-foreground/80">{content}</p>
        </div>
    )
}