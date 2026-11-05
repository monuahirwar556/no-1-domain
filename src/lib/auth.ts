import { NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function isAdminAuthorized(request?: NextRequest): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user && (session.user as any).role === 'ADMIN') {
      return true
    }
    const adminKey = request?.headers.get('x-admin-key')
    const envAdminKey = process.env.ADMIN_API_KEY
    if (envAdminKey && envAdminKey.trim().length >= 16 && adminKey === envAdminKey.trim()) {
      return true
    }
  } catch (err) {
    console.error('Admin authorization check error:', err)
  }
  return false
}

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Username/Email and password are required')
        }

        const input = credentials.email.trim().toLowerCase()
        const rawPassword = credentials.password.trim()

        // 1. Master Owner Admin Guaranteed Login (Securely synced with DB)
        const masterAdminPassword = process.env.ADMIN_PASSWORD || 'Monu860@'
        const isMasterAdmin =
          (input === 'support@no1domain.in' ||
           input === 'admin@no1domain.in' ||
           input === 'monuahirwar556@gmail.com' ||
           input === 'monuahirwar556' ||
           input === 'admin') &&
          rawPassword === masterAdminPassword

        if (isMasterAdmin) {
          try {
            const hash = await bcrypt.hash(masterAdminPassword, 10)
            let adminUser = await prisma.user.findFirst({
              where: {
                OR: [
                  { email: 'support@no1domain.in' },
                  { email: 'monuahirwar556@gmail.com' },
                  { name: 'monuahirwar556' },
                  { role: 'ADMIN' },
                ],
              },
            })

            if (!adminUser) {
              adminUser = await prisma.user.create({
                data: {
                  email: 'support@no1domain.in',
                  name: 'MONU AHIRWAR',
                  password: hash,
                  role: 'ADMIN',
                },
              })
            } else {
              // Ensure role is ADMIN and sync password hash
              adminUser = await prisma.user.update({
                where: { id: adminUser.id },
                data: {
                  password: hash,
                  role: 'ADMIN',
                },
              })
            }

            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name || 'Admin',
              role: 'ADMIN',
              avatar: adminUser.avatar,
            }
          } catch (masterErr) {
            console.error('Master admin authentication error:', masterErr)
            throw new Error('Database authentication service unavailable')
          }
        }

        // 2. Standard Database Authentication with strict exact matching
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: input },
              { name: input },
            ],
          },
        })

        if (!user || !user.password) {
          throw new Error('Invalid username/email or password')
        }

        const isValid = await bcrypt.compare(rawPassword, user.password)

        if (!isValid) {
          throw new Error('Invalid username/email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'facebook') {
        try {
          const email = user.email || `${account.providerAccountId}@facebook.user`
          let dbUser = await prisma.user.findUnique({
            where: { email },
          })
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email,
                name: user.name || 'User',
                password: await bcrypt.hash(account.providerAccountId, 10),
                avatar: user.image || null,
                role: 'USER',
              },
            })
          } else if (user.image && dbUser.avatar !== user.image) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { avatar: user.image },
            })
          }
          user.id = dbUser.id
          ;(user as any).role = dbUser.role
          ;(user as any).avatar = dbUser.avatar
        } catch (e) {
          console.error('OAuth user sync error:', e)
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        if ((user as any).avatar) {
          token.picture = (user as any).avatar
        }
      }
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as any
        u.id = token.id as string
        u.role = token.role as string
        u.provider = (token.provider as string) || (token.role === 'ADMIN' ? 'credentials' : undefined)
        if (token.picture) {
          u.image = token.picture
          u.avatar = token.picture
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}