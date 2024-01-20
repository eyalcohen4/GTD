"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
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
  defaultSort?: [{ id: string; desc: boolean }]
  onCellClick?: (event: TData) => void
  onCheck?: (event: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onCellClick,
  className,
  rowCta,
  defaultSort,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSort || [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      <Table className={cn(className, "text-md")}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
                  text-sm animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 data-[state=open]:sm:slide-in-from-bottom-0
                `}
              >
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
    </div>
  )
}
