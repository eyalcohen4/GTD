import {
  Board,
  BoardInput,
  Column,
  ColumnInput,
  TaskColumn,
  TaskColumnInput,
} from "@/types/board"
import prisma from "@/lib/db"

export const createBoard = async (input: BoardInput): Promise<Board> => {
  const board = await prisma.board.create({
    data: {
      title: input.title,
      userId: input.userId,
    },
  })

  const columns = [
    {
      title: "Open",
      color: "#2563eb",
    },
    {
      title: "Close",
      color: "#16a34a",
    },
    {
      title: "On Hold",
      color: "#d97706",
    },
  ]

  for (const column of columns) {
    await prisma.column.create({
      data: {
        order: columns.indexOf(column),
        title: column.title,
        color: column.color,
        boardId: board.id,
      },
    })
  }

  return board
}

export const getBoards = async (userId: string): Promise<Array<Board>> => {
  return prisma.board.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export const getBoard = async (
  id: string
): Promise<(Board & { columns: Array<Column> }) | null> => {
  const board = await prisma.board.findUnique({
    where: {
      id,
    },
  })

  const columns = await prisma.column.findMany({
    where: {
      boardId: id,
    },
    orderBy: {
      order: "asc",
    },
  })

  if (!board) {
    return null
  }

  return {
    ...board,
    columns,
  }
}

export const updateBoard = async (
  id: string,
  title: string
): Promise<Board> => {
  return prisma.board.update({
    where: {
      id,
    },
    data: {
      title,
    },
  })
}

export const deleteBoard = async (id: string): Promise<Board> => {
  return prisma.board.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const createColumn = async (input: ColumnInput): Promise<Column> => {
  return prisma.column.create({
    data: {
      title: input.title,
      boardId: input.boardId,
      order: input.order || 1,
    },
  })
}

export const getColumns = async (boardId: string): Promise<Array<Column>> => {
  return prisma.column.findMany({
    where: {
      boardId,
    },
    orderBy: {
      order: "asc",
    },
  })
}

export const getColumn = async (
  id: string
): Promise<(Column & { board: Board | null }) | null> => {
  return prisma.column.findUnique({
    where: {
      id,
    },
    include: {
      board: true,
    },
  })
}

export const updateColumn = async (
  id: string,
  title: string,
  order?: number
): Promise<Column> => {
  return prisma.column.update({
    where: {
      id,
    },
    data: {
      title,
      order,
    },
  })
}

export const deleteColumn = async (id: string): Promise<Column> => {
  return prisma.column.delete({
    where: {
      id,
    },
  })
}

export const createTaskColumn = async (
  input: TaskColumnInput
): Promise<TaskColumn> => {
  const order = await prisma.taskColumn.count({
    where: {
      columnId: input.columnId,
    },
  })

  return prisma.taskColumn.create({
    // @ts-ignore
    data: {
      taskId: input.taskId,
      columnId: input.columnId,
      order: order + 1,
    },
  })
}

export const deleteTaskColumn = async (id: string): Promise<TaskColumn> => {
  return prisma.taskColumn.delete({
    where: {
      id,
    },
  })
}

export const updateTaskColumn = async (
  id: string,
  input: TaskColumnInput
): Promise<TaskColumn> => {
  return prisma.taskColumn.update({
    where: {
      id,
    },
    data: {
      taskId: input?.taskId ? input.taskId : undefined,
      columnId: input.columnId,
      order: input?.order ? input.order : undefined,
    },
  })
}

export const getTaskColumn = async (
  id: string
): Promise<(TaskColumn & { column: Column & { board: Board } }) | null> => {
  return prisma.taskColumn.findUnique({
    where: {
      id,
    },
    include: {
      column: {
        include: {
          board: true,
        },
      },
    },
  })
}

export const getColumnsTasks = async (
  columnId: string
): Promise<Array<TaskColumn>> => {
  return prisma.taskColumn.findMany({
    where: {
      columnId,
    },
    include: {
      task: {
        include: {
          contexts: {
            select: {
              id: true,
              title: true,
              color: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  })
}
