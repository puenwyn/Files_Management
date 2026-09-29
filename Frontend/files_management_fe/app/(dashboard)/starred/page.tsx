import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import PageTitle from "@/components/dashboard/layout/Title/page-title";

export default function StarredPage() {

    return (
        <main className="min-h-full flex flex-col space-y-5">
            <PageTitle
                title="Starred"
                subTitle="Your starred files and folders will appear here"
            />
            <div className="h-full flex items-center justify-center">
                <StateView {...stateViewData.emptyStarred} />
            </div>
        </main>
    )
}