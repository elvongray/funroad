'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.email({
    message: 'Please provide a valid email address',
  }),
  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // After successful registration, automatically sign in the user
        const result = await signIn('credentials', {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (!result || !result.error) {
          router.push('/dashboard'); // Redirect to the dashboard or home page
        } else {
          // Handle sign-in error
          console.error(result.error);
        }
      } else {
        // Handle registration error (e.g., email already exists)
        const errorData = await response.json();
        console.error(errorData.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-12">
        <h1 className="text-5xl font-bold">Sign Up</h1>
        <Link href="/signin" className="hover:underline">
          Login
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Username</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      </Form>
    </div>
  );
}
