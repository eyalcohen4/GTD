import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import db from "@/lib/db"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user?.id) {
        token.sub = user.id
      }

      return token
    },
    session: async ({ session, token, user }) => {
      if (session?.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  debug: true,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
