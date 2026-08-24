export default function SessionBox({
    current = false,
    children
}: { current?: boolean, children: React.ReactNode }) {
    return (
        <div className={`flex flex-col divide-y divide-border rounded-lg ${current ? "bg-primary/10" : "bg-muted"}`}>
            {children}
        </div>
    )
}