import { Button } from "@/components/ui/button";
import { Clock, LogOut, MapPin } from "lucide-react";

interface SessionItemProps {
    icon: React.ReactNode;
    device: string;
    browser: string;
    location: string;
    lastActive: string;
    current?: boolean;
    onLogout?: () => void;
}

export default function SessionItem({
    icon,
    device,
    browser,
    location,
    lastActive,
    current = false,
    onLogout
}: SessionItemProps) {
    return (
        <div className="
                grid
                grid-cols-[minmax(0,1fr)_auto]
                items-center
                gap-4
                px-4 py-3
                md:grid-cols-[minmax(200px,1.2fr)_minmax(180px,1fr)_minmax(140px,.8fr)_auto]
        ">
            <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0">
                    {icon}
                </span>
                <div className="flex min-w-0 items-center gap-2">
                    <span className="min-w-0 truncate">{device || "Unknown"} · {browser}</span>
                    {current && (
                        <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            Current session
                        </span>
                    )}
                </div>
            </div>

            <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
                <MapPin className="size-4 shrink-0" />
                <span className="truncate">{location}</span>
            </div>

            {/* Last active */}
            <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
                <Clock className="size-4 shrink-0" />
                <span className="truncate">{lastActive}</span>
            </div>

            <div className="justify-self-end">
                {current ? (
                    <div className="h-9 w-24" />
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-24 text-destructive hover:text-destructive"
                        onClick={onLogout}
                    >
                        <LogOut className="size-4" />
                        <span className="hidden sm:inline">
                            Sign out
                        </span>
                    </Button>
                )}
            </div>
        </div>
    )
}