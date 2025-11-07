import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const columns = [
  {
    accessorKey: "date",
    header: "Execution Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        month: "short", // Oct
        day: "numeric", // 3
        // hour: "2-digit", // 03
        // minute: "2-digit", // 12
      }).format(date);

      return <div className="text-sm">{formatted}</div>;
    },
  },
  {
    accessorKey: "total_fetched",
    header: "Total Fetched",
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("total_fetched")}</div>
    ),
  },
  {
    accessorKey: "appended",
    header: "Appended to CRM",
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("appended")}</div>
    ),
  },
  {
    accessorKey: "approved",
    header: "Approved",
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("approved")}</div>
    ),
  },
  // {
  //   accessorKey: "pages_fetched",
  //   header: "Pages",
  //   cell: ({ row }) => {
  //     const fetched = row.getValue("pages_fetched");
  //     const max = row.getValue("max_pages_cap");

  //     return (
  //       <div className="text-right font-medium">
  //         {fetched} / {max}
  //       </div>
  //     );
  //   },
  // },

  // {
  //   accessorKey: "processed_leads",
  //   header: "Leads",
  //   cell: ({ row }) => (
  //     <div className="text-right">{row.getValue("processed_leads")}</div>
  //   ),
  // },
  // {
  //   accessorKey: "distinct_leads_checked",
  //   header: "Distinct Leads",
  //   cell: ({ row }) => (
  //     <div className="text-right">{row.getValue("distinct_leads_checked")}</div>
  //   ),
  // },
  // {
  //   accessorKey: "interested_lead_count",
  //   header: "Interested",
  //   cell: ({ row }) => (
  //     <div className="text-right">{row.getValue("interested_lead_count")}</div>
  //   ),
  // },

  // {
  //   accessorKey: "max_emails_cap",
  //   header: "Max Emails",
  //   cell: ({ row }) => (
  //     <div className="text-right">{row.getValue("max_emails_cap")}</div>
  //   ),
  // },
  // {
  //   accessorKey: "max_pages_cap",
  //   header: "Max Pages",
  //   cell: ({ row }) => (
  //     <div className="text-right">{row.getValue("max_pages_cap")}</div>
  //   ),
  //   enableHiding: true,
  //   enableSorting: false,
  //   meta: {
  //     hidden: true, // not built-in, but you can use this to auto-hide in your table init
  //   },
  // },

  // {
  //   accessorKey: "ai_interest_threshold",
  //   header: "AI Threshold",
  //   cell: ({ row }) => (
  //     <div className="text-right">{row.getValue("ai_interest_threshold")}</div>
  //   ),
  // },

  // {
  //   accessorKey: "total_encoded",
  //   header: "Encoded",
  //   cell: ({ row }) => (
  //     <div className="text-right">{row.getValue("total_encoded")}</div>
  //   ),
  // },
  // {
  //   accessorKey: "stopped_early",
  //   header: "Success",
  //   cell: ({ row }) => (
  //     <div className="text-center">
  //       {row.getValue("stopped_early") ? "❌" : "✅"}
  //     </div>
  //   ),
  // },
  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       const log = row.original;
  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //             <DropdownMenuItem
  //               onClick={() => navigator.clipboard.writeText(log.id.toString())}
  //             >
  //               Copy Log ID
  //             </DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem>View details</DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   },
];

export function LogsListTable({ data }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({
    max_pages_cap: false,
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 7,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 py-4 mb-4 ">
        {/* <Input
          placeholder="Filter by ID..."
          value={table.getColumn("id")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="w-[450px] text-xs"
        /> */}
        <div className="ml-auto gap-2 flex ">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={""}>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
                Rows per page <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[5, 10, 20, 50].map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => table.setPageSize(size)}
                  className={
                    table.getState().pagination.pageSize === size
                      ? "font-semibold bg-accent"
                      : ""
                  }
                >
                  Show {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs text-start px-5"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs px-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 mt-4">
        {/* <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
