"use client"
import { toolbarItems } from "@/constants/dashboard/toolbar";
import CategoryItem from "./category-item";
import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";

export default function Toolbar() {

    const [active, setActive] = useState("All");

    const [view, setView] = useState("List")

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                {toolbarItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <CategoryItem
                            key={index}
                            icon={<Icon className="size-4" />}
                            text={item.label}
                            active={active === item.value}
                            onActive={() => setActive(item.value)}
                        />
                    )
                })}
            </div>

            <div className="flex rounded-lg overflow-hidden border-2 border-border">
                <div
                    onClick={() => setView("List")}
                    className={`px-3 py-2 cursor-pointer rounded-md
                        ${view === "List" ? "bg-primary/20 text-primary" : "bg-transparent"}
                `}>
                    <List className="size-5" />
                </div>
                <div
                    onClick={() => setView("Grid")}
                    className={`px-3 py-2 cursor-pointer rounded-md
                        ${view === "Grid" ? "bg-primary/20 text-primary" : "bg-transparent"}
                `}>
                    <LayoutGrid className="size-5" />
                </div>
            </div>
        </div>
    )
}