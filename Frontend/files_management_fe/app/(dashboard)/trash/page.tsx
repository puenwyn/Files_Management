"use client"
import PageTitle from "@/components/dashboard/layout/Title/page-title";
import AppTableHeader from "@/components/shared/table/app-table-header";
import AppTableItem from "@/components/shared/table/app-table-item";
import { useGetTrashFolders } from "@/hooks/folder/useGetTrashFolders.hook";

const items = [
    {
        id: "1",
        name: "My Videos, this folder has many videos that help learning English effectively, rapidly and logically",
        owner: "You",
        updatedAt: "28-08-2026",
        size: "2,495 KB",
    },
    {
        id: "2",
        name: "English Documents",
        owner: "You",
        updatedAt: "27-08-2026",
        size: "15.2 MB",
    },
    {
        id: "3",
        name: "Project Files",
        owner: "You",
        updatedAt: "26-08-2026",
        size: "48.7 MB",
    },
    {
        id: "4",
        name: "Study Materials",
        owner: "You",
        updatedAt: "25-08-2026",
        size: "125 MB",
    },
    {
        id: "5",
        name: "Important Documents",
        owner: "You",
        updatedAt: "24-08-2026",
        size: "8,421 KB",
    },
    {
        id: "6",
        name: "React and Next.js",
        owner: "You",
        updatedAt: "23-08-2026",
        size: "67.4 MB",
    },
    {
        id: "7",
        name: "Backend Development",
        owner: "You",
        updatedAt: "22-08-2026",
        size: "34.8 MB",
    },
    {
        id: "8",
        name: "Personal Photos",
        owner: "You",
        updatedAt: "20-08-2026",
        size: "1.24 GB",
    },
    {
        id: "9",
        name: "Design Resources",
        owner: "You",
        updatedAt: "18-08-2026",
        size: "92.6 MB",
    },
    {
        id: "10",
        name: "Archive",
        owner: "You",
        updatedAt: "15-08-2026",
        size: "523 MB",
    },
];

export default function TrashPage() {

    const {
        folders,
        isLoading,
        isError,
        error,
        refetch
    } = useGetTrashFolders();

    return (
        <main className="space-y-5">
            <PageTitle
                title="My Profile"
                subTitle="View and manage files and folders that you have deleted"
            />
            <div className="bg-card">
                <AppTableHeader />
                {folders.map((item) => (
                    <AppTableItem
                        id={item.id}
                        name={item.folderName}
                        owner={item.owner.fullName}
                        updatedAt={item.updatedAt.toDateString()}
                        size={"--"}
                    />
                ))}

                {/* // <AppTableItem
                    //     id={item.id}
                    //     name={item.name}
                    //     owner={item.owner}
                    //     updatedAt={item.updatedAt}
                    //     size={item.size}
                    // /> */}
            </div>

        </main>
    )
}