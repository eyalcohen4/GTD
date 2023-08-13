"use client"

import { useState } from "react"
import { Dialog } from "@radix-ui/react-dialog"

import { ColumnInput } from "@/types/board"
import { useCreateColumn, useDeleteBoard, useGetBoard } from "@/hooks/boards"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Board } from "@/components/board"

export default function BoardPage({
  params: { id },
}: {
  params: {
    id: string
  }
}) {
  const { data } = useGetBoard(id)
  const { mutate: deleteBoard } = useDeleteBoard()

  const handleDelete = async () => {
    await deleteBoard(id)
  }

  return (
    <div className="md:px-8 px-4 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold flex gap-2 items-center">
          {data?.board?.title} Board
        </h1>
        <Button onClick={handleDelete}>Delete Board</Button>
      </div>
      <div>
        <Card className="border-none">
          <Board boardId={id} />
        </Card>
      </div>
    </div>
  )
}
