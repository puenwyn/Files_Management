import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ResourceTableRow from "./resource-table-row";
import { ResourceType } from "@/types/resource.type";
import { defaultResourceTableColumns, ResourceTableColumn, ResourceTableResource } from "./resource-table-column";

interface ResourceTableProps {
    resources: ResourceTableResource[];
    columns?: ResourceTableColumn[];
}

export default function ResourceTable({
    resources,
    columns = defaultResourceTableColumns
}: ResourceTableProps) {
    return (
        <div className="">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={column.key}
                                className={column.className}
                            >
                                {column.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.map((resource) => (
                        <ResourceTableRow
                            key={resource.id}
                            resource={resource}
                            columns={columns}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}