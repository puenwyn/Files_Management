import FileItem from "./file-item";

export default function FileGridView() {
    return (
        <div className="
            grid
            grid-cols-2
            md:grid-cols-3
            xl:grid-cols-5
            gap-4
        ">
            <FileItem
            />
            <FileItem
            />
            <FileItem
            />
            <FileItem
            />
            <FileItem
            />
        </div>
    )
}