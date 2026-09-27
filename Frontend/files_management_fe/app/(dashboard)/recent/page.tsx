import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import PageTitle from "@/components/dashboard/layout/Title/page-title";
import { WebSocketTest } from "@/components/test/websocket-test";

export default function RecentPage() {
    return (
        <main className="min-h-full flex flex-col space-y-5">
            <PageTitle
                title="Recent"
                subTitle="View files that you have accessed recently"
            />
            <div className="h-full flex items-center justify-center">
                <StateView {...stateViewData.emptyRecent} />
            </div>
        </main>
    )
}