"use client"

import dayjs from "dayjs"
import { useSession } from "next-auth/react"

export const Greeting = () => {
  const { data } = useSession()
  const hour = dayjs().hour()

  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"
  const emoji = hour < 12 ? "☀️" : hour < 18 ? "🌞" : "🌕"
  const firstName = data?.user?.name?.split(" ")[0]

  return (
    <h1 className="md:text-3xl text-2xl font-bold tracking-tight border-none w-full">
      {greeting}, {firstName} {emoji}
    </h1>
  )
}
