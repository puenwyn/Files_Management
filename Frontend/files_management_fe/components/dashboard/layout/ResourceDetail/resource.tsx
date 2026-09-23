import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResourceDetail from "./ResourceDetail/resource-detail";
import ResourceActivity from "./resource-activity";
import { ResourceType } from "@/types/resource.type";

interface ResouceProps {
    open?: boolean;
    onClose?: () => void
}

export function Resource({
    open,
    onClose
}: ResouceProps) {
    return (
        <aside className="w-80 shrink-0">
            <div className="">
                <h2>Detail</h2>
                <Tabs defaultValue="" >
                    <TabsList>
                        <TabsTrigger value="detail">Detail</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="detail">
                        <ResourceDetail resource={ResourceType.FOLDER} resourceId="" />
                    </TabsContent>
                    <TabsContent value="activity">
                        <ResourceActivity />
                    </TabsContent>
                </Tabs>
            </div>
        </aside>
    )
}