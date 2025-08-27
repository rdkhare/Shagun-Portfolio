import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Extend NextAuth types to include role
declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }

  interface User {
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}

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

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Only allow access if the email is in the authorized emails list
      if (account?.provider === "google" && user?.email) {
        return AUTHORIZED_EMAILS.includes(user.email)
      }
      return false
    },
    async jwt({ token, user }) {
      // Set role to admin if user email is in authorized list
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
    }
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors to login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
} 