import PageTitle from "@/components/dashboard/layout/Title/page-title";
import ChangePassword from "@/components/dashboard/security/change-password/change-password";
import SecuritySessionsCard from "@/components/dashboard/security/sessions/security-sessions-card";

export default function SecurityPage() {
    return (
        <main className="space-y-5">
            <PageTitle
                title="Security"
                subTitle="Manage your password, active sessions and security performance"
            />
            <section>
                <ChangePassword />
            </section>
            <section>
                <SecuritySessionsCard />
            </section>
        </main>
    )
}