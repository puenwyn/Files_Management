import { TableCell, TableRow } from "@/components/ui/table";
import { ResourceTableColumn, ResourceTableResource } from "./resource-table-column";

interface ResourceTableRowProps {
    resource: ResourceTableResource;
    columns: ResourceTableColumn[];
}

export default function ResourceTableRow({
    resource,
    columns,
}: ResourceTableRowProps) {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column.key}
                    className={column.className}
                >
                    {column.getValue(resource)}
                </TableCell>
            ))}
        </TableRow>
    );
}