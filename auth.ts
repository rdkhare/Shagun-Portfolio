import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Get authorized emails from environment variables
const getAuthorizedEmails = (): string[] => {
  const emailsString = process.env.AUTHORIZED_ADMIN_EMAILS
  if (!emailsString) return []

  return emailsString
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0)
}

const AUTHORIZED_EMAILS = getAuthorizedEmails()

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        return AUTHORIZED_EMAILS.includes(user.email)
      }
      return false
    },
    async jwt({ token, user }) {
      if (user && user.email && AUTHORIZED_EMAILS.includes(user.email)) {
        token.role = "admin"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
