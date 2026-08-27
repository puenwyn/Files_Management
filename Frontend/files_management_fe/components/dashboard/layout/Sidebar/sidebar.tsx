"use client"
import { sidebarFooterItems, sidebarItems, sidebarStorageItems } from "@/constants/dashboard/sidebar";
import SidebarItem from "./sidebar-item";
import SidebarSection from "./sidebar-section";
import BasicDivider from "../Divider/basic-divider";
import SidebarStorage from "./sidebar-storage";
import Image from "next/image";

export default function Sidebar() {
    return (
        <aside className="w-64 shrink-0 overflow-y-auto px-4 bg-card">
            <div className="py-7 flex items-center">
                <Image
                    src="/assets/images/ChatGPTGenerateFLogo.png"
                    alt=""
                    width={40}
                    height={40}
                />
                <span className="
                    origin-left
                    bg-gradient-to-r
                    from-[var(--brand-gradient-start)]
                    to-[var(--brand-gradient-end)]
                    bg-clip-text
                    text-transparent
                    text-lg font-bold
                ">
                    FilesManage
                </span>
            </div>

            <SidebarSection title="Workspace">
                <nav className="flex flex-col gap-2">
                    {sidebarItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <SidebarItem
                                key={index}
                                icon={<Icon className="size-5" />}
                                title={item.title}
                                href={item.href}
                            />
                        )
                    })}
                </nav>
            </SidebarSection>

            <BasicDivider />

            <SidebarSection title="Storage">
                <nav className="flex flex-col gap-2">
                    {sidebarStorageItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <SidebarItem
                                key={index}
                                icon={<Icon className="size-5" />}
                                title={item.title}
                                href={item.href}
                            />
                        )
                    })}
                </nav>
                <SidebarStorage />
            </SidebarSection>

            <BasicDivider />

            <nav className="flex flex-col gap-2">
                {sidebarFooterItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <SidebarItem
                            key={index}
                            icon={<Icon className="size-5" />}
                            title={item.title}
                            href={item.href}
                        />
                    )
                })}
            </nav>

        </aside>
    )
}