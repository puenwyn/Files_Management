"use client"
import DriveItem from "@/components/dashboard/drive/drive-item";
import PageTitle from "@/components/dashboard/layout/Title/page-title";
import { useGetDrives } from "@/hooks/drive/drive.hook";

export default function DrivesPage() {

    const { drives } = useGetDrives();

    return (
        <main className="space-y-5">
            <PageTitle
                title="My Drives"
                subTitle="Manage your drives and storage"
            />
            <div className="grid grid-cols-4 gap-4">
                {drives.map((drive) => (
                    <DriveItem
                        key={drive.id}
                        id={drive.id}
                        driveName={drive.driveName}
                        totalStorage={Number(drive.totalSpace)}
                        usedStorage={Number(drive.usedSpace)}
                        usedPercent={Number(drive.usedPercent)}
                        primary={drive.primary}
                    />
                ))}
                {/* <DriveItem
                    title="My Drive"
                    totalStorage={6}
                    usedStorage={1.5}
                    usedPercent={25}
                />
                <DriveItem
                    title="My Drive"
                    totalStorage={6}
                    usedStorage={1.5}
                    usedPercent={25}
                />
                <DriveItem
                    title="My Drive"
                    totalStorage={6}
                    usedStorage={1.5}
                    usedPercent={25}
                />
                <DriveItem
                    title="My Drive"
                    totalStorage={6}
                    usedStorage={1.5}
                    usedPercent={25}
                /> */}
            </div>
        </main>
    )
}