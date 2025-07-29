// app/api/auth/[...nextauth]/route.ts (App Router)
// or pages/api/auth/[...nextauth].ts (Pages Router - adjust imports)

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client'; // Adjust the import path based on your setup
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import { ZodError } from 'zod';

const prisma = new PrismaClient();
const signInSchema = z.object({
  email: z.email('Email is required'),
  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email/Password Provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const user = await prisma.user.findUnique({
            where: { email: email },
          });

          if (!user || !user.hashedPassword) {
            return null;
          }

          const isCorrectPassword = await bcrypt.compare(
            password,
            user.hashedPassword
          );

          if (!isCorrectPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            image: user.image,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
        return null;
      },
    }),
    // Social Providers (e.g., Google)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // GitHub Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt', // Use JWT for session management
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', // Custom sign-in page (you'll create this later)
    // You can add more custom pages like signOut, error, verifyRequest
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth and user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        // Optionally, fetch more user data from your DB and add to token
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        token.creatorName = dbUser?.creatorName; // Add creatorName to token
        token.stripeAccountId = dbUser?.stripeAccountId; // Add stripeAccountId
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, e.g. access_token from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.id as string; // Ensure id is string
      session.user.creatorName = token.creatorName as string | null; // Add creatorName to session
      session.user.stripeAccountId = token.stripeAccountId as string | null; // Add stripeAccountId
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
