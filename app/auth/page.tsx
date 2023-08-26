import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Command, Hourglass } from "lucide-react"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/user-auth"

export const metadata: Metadata = {
  title: "Current | Getting It Done",
  description: "Be Current.",
}

export default async function AuthenticationPage() {
  const session = await getServerSession()

  if (session) {
    return redirect("/")
  }

  return (
    <div className="h-screen">
      <div className="h-full md:container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative flex-col bg-muted p-10 text-white dark:border-r lg:flex h-60 md:h-full">
          <div
            className="absolute inset-0 bg-cover opacity-50 bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1505521377774-103a8cc2f735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJlYXV0aWZ1bHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60)",
            }}
          />
          <div className="relative z-20 flex items-center text-xl font-medium">
            <Hourglass className="mr-2 h-8 w-8" /> Current
          </div>
          <div className="relative z-20 mt-4">
            <blockquote className="space-y-2">
              <p className="text-lg">
                Current is an app designed to help you stay present and focused
                on what matters most in your life.
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 mt-8 md:mt-0 px-4">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Get Started
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
