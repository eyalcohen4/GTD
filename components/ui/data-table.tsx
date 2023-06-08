"use client"

import Link from "next/link"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { DataTablePagination } from "./data-table-pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  className?: string
  rowCta?: string
  onCellClick?: (event: TData) => void
  onCheck?: (event: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onCellClick,
  className,
  rowCta,
  onCheck,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  return (
    <div>
      <Table className={cn(className, "text-md")}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead key={`${headerGroup.id}-select`}></TableHead>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onCellClick && onCellClick(row.original)}
                className={`${onCellClick ? "cursor-pointer" : ""} 
                  text-md animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 data-[state=open]:sm:slide-in-from-bottom-0
                `}
              >
                <TableCell
                  key={`${row.id}-select`}
                  className="flex items-center"
                >
                  <Checkbox
                    circle
                    className="h-6 w-6"
                    checked={row.original?.completed}
                    onClick={(e) => {
                      e.stopPropagation()
                      onCheck && onCheck(row.original)
                    }}
                  />
                </TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                {rowCta ? (
                  <TableCell key={`${row.id}-cta`}>
                    <Button size="xs">{rowCta}</Button>
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
