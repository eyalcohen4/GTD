import { TaskColumn } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  Board,
  BoardInput,
  Column,
  ColumnInput,
  TaskColumnInput,
  UpdateBoardInput,
  UpdateColumnInput,
} from "@/types/board"
import { Task, TaskPreview } from "@/types/task"

export function useCreateBoard() {
  const queryClient = useQueryClient()

  return useMutation(
    async (input: BoardInput) => {
      const request = await fetch(`/api/board`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })

      return request.json()
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["boards"]),
    }
  )
}

export function useGetBoards() {
  return useQuery<{ boards: Array<Board> }>(["boards"], async () => {
    const request = await fetch(`/api/board`)
    return request.json()
  })
}

export function useGetBoard(id: string) {
  return useQuery<{ board: Board & { columns: Array<Column> } }>(
    ["boards", id],
    async () => {
      const request = await fetch(`/api/board/${id}`)
      return request.json()
    }
  )
}

export function useUpdateBoard() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id, input }: { id: string; input: UpdateBoardInput }) => {
      const request = await fetch(`/api/board`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, input }),
      })

      return request.json()
    },
    {
      onSettled: () => queryClient.invalidateQueries(["boards"]),
    }
  )
}

export function useDeleteBoard() {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      const request = await fetch(`/api/board/${id}`, {
        method: "DELETE",
      })

      return request.json()
    },
    {
      onSettled: () => queryClient.invalidateQueries(["boards"]),
    }
  )
}

export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation(
    async (input: ColumnInput) => {
      const request = await fetch(`/api/board/${boardId}/column`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })

      return request.json()
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["boards", boardId]),
    }
  )
}

export function useGetColumns(boardId: string) {
  return useQuery(["columns", boardId], async () => {
    const request = await fetch(`/api/board/${boardId}/column`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId }),
    })
    return request.json()
  })
}

export function useUpdateColumn(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id, input }: { id: string; input: UpdateColumnInput }) => {
      const request = await fetch(`/api/board/${boardId}/column`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, input }),
      })

      return request.json()
    },
    {
      onSettled: () => queryClient.invalidateQueries(["columns", boardId]),
    }
  )
}

export function useDeleteColumn(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      const request = await fetch(`/api/board/${boardId}/column/${id}`, {
        method: "DELETE",
      })

      return request.json()
    },
    {
      onSettled: () => queryClient.invalidateQueries(["columns", boardId]),
    }
  )
}

export function useGetColumnsTasks(boardId: string, columnId: string) {
  return useQuery<{ tasks: Array<TaskColumn & { task: TaskPreview }> }>(
    ["column-tasks", columnId],
    async () => {
      const request = await fetch(
        `/api/board/${boardId}/column/${columnId}/task`
      )
      return request.json()
    }
  )
}

export function useCreateColumnTask(boardId: string, columnId: string) {
  const queryClient = useQueryClient()

  return useMutation(
    async (input: TaskColumnInput) => {
      const request = await fetch(
        `/api/board/${boardId}/column/${columnId}/task`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        }
      )

      return request.json()
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(["column-tasks", columnId]),
    }
  )
}

export function useUpdateColumnTask() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({
      from,
      index,
      id,
      input,
    }: {
      from?: string
      index: number
      id: string
      input: TaskColumnInput
    }) => {
      const request = await fetch(`/api/task-column/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, id }),
      })

      return request.json()
    },
    {
      onMutate: async (updated) => {
        if (!updated) {
          return
        }

        console.log(updated)

        const previousContext = queryClient.getQueryData([
          "column-tasks",
          updated.from,
        ])

        // @ts-ignore
        const actualTask = previousContext?.tasks?.find(
          // @ts-ignore
          (task) => task.id === updated.id
        )

        if (updated.from === updated.input.columnId) {
          console.log("index", updated.index)
          const reordered = reorder({
            // @ts-ignore
            items: previousContext?.tasks || [],
            input: updated,
          })

          console.log(reordered)

          queryClient.setQueryData(
            ["column-tasks", updated.from],
            // @ts-ignore
            (old: { tasks?: Array<TaskColumn> }) => {
              return {
                tasks: reordered,
              }
            }
          )

          return
        }

        queryClient.setQueryData(
          ["column-tasks", updated.input.columnId],
          // @ts-ignore
          (old?: { tasks?: Array<TaskColumn> }) => {
            if (old?.tasks) {
              if (updated.index === 0) {
                return { tasks: [actualTask, ...old.tasks] }
              }

              if (updated.index === old.tasks.length - 1) {
                return { tasks: [...old.tasks, actualTask] }
              }

              const tasks = old.tasks
                .slice(0, updated.index)
                .concat([actualTask])
                .concat(old.tasks.slice(updated.index))

              return { tasks }
            }

            return { tasks: [actualTask] }
          }
        )
        queryClient.setQueryData(
          ["column-tasks", updated.from],
          // @ts-ignore
          (old: { tasks?: Array<TaskColumn> }) => {
            const tasks = old?.tasks?.filter((task) => task.id !== updated.id)
            return {
              tasks,
            }
          }
        )

        return { previousContext, updated }
      },
    }
  )
}
function reorder({
  items,
  input,
}: {
  items: Array<any>
  input: {
    from?: string
    index: number
    id: string
    input: TaskColumnInput
  }
}) {
  const { index: order, id } = input

  const itemToMove = items.find((item) => item.id === id)
  if (!itemToMove) {
    throw new Error("Item with the given id not found")
  }

  if (order < 0 || order >= items.length) {
    throw new Error("Order index out of bounds")
  }

  const itemsWithoutMovedItem = items.filter((item) => item.id !== id)
  const reorderedItems = [
    ...itemsWithoutMovedItem.slice(0, order),
    { ...itemToMove, order }, // Update the order of the moved item
    ...itemsWithoutMovedItem.slice(order),
  ]

  // Update the order properties
  return reorderedItems.map((item, index) => ({ ...item, order: index }))
}
