import { NextResponse } from "next/server"
import { getKpi, updateKpi } from "@/backend/kpi"
import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const DELETE = async (
  request: Request,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions)

    const kpi = await getKpi(id)

    if (kpi?.userId !== session?.user?.id) {
      return 403
    }

    const updated = await updateKpi(id, {
      isDeleted: true,
    })
    return NextResponse.json({ kpi: updated })
  } catch (error) {
    console.log(error)
    return error
  }
}
