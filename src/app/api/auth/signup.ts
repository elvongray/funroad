import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

const signUpSchema = z.object({
  email: z.email({
    message: 'Invalid email address',
  }),
  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const result = await signUpSchema.safeParseAsync(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: 'Invalid input',
      errors: result.error,
    });
  }

  const { email, password } = result.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        hashedPassword: hashedPassword,
      },
    });

    return res
      .status(201)
      .json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    return res
      .status(500)
      .json({ message: 'An error occurred during registration' });
  }
}
