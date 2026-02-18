import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { Role } from '@prisma/client'
import { SESSION } from './constants'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: SESSION.MAX_AGE,
    updateAge: SESSION.UPDATE_AGE,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = loginSchema.parse(credentials)

          // Lazy-load Prisma to avoid bundling pg adapter in Edge Runtime (middleware)
          const { prisma } = await import('./prisma')

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            return null
          }

          const isValid = await bcrypt.compare(password, user.passwordHash)

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as Role) || 'CUSTOMER'
        session.user.id = (token.id as string) || ''
      }
      return session
    },
  },
})
