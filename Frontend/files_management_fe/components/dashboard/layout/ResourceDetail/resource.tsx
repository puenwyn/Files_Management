import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResourceDetail from "./ResourceDetail/resource-detail";
import ResourceActivity from "./resource-activity";
import { ResourceType } from "@/types/resource.type";
import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";

interface ResouceProps {
    resourceId: string | null;
    resourceType: ResourceType | null;
}

export function Resource({
    resourceId,
    resourceType
}: ResouceProps) {

    return (
        <aside className="w-80 shrink-0">
            <div className="h-full flex justify-center items-center bg-card">
                {resourceId && resourceType ? (
                    <div className="w-full h-full p-4 space-y-3">
                        <h2>Detail</h2>
                        <Tabs defaultValue="detail" className="w-full">
                            <TabsList className="w-full">
                                <TabsTrigger value="detail">Detail</TabsTrigger>
                                <TabsTrigger value="activity">Activity</TabsTrigger>
                            </TabsList>
                            <TabsContent value="detail">
                                <ResourceDetail resource={resourceType} resourceId={resourceId} />
                            </TabsContent>
                            <TabsContent value="activity">
                                <ResourceActivity resourceId={resourceId} />
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    <StateView {...stateViewData.noResource} />
                )}
            </div>
        </aside>
    )
}