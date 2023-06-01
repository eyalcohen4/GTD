import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  debug: true,
})

export { handler as GET, handler as POST }
