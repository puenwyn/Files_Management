import { cn } from "@/lib/utils";

interface AppTableHeaderProps {
    className?: string;
}

export default function AppTableHeader({
    className
}: AppTableHeaderProps) {
    return (
        <div
            className={cn(
                "grid h-10 items-center border-b px-4",
                "grid-cols-[minmax(200px,1fr)_180px_100px]",
                "sm:grid-cols-[minmax(220px,1fr)_140px_180px_100px]",
                "lg:grid-cols-[minmax(280px,1fr)_180px_180px_200px_100px]",
                "text-sm font-medium text-muted-foreground",
                "bg-card",
                className
            )}
        >
            <div>Tên</div>

            {/* Chủ sở hữu */}
            <div className="hidden sm:block bg-red">
                Chủ sở hữu
            </div>

            {/* Ngày sửa đổi */}
            <div className="hidden lg:block">
                Ngày sửa đổi
            </div>

            {/* Kích cỡ */}
            <div className="">Kích cỡ tệp</div>

            {/* Công cụ */}
            <div className="">Hi</div>

        </div>
    )
}