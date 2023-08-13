import { NextResponse } from "next/server"
import { Resend } from "resend"

import { EmailTemplate } from "@/components/emails/morning"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["eyalcohen4.ec@gmail.com"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: "John" }),
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error })
  }
}
