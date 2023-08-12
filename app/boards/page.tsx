"use client"

import Link from "next/link"

import { useGetBoards } from "@/hooks/boards"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateBoard } from "@/components/create-board"

export default function BoardsPage() {
  const { data } = useGetBoards()

  return (
    <div className="md:px-8 px-4 flex flex-col gap-4">
      <div className="flex items-center w-full gap-8">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 13V2l8 4-8 4" />
            <path d="M20.55 10.23A9 9 0 1 1 8 4.94" />
            <path d="M8 10a5 5 0 1 0 8.9 2.02" />
          </svg>
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Boards
          </h3>
        </div>
        <CreateBoard />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {data?.boards?.map((board) => (
          <Card className="cursor-pointer">
            <Link href={`/boards/${board.id}`} className="text-lg">
              <CardHeader>
                <CardTitle>{board.title}</CardTitle>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
