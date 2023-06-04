"use client"

import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { useSession } from "next-auth/react"

export const ProfilePicture = () => {
  const { data } = useSession()

  return (
    <Avatar>
      <AvatarImage src={data?.user.image} alt={data?.user.name} />
      <AvatarFallback>{data?.user.name}</AvatarFallback>
    </Avatar>
  )
}
