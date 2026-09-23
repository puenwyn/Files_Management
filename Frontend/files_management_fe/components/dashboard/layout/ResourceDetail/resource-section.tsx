interface ResourceSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function ResourceSection({
    title,
    children
}: ResourceSectionProps) {
    return (
        <section className="flex flex-col gap-3">
            <span>{title}</span>
            {children}
        </section>
    )
}