import { CreateViewInput, UpdateViewInput } from "@/types/view"
import prisma from "@/lib/db"

export const createView = async (input: CreateViewInput) => {
  return prisma.view.create({
    data: {
      name: input.name,
      filter: input.filter,
      type: input.type,
      user: {
        connect: {
          id: input.userId,
        },
      },
    },
  })
}

export const updateView = async (id: string, input: UpdateViewInput) => {
  return prisma.view.update({
    where: {
      id,
    },
    data: {
      name: input.name,
      filter: input.filter,
    },
  })
}

export const getViews = async (userId: string) => {
  return prisma.view.findMany({
    where: {
      user: {
        id: userId,
      },
    },
  })
}

export const deleteView = async (id: string) => {
  return prisma.view.delete({
    where: {
      id,
    },
  })
}

export const getView = async (id: string) => {
  return prisma.view.findUnique({
    where: {
      id,
    },
  })
}
