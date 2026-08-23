import { Card, CardContent } from "@/components/ui/card"

interface AppCardSectionProps {
    children: React.ReactNode
}

export default function AppCardSection({
    children
}: AppCardSectionProps) {
    return (
        <Card className="ring-0 shadow-sm">
            <CardContent className="flex flex-col space-y-4">
                {children}
            </CardContent>
        </Card>
    )
}