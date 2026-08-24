"use client"
import PageTitle from "@/components/dashboard/layout/Title/page-title";
import ProfileCompletionCard from "@/components/dashboard/profile/completion/profile-completion-card";
import ProfileHeaderCard from "@/components/dashboard/profile/header/profile-header-card";
import ProfileInfoCard from "@/components/dashboard/profile/infocard/profile-info-card";
import ProfileStatCard from "@/components/dashboard/profile/stat/profile-stat-card";
import ProfileStorageCard from "@/components/dashboard/profile/storage/profile-storage-card";

export default function ProfilePage() {
    return (
        <main className="space-y-5">
            <PageTitle
                title="My Profile"
                subTitle="Manage your personal information and profile details"
            />
            <section>
                <ProfileHeaderCard
                    fullName="Nguyễn Văn An"
                    userId="1234567890"
                    email="nguyenan@example.com"
                />
            </section>
            <div className="grid grid-cols-2 gap-5">
                <section className="flex flex-col gap-5">
                    <ProfileInfoCard />
                    <ProfileStorageCard />
                </section>
                <section className="flex flex-col gap-5">
                    <ProfileCompletionCard />
                    <ProfileStatCard />
                </section>
            </div>
        </main>
    )
}