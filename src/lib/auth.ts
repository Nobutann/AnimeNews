import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                if (!user || !user.password) {
                    return null;
                }

                const valid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!valid) {
                    return null;
                }

                return user;
            },
        }),
    ],
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/login',
    },
})