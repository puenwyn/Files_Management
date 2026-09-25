import Header from "@/components/dashboard/layout/Header/header";
import { Resource } from "@/components/dashboard/layout/ResourceDetail/resource";
import Sidebar from "@/components/dashboard/layout/Sidebar/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="h-dvh flex">
            <Sidebar />
            <section className="min-w-0 min-h-0 flex-1 flex flex-col">
                <Header />
                <div className="min-h-0 flex-1 overflow-y-auto pt-6 px-6 bg-background flex flex-col">
                    {children}
                </div>
            </section>
            {/* <Resource /> */}
        </main>
    )
}