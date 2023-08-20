import { NextResponse } from "next/server"
import { getProjects } from "@/backend/project"
import { Resend } from "resend"

import { EmailTemplate } from "@/components/emails/morning"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  try {
    const projects = await getProjects({
      userId: "ckq8q2q2d0000h1l9q8q2q2d0",
    })
    
    const data = await resend.emails.send({
      from: "Stay Current <morning@staycurrent.app>",
      to: ["eyalcohen4.ec@gmail.com"],
      subject: "Your Summary",
      react: EmailTemplate({ firstName: "John" }),
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error })
  }
}
