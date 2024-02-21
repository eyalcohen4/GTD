"use client"

import { useState } from "react"
import Link from "next/link"
import { goalsStatuses } from "@/constants/statuses"
import { ResponsiveLine } from "@nivo/line"
import dayjs from "dayjs"
import {
  DeleteIcon,
  HashIcon,
  Loader,
  MoreHorizontal,
  PlusIcon,
  TrashIcon,
} from "lucide-react"

import { GoalPreview, UpdateGoalInput } from "@/types/goal"
import { Kpi } from "@/types/kpi"
import { cn } from "@/lib/utils"
import { useDeleteGoal } from "@/hooks/goals"
import { useCreateKpiEntry, useDeleteKpi, useGetKpis } from "@/hooks/kpis"
import { toast } from "@/hooks/use-toast"

import { ComboboxPopover } from "./combobox"
import { DatePicker } from "./date-picker"
import {
  FormProperty,
  FormPropertyLabel,
  FormPropertyValue,
} from "./form-properties"
import { useGoals } from "./providers/goals-provider"
import { useProjects } from "./providers/projects-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent } from "./ui/dialog"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export const KpiList = () => {
  const query = useGetKpis()

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {query.isLoading ? (
        <Loader />
      ) : (
        query.data?.kpis?.map((kpi) => (
          <KpiListItem key={kpi.title} kpi={kpi} />
        ))
      )}
    </ul>
  )
}

const KpiListItem = ({ kpi }: { kpi: Kpi }) => {
  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <CardHeader className="flex justify-between items-center flex-row p-2">
        <CardTitle>{kpi.title}</CardTitle>
        <div>
          <DeleteKpi id={kpi.id} />
          <AddEntry id={kpi.id} />
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveLine
          data={[
            {
              id: "kpi",
              data: kpi.entries.map((entry) => ({
                x: dayjs(entry.date).format("YYYY-MM-DD"),
                y: entry.value,
              })),
            },
          ]}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          xScale={{ type: "time", format: "%Y-%m-%d", useUTC: false }}
          xFormat="time:%Y-%m-%d"
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: "%b %d",
            tickValues: "every 1 day",
          }}
          axisLeft={{
            // orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "value",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          colors={{ scheme: "category10" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
        />
      </CardContent>
    </Card>
  )
}

const DeleteKpi = ({ id }: { id: string }) => {
  const deleteKpi = useDeleteKpi()

  const handleDelete = async () => {
    try {
      await deleteKpi.mutateAsync({ id })
    } catch (error) {}
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <TrashIcon className="h-4 w-4 text-red-400" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          Areyou sure you want to delete this goal?
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={() => handleDelete()}>Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const AddEntry = ({ id }: { id: string }) => {
  const createEntry = useCreateKpiEntry()
  const [value, setValue] = useState("")

  const handleAddEntry = async () => {
    try {
      await createEntry.mutateAsync({
        kpiId: id,
        date: new Date().toISOString(),
        value: parseFloat(value),
      })
    } catch (error) {}
  }

  return (
    <Popover>
      <PopoverTrigger>
        <PlusIcon />
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
          />
          <Button className="w-full" onClick={handleAddEntry}>
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
