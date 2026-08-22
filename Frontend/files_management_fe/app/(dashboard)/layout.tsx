import Header from "@/components/dashboard/layout/Header/header";
import Sidebar from "@/components/dashboard/layout/Sidebar/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen flex">
            <Sidebar />
            <section className="flex-1">
                <Header />
                <div className="p-6">
                    {children}
                </div>
            </section>
        </main>
    )
}