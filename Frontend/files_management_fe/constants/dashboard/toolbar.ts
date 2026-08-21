import { FileText, Folder, Image, Play, StickyNotes } from "lucide-react";

export const toolbarItems = [
    {
        label: "All",
        value: "All",
        icon: StickyNotes
    },
    {
        label: "Folders",
        value: "Folders",
        icon: Folder
    },
    {
        label: "Documents",
        value: "Documents",
        icon: FileText
    },
    {
        label: "Images",
        value: "Images",
        icon: Image
    },
    {
        label: "Videos",
        value: "Videos",
        icon: Play
    }
]