"use client";

import Link from "next/link";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface AppBreadcrumbProps {
    items: BreadcrumbItem[];
}

export function AppBreadcrumb({
    items,
}: AppBreadcrumbProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList className="select-none">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <div
                            key={`${item.label}-${index}`}
                            className="flex items-center gap-2"
                        >
                            {index > 0 && <BreadcrumbSeparator />}

                            <BreadcrumbItem>
                                {isLast || !item.href ? (
                                    <BreadcrumbPage>
                                        {item.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink
                                        render={
                                            <Link href={item.href} />
                                        }
                                    >
                                        {item.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}