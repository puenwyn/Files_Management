import FileGridView from "@/components/dashboard/home/list/gridview/file-gridview";
import FolderGridView from "@/components/dashboard/home/list/gridview/folder-gridview";
import Toolbar from "@/components/dashboard/home/toolbar/toolbar";

export default function HomePage() {
    return (
        <main className="space-y-5">
            <section>
                <span>{"My Files > My Folder"}</span>
            </section>

            <section>
                <Toolbar />
            </section>

            <section>
                <FolderGridView />
            </section>

            <section>
                <FileGridView />
            </section>
        </main>
    )
}